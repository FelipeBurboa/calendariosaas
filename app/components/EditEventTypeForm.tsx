"use client";

import { SubmitButton } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { SubmissionResult, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { eventTypeSchema } from "@/app/lib/zodSchemas";
import { useFormState } from "react-dom";
import { EditEventTypeAction, EditEventTypeActionResult } from "@/app/actions";
import { convertToSlug } from "@/app/lib/converttoslug";
import Zoom from "@/public/zoom.svg";
import GoogleMeet from "@/public/meet.png";
import MicrosoftTeams from "@/public/teams.svg";

interface EditEventTypeFormProps {
  id: string;
  title: string;
  url: string;
  description: string;
  duration: number;
  callProvider: string;
}

type ServiceProviders = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";

export function EditEventTypeForm({
  id,
  title,
  url,
  description,
  duration,
  callProvider,
}: EditEventTypeFormProps) {
  const [activePlatform, setActivePlatform] = useState<ServiceProviders>(
    callProvider as ServiceProviders
  );

  const [lastResult, action] = useFormState<
    EditEventTypeActionResult,
    FormData
  >(EditEventTypeAction, undefined);

  const [form, fields] = useForm({
    lastResult: lastResult as SubmissionResult<string[]> | undefined,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: eventTypeSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const slugValue = convertToSlug(value);
    e.target.value = slugValue;
  };
  return (
    <div className="w-full h-full flex flex-1 items-center justify-center">
      <Card>
        <CardHeader className="bg-gradient-to-r from-red-500 to-red-600">
          <CardTitle className="text-center text-white">
            Editar tu evento
          </CardTitle>
          <CardDescription className="text-center text-white">
            Edita tu evento para que otros puedan organizar reuniones contigo
          </CardDescription>
        </CardHeader>
        <div className="h-[1px] bg-muted rounded-full w-full mb-4"></div>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <input type="hidden" name="id" value={id} />
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>Titulo</Label>
              <Input
                name={fields.title.name}
                defaultValue={title}
                key={fields.title.key}
                type="text"
                placeholder="Reunion de 30 minutos"
              />
              <p className="text-sm text-red-500">{fields.title.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>URL Slug</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  CalendarioSaaS.com/
                </span>
                <Input
                  type="text"
                  name={fields.url.name}
                  defaultValue={url}
                  key={fields.url.key}
                  className="rounded-l-none"
                  placeholder="reunion-de-30"
                  onChange={handleInputChange}
                />
              </div>
              <p className="text-sm text-red-500">{fields.url.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Descripcion</Label>
              <Textarea
                placeholder="Tendremos una reunion de 30 minutos para hablar sobre el proyecto"
                name={fields.description.name}
                defaultValue={description}
                key={fields.description.key}
              />
              <p className="text-sm text-red-500">
                {fields.description.errors}
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Duracion</Label>
              <Select
                name={fields.duration.name}
                defaultValue={String(duration)}
                key={fields.duration.key}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona Duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Duracion</SelectLabel>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-sm text-red-500">{fields.duration.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Servicio a usar</Label>
              <input
                type="hidden"
                name={fields.video.name}
                value={activePlatform}
              ></input>
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() => setActivePlatform("Zoom Meeting")}
                  className="w-full"
                  variant={
                    activePlatform === "Zoom Meeting" ? "secondary" : "outline"
                  }
                >
                  <Image src={Zoom} alt="Zoom Logo" className="size-5" />
                  Zoom
                </Button>
                <Button
                  type="button"
                  onClick={() => setActivePlatform("Google Meet")}
                  className="w-full"
                  variant={
                    activePlatform === "Google Meet" ? "secondary" : "outline"
                  }
                >
                  <Image
                    src={GoogleMeet}
                    alt="Google Meet Logo"
                    className="size-5"
                  />
                  Google Meet
                </Button>
                {/*    <Button
                      type="button"
                      onClick={() => setActivePlatform("Microsoft Teams")}
                      className="w-full"
                      variant={
                        activePlatform === "Microsoft Teams"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      <Image
                        src={MicrosoftTeams}
                        alt="Microsoft Teams Logo"
                        className="size-5"
                      />
                      Microsoft Teams
                    </Button> */}
              </ButtonGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between w-full">
            <Button variant="secondary" asChild>
              <Link href={"/dashboard"}>Cancelar</Link>
            </Button>
            <SubmitButton text="Editar Evento" loaderText="Editando..." />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
