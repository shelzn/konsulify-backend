import { defineRelations } from "drizzle-orm";
import { bookings } from "./bookings.schema.ts";
import { categories } from "./categories.schema.ts";
import { consultants } from "./consultants.schema.ts";
import { schedules } from "./schedules.schema.ts";
import { services } from "./services.schema.ts";
import { users } from "./users.schema.ts";

export * from "./users.schema.ts";
export * from "./categories.schema.ts";
export * from "./consultants.schema.ts";
export * from "./services.schema.ts";
export * from "./schedules.schema.ts";
export * from "./bookings.schema.ts";
export * from "./password-reset-tokens.schema.ts";

export const schemaRelations = defineRelations(
  { users, categories, consultants, services, schedules, bookings },
  (r) => ({
    users: {
      bookings: r.many.bookings(),
    },
    categories: {
      consultants: r.many.consultants(),
    },
    consultants: {
      category: r.one.categories({ from: r.consultants.categoryId, to: r.categories.id }),
      services: r.many.services(),
      schedules: r.many.schedules(),
      bookings: r.many.bookings(),
    },
    services: {
      consultant: r.one.consultants({ from: r.services.consultantId, to: r.consultants.id }),
      bookings: r.many.bookings(),
    },
    schedules: {
      consultant: r.one.consultants({ from: r.schedules.consultantId, to: r.consultants.id }),
      booking: r.one.bookings({ from: r.schedules.id, to: r.bookings.scheduleId }),
    },
    bookings: {
      user: r.one.users({ from: r.bookings.userId, to: r.users.id }),
      consultant: r.one.consultants({ from: r.bookings.consultantId, to: r.consultants.id }),
      service: r.one.services({ from: r.bookings.serviceId, to: r.services.id }),
      schedule: r.one.schedules({ from: r.bookings.scheduleId, to: r.schedules.id }),
    },
  }),
);
