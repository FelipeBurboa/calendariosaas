import prisma from "@/app/lib/db";
import { nylas } from "@/app/lib/nylas";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import {
  addMinutes,
  format,
  fromUnixTime,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { GetFreeBusyResponse, NylasResponse } from "nylas";

async function getData(userName: string, selectedDate: Date) {
  const currentDay = format(selectedDate, "EEEE");

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const data = await prisma.availability.findFirst({
    where: {
      day: currentDay as Prisma.EnumDayFilter,
      User: {
        userName: userName,
      },
    },
    select: {
      fromTime: true,
      tillTime: true,
      id: true,
      User: {
        select: {
          grantEmail: true,
          grantId: true,
        },
      },
    },
  });

  const nylasCalendarData = await nylas.calendars.getFreeBusy({
    identifier: data?.User?.grantId as string,
    requestBody: {
      startTime: Math.floor(startOfDay.getTime() / 1000),
      endTime: Math.floor(endOfDay.getTime() / 1000),
      emails: [data?.User?.grantEmail as string],
    },
  });

  return {
    data,
    nylasCalendarData,
  };
}

interface TimeTableProps {
  selectedDate: Date;
  userName: string;
  duration: number;
}

function calculateAvailableTimeSlots(
  date: string,
  dbAvailability: {
    fromTime: string | undefined;
    tillTime: string | undefined;
  },
  nylasData: NylasResponse<GetFreeBusyResponse[]>,
  duration: number
) {
  const now = new Date();
  const availableFrom = parse(
    `${date} ${dbAvailability.fromTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const availableTill = parse(
    `${date} ${dbAvailability.tillTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  // @ts-ignore
  const busySlots = nylasData.data[0].timeSlots.map((slot: any) => ({
    start: fromUnixTime(slot.startTime),
    end: fromUnixTime(slot.endTime),
  }));

  const allSlots = [];
  let currentSlot = availableFrom;
  while (isBefore(currentSlot, availableTill)) {
    allSlots.push(currentSlot);
    currentSlot = addMinutes(currentSlot, duration);
  }

  const freeslots = allSlots.filter((slot) => {
    const slotEnd = addMinutes(slot, duration);
    return (
      isAfter(slot, now) &&
      !busySlots.some(
        (busy: { start: any; end: any }) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
          (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
          (isBefore(slot, busy.start) && isAfter(slotEnd, busy.start))
      )
    );
  });

  return freeslots.map((slot) => format(slot, "HH:mm"));
}

export async function TimeTable({
  selectedDate,
  userName,
  duration,
}: TimeTableProps) {
  const { data, nylasCalendarData } = await getData(userName, selectedDate);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const dbAvailability = {
    fromTime: data?.fromTime,
    tillTime: data?.tillTime,
  };

  const availableSlot = calculateAvailableTimeSlots(
    formattedDate,
    dbAvailability,
    nylasCalendarData,
    duration
  );

  const dayName = format(selectedDate, "EEE", { locale: es });
  const formattedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  const month = format(selectedDate, "MMM", { locale: es });
  const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  return (
    <div>
      <p className="text-base font-semibold">
        {formattedDay}{" "}
        <span className="text-sm text-muted-foreground">
          {formattedMonth}. {format(selectedDate, "d", { locale: es })}
        </span>
      </p>
      <div className="mt-3 max-h-[300px] overflow-y-auto">
        {availableSlot.length > 0 ? (
          availableSlot.map((slot, index) => (
            <Link
              key={index}
              href={`?date=${format(selectedDate, "yyyy-MM-dd")}&time=${slot}`}
            >
              <Button
                className="w-full mb-2 hover:bg-primary text-black dark:text-white hover:text-white"
                variant="outline"
              >
                {slot}
              </Button>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay disponibilidad disponible
          </p>
        )}
      </div>
    </div>
  );
}
