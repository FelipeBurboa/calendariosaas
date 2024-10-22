"use client";

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
import { SubmitButton } from "./SubmitButtons";
import { useFormState } from "react-dom";
import { SubmissionResult, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { SettingsAction, SettingsActionResult } from "../actions";
import { settingsSchema } from "../lib/zodSchemas";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { UploadDropzone } from "../lib/uploadthing";
import { toast } from "sonner";

interface SettingsFormProps {
  fullName: string;
  email: string;
  profileImage: string;
}

export function SettingsForm({
  fullName,
  email,
  profileImage,
}: SettingsFormProps) {
  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);
  const [lastResult, action] = useFormState<SettingsActionResult, FormData>(
    SettingsAction,
    undefined
  );

  const [form, fields] = useForm({
    lastResult: lastResult as SubmissionResult<string[]> | undefined,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: settingsSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDeleteImage = () => {
    setCurrentProfileImage("");
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-red-500 to-red-600">
        <CardTitle className="text-center text-white">Settings</CardTitle>
        <CardDescription className="text-center text-white">
          Aqui puedes cambiar tus settings
        </CardDescription>
      </CardHeader>
      <div className="h-[1px] bg-muted rounded-full w-full mb-4"></div>
      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-y-4 mt-4 md:mt-[50px]">
              <div className="flex flex-col gap-y-2">
                <Label>Nombre Completo</Label>
                <Input
                  defaultValue={fullName}
                  placeholder="Nombre Apellido"
                  name={fields.fullName.name}
                  type="text"
                  key={fields.fullName.name}
                />
                <p className="text-sm text-red-500">{fields.fullName.errors}</p>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Email</Label>
                <Input
                  disabled
                  defaultValue={email}
                  placeholder="example@email.com"
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                <Label className="text-center">Foto de Perfil</Label>
                <input
                  type="hidden"
                  name={fields.profileImage.name}
                  key={fields.profileImage.name}
                  value={currentProfileImage}
                />
                {currentProfileImage ? (
                  <div className="relative size-[200px] rounded-full mt-4 mx-auto">
                    <img
                      src={currentProfileImage}
                      alt="Profile Image"
                      className="size-[200px] rounded-full object-cover object-center border border-white"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      type="button"
                      className="absolute right-0 top-0 p-2 bg-red-500/50"
                      onClick={handleDeleteImage}
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint="imageUploader"
                    className="mt-4 ut-button:bg-red-500 ut-button:ut-readying:bg-red-500/50"
                    onClientUploadComplete={(res) => {
                      setCurrentProfileImage(res[0].url);
                      toast.success("Imagen subida con exito");
                    }}
                    onUploadError={(error) => {
                      console.log("Error al subir la imagen", error);
                      toast.error("Error al subir la imagen");
                    }}
                  />
                )}
                <p className="text-sm text-red-500">
                  {fields.profileImage.errors}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton
            text="Guardar Cambios"
            loaderText="Guardando..."
            className="w-full"
          />
        </CardFooter>
      </form>
    </Card>
  );
}
