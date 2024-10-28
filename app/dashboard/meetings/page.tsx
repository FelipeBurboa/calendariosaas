import { cancelMeetingAction } from "@/app/actions";
import { EmptyState } from "@/app/components/EmptyState";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { nylas } from "@/app/lib/nylas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/app/lib/db";
import { format, fromUnixTime } from "date-fns";
import { Video } from "lucide-react";
import { es } from "date-fns/locale";
import { requireUser } from "@/app/lib/hooks";
import Image from "next/image";
import Zoom from "@/public/zoom.svg";
import GoogleMeet from "@/public/meet.png";
import MicrosoftTeams from "@/public/teams.svg";
import { ParticipantsList } from "@/app/components/ParticipantsList";

async function getData(userId: string) {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      grantId: true,
      grantEmail: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }
  const data = await nylas.events.list({
    identifier: userData?.grantId as string,
    queryParams: {
      calendarId: userData?.grantEmail as string,
    },
  });

  return data;
}

const MeetingsPage = async () => {
  const session = await requireUser();
  const data = await getData(session?.user?.id as string);

  const handleLogo = (videoCallSoftware: string) => {
    switch (videoCallSoftware) {
      case "Zoom Meeting":
        return Zoom;
      case "Google Meet":
        return GoogleMeet;
      case "Microsoft Teams":
        return MicrosoftTeams;
    }
  };

  return (
    <>
      {data.data.length < 1 ? (
        <EmptyState
          title="No tienes reuniones"
          description="Haz click en el botón para generar una reunion con tus eventos"
          buttonText="Generar Reunion"
          href="/dashboard/new"
        />
      ) : (
        <Card className="max-w-[1000px] w-full mx-auto">
          <CardHeader>
            <CardTitle>Reuniones</CardTitle>
            <CardDescription>
              Aqui podras ver las proximas y pasadas reuniones que has
              participado y/o que te han reservado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.data.map((item) => (
              <form key={item.id} action={cancelMeetingAction}>
                <input type="hidden" name="eventId" value={item.id} />
                <div className="grid grid-cols-3 justify-between items-center">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {format(
                        // @ts-ignore
                        fromUnixTime(item.when.startTime),
                        "EEEE, dd MMM",
                        {
                          locale: es,
                        }
                      )
                        .replace(
                          /^(\w)(\w+)/,
                          (_, first, rest) => first.toUpperCase() + rest
                        )
                        .replace(
                          /(\w+), (\d{1,2}) (\w)(\w+)/,
                          (_, day, date, firstLetter, restOfMonth) =>
                            `${day}, ${date} ${firstLetter.toUpperCase()}${restOfMonth}`
                        )}
                    </p>
                    <p className="text-muted-foreground text-xs pt-1">
                      {format(
                        // @ts-ignore
                        fromUnixTime(item.when.startTime),
                        "hh:mm a"
                      )}{" "}
                      - {/* @ts-ignore */}
                      {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                    </p>
                    <div className="flex items-center mt-1">
                      {item?.conferencing?.provider ? (
                        <Image
                          src={handleLogo(item?.conferencing?.provider)}
                          alt="Zoom Logo"
                          className="size-4 mr-2"
                        />
                      ) : (
                        <Video className="size-4 mr-2 text-primary" />
                      )}
                      <a
                        className="text-xs text-primary underline underline-offset-4"
                        target="_blank"
                        // @ts-ignore
                        href={item?.conferencing?.details?.url || ""}
                      >
                        Unirse a la reunion
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <h2 className="text-sm font-medium">{item.title}</h2>
                    <ParticipantsList participants={item.participants} />
                  </div>
                  <SubmitButton
                    text="Cancelar Evento"
                    loaderText="Cancelando..."
                    variant="destructive"
                    className="w-fit flex ml-auto"
                  />
                </div>
                <Separator className="my-3" />
              </form>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MeetingsPage;
