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
