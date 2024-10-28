import { notFound } from "next/navigation";
import prisma from "../lib/db";
import { requireUser } from "../lib/hooks";
import { EmptyState } from "../components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Pen, Settings, Users2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Zoom from "@/public/zoom.svg";
import GoogleMeet from "@/public/meet.png";
import MicrosoftTeams from "@/public/teams.svg";
import { CopyLinkMenu } from "../components/CopyLinkMenu";
import { EventTypeSwitcher } from "../components/EventTypeSwitcher";
import DeleteEventDialog from "../components/DeleteEventDialog";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      userName: true,
      eventType: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
          videoCallSoftware: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

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

export default async function DashboardPage() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <>
      {data.eventType.length === 0 ? (
        <EmptyState
          title="No tienes eventos"
          description="Puedes generar un evento haciendo click en el boton que se encuentra abajo"
          buttonText="Generar Evento"
          href="/dashboard/new"
        />
      ) : (
        <>
          <div className="flex items-center justify-between px-2">
            <div className="hidden sm:grid gap-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold">Eventos</h1>
              <p className="text-muted-foreground">
                ¡Crea y gestiona tus eventos aqui!
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/new">Crear Nuevo Evento</Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.eventType.map((event) => (
              <div
                className="overflow-hidden shadow rounded-lg border relative flex flex-col h-full"
                key={event.id}
              >
                <div className="absolute top-2 left-2">
                  <Image
                    src={handleLogo(event.videoCallSoftware)}
                    alt="Zoom Logo"
                    className="size-4"
                  />
                </div>
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings className="size-4 " />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="text-center">
                        Evento
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild disabled={!event.active}>
                          <Link href={`/${data.userName}/${event.url}`}>
                            <ExternalLink className="size-4 mr-2" />
                            Ver
                          </Link>
                        </DropdownMenuItem>
                        <CopyLinkMenu
                          meetingUrl={`${process.env.NEXT_PUBLIC_URL}/${data.userName}/${event.url}`}
                          disabled={!event.active}
                        />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/event/${event.id}`}>
                            <Pen className="size-4 mr-2" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DeleteEventDialog eventId={event.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Link href="/" className="flex items-center p-5 mt-2 flex-grow">
                  <div className="flex-shrink-0">
                    <Users2 className="size-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Reunion de{" "}
                        {event.duration === 60
                          ? "1 hora"
                          : `${event.duration} minutos`}
                      </dt>
                      <dd className="text-lg font-medium">{event.title}</dd>
                    </dl>
                  </div>
                </Link>
                <div className="bg-primary/10 px-5 py-3 justify-between items-center flex mt-auto">
                  <EventTypeSwitcher
                    initialChecked={event.active}
                    eventTypeId={event.id}
                  />
                  <Button asChild>
                    <Link href={`/dashboard/event/${event.id}`}>
                      Editar Evento
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
