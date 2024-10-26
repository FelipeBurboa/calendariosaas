import prisma from "@/app/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";

async function getData(userName: string, eventUrl: string) {
  const data = await prisma.eventType.findFirst({
    where: {
      url: eventUrl,
      User: {
        userName: userName,
      },
      active: true,
    },
    select: {
      id: true,
      description: true,
      title: true,
      duration: true,
      videoCallSoftware: true,
      User: {
        select: {
          image: true,
          name: true,
          availability: {
            select: {
              day: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

interface BookingPageProps {
  params: {
    username: string;
    eventUrl: string;
  };
}

import Image from "next/image";
import Zoom from "@/public/zoom.svg";
import GoogleMeet from "@/public/meet.png";
import MicrosoftTeams from "@/public/teams.svg";
import { CalendarX2, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function BookingPage({ params }: BookingPageProps) {
  const data = await getData(params.username, params.eventUrl);

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
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="max-w-[1000px] w-full mx-auto">
        <CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr]">
          <div>
            {data.User?.image ? (
              <img
                src={data.User?.image as string}
                alt={data.User?.name || ""}
                className="size-10 rounded-full"
              />
            ) : (
              <p className="size-10 rounded-full bg-gray-200"></p>
            )}
            <p className="text-sm font-medium text-muted-foreground mt-2">
              {data.User?.name}
            </p>
            <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
            <p className="text-sm font-medium text-muted-foreground mt-2">
              {data.description}
            </p>
            <div className="mt-5 flex flex-col gap-y-3">
              <p className="flex items-center gap-x-2">
                <CalendarX2 className="size-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  23. Fake 2024
                </span>
              </p>
              <p className="flex items-center gap-x-2">
                <Clock className="size-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Reunion de{" "}
                  {data.duration === 60 ? "1 hora" : `${data.duration} minutos`}
                </span>
              </p>
              <p className="flex gap-x-2 items-center">
                <Image
                  src={handleLogo(data.videoCallSoftware)}
                  alt="Zoom Logo"
                  className="size-4 mr-2"
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {data.videoCallSoftware}
                </span>
              </p>
            </div>
          </div>
          <Separator orientation="vertical" className="h-full w-[1px] mx-2" />
        </CardContent>
      </Card>
    </div>
  );
}
