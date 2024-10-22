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
