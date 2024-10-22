"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { OnboardingAction, OnboardingActionResult } from "../actions";
import { SubmissionResult, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../lib/zodSchemas";
import { SubmitButton } from "../components/SubmitButtons";

export default function OnboardingRoute() {
  const [lastResult, action] = useFormState<OnboardingActionResult, FormData>(
    OnboardingAction,
    undefined
  );

  const [form, fields] = useForm({
    lastResult: lastResult as SubmissionResult<string[]> | undefined,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <Image src={Logo} alt="logo" className="size-10 flex mx-auto" />
          <CardTitle className="text-center text-2xl font-bold">
            Bienvenido a{" "}
            <span className="bg-gradient-to-r from-red-500 via-orange-300 to-green-400 bg-[length:90%_4px] bg-no-repeat bg-bottom">
              Calendario
            </span>
            <span className="bg-gradient-to-r from-red-500 via-orange-300 to-green-400 inline-block text-transparent bg-clip-text ml-2">
              SaaS
            </span>
          </CardTitle>
          <CardDescription>
            Necesitamos la siguiente información para crear tu perfil!
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <CardContent className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>Nombre y Apellido</Label>
              <Input
                name={fields.fullName.name}
                defaultValue={fields.fullName.initialValue as string}
                key={fields.fullName.key}
                type="text"
                placeholder="Nombre Apellido"
              />
              <p className="text-sm text-red-500">{fields.fullName.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Username</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  CalendarioSaaS.com/
                </span>
                <Input
                  type="text"
                  placeholder="username"
                  className="rounded-l-none"
                  name={fields.userName.name}
                  defaultValue={(fields.userName.initialValue as string) || ""}
                  key={fields.userName.key}
                />
              </div>
              <p className="text-sm text-red-500">{fields.userName.errors}</p>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton
              text="Crear Cuenta"
              variant="default"
              className="w-full"
              loaderText="Creando..."
            />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
