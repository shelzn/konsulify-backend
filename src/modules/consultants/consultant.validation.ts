import { z } from "zod";

const boolish = z.union([z.boolean(), z.enum(["true", "false"])]).transform((value) => value === true || value === "true");

export const consultantCreateSchema = z.object({
  body: z.object({
    categoryId: z.coerce.number().int().positive(),
    name: z.string().min(1),
    title: z.string().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    specialization: z.string().min(1),
    experienceYears: z.coerce.number().int().min(0),
    description: z.string().optional(),
    isActive: boolish.optional(),
  }),
});

export const consultantUpdateSchema = z.object({
  body: consultantCreateSchema.shape.body.partial(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const consultantParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});
