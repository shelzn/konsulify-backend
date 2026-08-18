import { z } from "zod";

const boolish = z.union([z.boolean(), z.enum(["true", "false"])]).transform((value) => value === true || value === "true");

export const categoryCreateSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    isActive: boolish.optional(),
  }),
});

export const categoryUpdateSchema = z.object({
  body: categoryCreateSchema.shape.body.partial(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const categoryParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});
