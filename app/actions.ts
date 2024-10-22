"use server";

import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema, settingsSchema } from "./lib/zodSchemas";
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
