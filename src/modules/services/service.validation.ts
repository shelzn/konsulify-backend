import { z } from "zod";

const boolish = z.union([z.boolean(), z.enum(["true", "false"])]).transform((value) => value === true || value === "true");

export const serviceCreateSchema = z.object({
  body: z.object({
    consultantId: z.coerce.number().int().positive(),
    name: z.string().min(1),
    description: z.string().optional(),
    durationMinutes: z.coerce.number().int().positive(),
    price: z.coerce.number().min(0).transform((value) => value.toFixed(2)),
    isActive: boolish.optional(),
  }),
});

export const serviceUpdateSchema = z.object({
  body: serviceCreateSchema.shape.body.partial(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const serviceParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});
