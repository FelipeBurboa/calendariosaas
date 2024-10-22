import { updateAvailability } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { times } from "@/app/lib/times";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";

async function getData(id: string) {
  const data = await prisma.availability.findMany({
    where: {
      userId: id,
    },
    orderBy: {
      day: "asc",
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

function dayFromEnglishToSpanish(day: string) {
  switch (day) {
    case "Monday":
      return "Lunes";
    case "Tuesday":
      return "Martes";
    case "Wednesday":
      return "Miercoles";
    case "Thursday":
      return "Jueves";
    case "Friday":
      return "Viernes";
    case "Saturday":
      return "Sabado";
    case "Sunday":
      return "Domingo";
  }
}

export default async function DisponibilidadPage() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  return (
    <div className="mx-auto w-[300px] md:w-[500px]">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Disponibilidad</CardTitle>
          <CardDescription className="text-center">
            ¡Aqui podras manejar tu disponibilidad!
          </CardDescription>
        </CardHeader>
        <div className="h-[1px] bg-muted rounded-full w-full mb-4"></div>
        <form action={updateAvailability}>
          <CardContent className="flex flex-col gap-y-4">
            {data?.map((availability) => (
              <div
                key={availability.id}
                className="grid grid-cols-1  md:grid-cols-3 items-center gap-4"
              >
                <input
                  type="hidden"
                  name={`id-${availability.id}`}
                  value={availability.id}
                />
                <div className="flex gap-x-3 mx-auto md:ml-0">
                  <Switch
                    name={`isActive-${availability.id}`}
                    defaultChecked={availability.isActive}
                  />
                  <p>{dayFromEnglishToSpanish(availability.day)}</p>
                </div>

                <Select
                  name={`fromTime-${availability.id}`}
                  defaultValue={availability.fromTime}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Hora Desde" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {times.map((time) => (
                        <SelectItem key={time.id} value={time.time}>
                          {time.time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  name={`tillTime-${availability.id}`}
                  defaultValue={availability.tillTime}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Hora Hasta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {times.map((time) => (
                        <SelectItem key={time.id} value={time.time}>
                          {time.time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <SubmitButton
              text="Guardar Cambios"
              variant="default"
              loaderText="Guardando..."
              className="w-full"
            />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
