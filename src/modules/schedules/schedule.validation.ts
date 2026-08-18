import { z } from "zod";

export const scheduleCreateSchema = z.object({
  body: z.object({
    consultantId: z.coerce.number().int().positive(),
    date: z.iso.date(),
    startTime: z.iso.time(),
    endTime: z.iso.time(),
    status: z.enum(["available", "booked", "unavailable"]).default("available"),
  }),
});

export const scheduleUpdateSchema = z.object({
  body: scheduleCreateSchema.shape.body.partial(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const scheduleParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});
