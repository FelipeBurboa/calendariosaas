import { notFound } from "next/navigation";
import prisma from "../lib/db";
import { requireUser } from "../lib/hooks";
import { EmptyState } from "../components/EmptyState";

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
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function DashboardPage() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <div className="w-full h-full flex flex-1 items-center justify-center">
      {data.eventType.length === 0 ? (
        <EmptyState
          title="No tienes eventos"
          description="Puedes generar un evento haciendo click en el boton que se encuentra abajo"
          buttonText="Generar Evento"
          href="/dashboard/new"
        />
      ) : (
        <p>Si hay eventos</p>
      )}
    </div>
  );
}
