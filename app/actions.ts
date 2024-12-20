"use server";

import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import { parseWithZod } from "@conform-to/zod";
import {
  eventTypeSchema,
  onboardingSchema,
  settingsSchema,
} from "./lib/zodSchemas";
import { SubmissionResult } from "@conform-to/react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nylas } from "./lib/nylas";

export type OnboardingActionResult =
  | SubmissionResult<string[]>
  | { fields: { userName: { error: string } } }
  | undefined;

export type SettingsActionResult =
  | SubmissionResult<string[]>
  | { fields: { userName: { error: string } } }
  | undefined;

export type CreateEventTypeActionResult =
  | SubmissionResult<string[]>
  | { fields: { userName: { error: string } } }
  | undefined;

export type EditEventTypeActionResult =
  | SubmissionResult<string[]>
  | { fields: { userName: { error: string } } }
  | undefined;

export async function OnboardingAction(
  prevState: any,
  formData: FormData
): Promise<OnboardingActionResult> {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const doesUserNameExist = await prisma.user.findUnique({
    where: {
      userName: submission.value.userName,
    },
  });

  if (doesUserNameExist) {
    return submission.reply({
      fieldErrors: { userName: ["Lo sentimos!. Este Username ya existe"] },
    });
  }

  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      userName: submission.value.userName,
      name: submission.value.fullName,
      availability: {
        createMany: {
          data: [
            {
              day: "Monday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Tuesday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Wednesday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Thursday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Friday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Saturday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Sunday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
          ],
        },
      },
    },
  });

  return redirect("/onboarding/grant-id");
}

export async function SettingsAction(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: settingsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      name: submission.value.fullName,
      image: submission.value.profileImage,
    },
  });

  revalidatePath("/dashboard/settings");
}

export async function updateAvailability(formData: FormData) {
  await requireUser();

  const rawData = Object.fromEntries(formData.entries());

  const availabilityData = Object.keys(rawData)
    .filter((key) => key.startsWith("id-"))
    .map((key) => {
      const id = key.replace("id-", "");
      return {
        id,
        isActive: rawData[`isActive-${id}`] === "on",
        fromTime: rawData[`fromTime-${id}`] as string,
        tillTime: rawData[`tillTime-${id}`] as string,
      };
    });

  try {
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: {
            id: item.id,
          },
          data: {
            isActive: item.isActive,
            fromTime: item.fromTime,
            tillTime: item.tillTime,
          },
        })
      )
    );

    revalidatePath("/dashboard/disponibilidad");
  } catch (error) {
    console.log("Ocurrio un error en updateAvailability", error);
  }
}

export async function CreateEventTypeAction(
  prevState: any,
  formData: FormData
) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: eventTypeSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.eventType.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      videoCallSoftware: submission.value.video,
      userId: session.user?.id,
    },
  });

  return redirect("/dashboard");
}

export async function CreateMeetingAction(formData: FormData) {
  const getUserData = await prisma.user.findUnique({
    where: {
      userName: formData.get("userName") as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!getUserData) {
    throw new Error("No se encontro el usuario");
  }

  const eventTypeData = await prisma.eventType.findUnique({
    where: {
      id: formData.get("eventTypeId") as string,
    },
    select: {
      title: true,
      description: true,
    },
  });

  const meetingLength = Number(formData.get("meetingLength"));
  const provider = formData.get("provider") as string;
  const fromTime = formData.get("fromTime") as string;
  const eventDate = formData.get("eventDate") as string;
  const startDateTime = new Date(`${eventDate}T${fromTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

  await nylas.events.create({
    identifier: getUserData.grantId as string,
    requestBody: {
      title: eventTypeData?.title as string,
      description: eventTypeData?.description as string,
      when: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      },
      conferencing: {
        autocreate: {},
        provider: provider as any,
      },
      participants: [
        {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          status: "yes",
        },
      ],
    },
    queryParams: {
      calendarId: getUserData.grantEmail as string,
      notifyParticipants: true,
    },
  });

  return redirect("/success");
}

export async function cancelMeetingAction(formData: FormData) {
  const session = await requireUser();

  const userData = await prisma.user.findUnique({
    where: {
      id: session.user?.id as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!userData) {
    throw new Error("Usuario no encontrado");
  }

  const data = await nylas.events.destroy({
    eventId: formData.get("eventId") as string,
    identifier: userData?.grantId as string,
    queryParams: {
      calendarId: userData?.grantEmail as string,
    },
  });

  revalidatePath("/dashboard/meetings");
}

export async function EditEventTypeAction(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: eventTypeSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.eventType.update({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      videoCallSoftware: submission.value.video,
    },
  });

  return redirect("/dashboard");
}

export async function updateEventTypeStatusAction(
  prevState: any,
  {
    eventTypeId,
    isChecked,
  }: {
    eventTypeId: string;
    isChecked: boolean;
  }
) {
  try {
    const session = await requireUser();

    const data = await prisma.eventType.update({
      where: {
        id: eventTypeId,
        userId: session.user?.id as string,
      },
      data: {
        active: isChecked,
      },
    });

    if (!data) {
      return {
        status: "error",
        message: "Error al actualizar el estado del evento",
      };
    }

    revalidatePath(`/dashboard`);
    return {
      status: "success",
      message: "Estado del evento actualizado exitosamente",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Error al actualizar el estado del evento",
    };
  }
}

export async function DeleteEventTypeAction(eventId: string) {
  const session = await requireUser();

  const data = await prisma.eventType.delete({
    where: {
      id: eventId,
      userId: session.user?.id as string,
    },
  });

  if (!data) {
    throw new Error("Error al borrar el evento");
  }

  revalidatePath("/dashboard");
}
