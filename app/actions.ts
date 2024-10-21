"use server";

import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "./lib/zodSchemas";
import { SubmissionResult } from "@conform-to/react";
import { redirect } from "next/navigation";

export type OnboardingActionResult =
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

  return redirect("/dashboard");
}
