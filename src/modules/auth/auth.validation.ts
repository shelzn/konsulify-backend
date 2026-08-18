import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.email(),
    phone: z.string().min(6).optional(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  }).refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Konfirmasi password tidak sama.",
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(1),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(20),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  }).refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Konfirmasi password tidak sama.",
  }),
});
