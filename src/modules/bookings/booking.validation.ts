import { z } from "zod";

export const bookingCreateSchema = z.object({
  body: z.object({
    consultantId: z.coerce.number().int().positive(),
    serviceId: z.coerce.number().int().positive(),
    scheduleId: z.coerce.number().int().positive(),
    customerName: z.string().min(1),
    customerPhone: z.string().min(6),
    complaint: z.string().min(1),
    notes: z.string().optional(),
  }),
});

export const bookingParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const bookingStatusSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  }),
});
