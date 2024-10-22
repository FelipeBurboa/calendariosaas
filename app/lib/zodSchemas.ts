import { z } from "zod";

export const onboardingSchema = z.object({
  fullName: z
    .string({ required_error: "El nombre y apellido es requerido" })
    .min(3, { message: "Mínimo 3 caracteres" })
    .max(150, { message: "Máximo 150 caracteres" }),
  userName: z
    .string({ required_error: "El username es requerido" })
    .min(3, { message: "Mínimo 3 caracteres" })
    .max(150, { message: "Máximo 150 caracteres" })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Solo letras, números y guiones estan permitidos",
    }),
});

export const settingsSchema = z.object({
  fullName: z
    .string({ required_error: "El nombre y apellido es requerido" })
    .min(3, { message: "Mínimo 3 caracteres" })
    .max(150, { message: "Máximo 150 caracteres" }),
  profileImage: z.string({ required_error: "La imagen es requerida" }),
});

export const eventTypeSchema = z.object({
  title: z
    .string({ required_error: "El nombre del evento es requerido" })
    .min(3, { message: "Mínimo 3 caracteres" })
    .max(150, { message: "Máximo 150 caracteres" }),
  duration: z
    .number({ required_error: "La duración es requerida" })
    .min(15, { message: "Mínimo 15 minuto" })
    .max(60, { message: "Máximo 1 hora" }),
  url: z
    .string({ required_error: "El URL es requerido" })
    .min(3, { message: "Mínimo 3 caracteres" })
    .max(150, { message: "Máximo 150 caracteres" }),
  description: z
    .string({ required_error: "La descripción es requerida" })
    .min(3, { message: "Mínimo 3 caracteres" })
    .max(300, { message: "Máximo 300 caracteres" }),
  video: z
    .string({ required_error: "El video es requerido" })
    .min(3, { message: "Mínimo 3 caracteres" }),
});
