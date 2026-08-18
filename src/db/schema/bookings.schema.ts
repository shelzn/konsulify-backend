import { date, decimal, int, mysqlEnum, mysqlTable, text, time, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { consultants } from "./consultants.schema.ts";
import { schedules } from "./schedules.schema.ts";
import { services } from "./services.schema.ts";
import { users } from "./users.schema.ts";

export const bookings = mysqlTable("bookings", {
  id: int("id").primaryKey().autoincrement(),
  bookingCode: varchar("booking_code", { length: 40 }).notNull().unique(),
  userId: int("user_id").notNull().references(() => users.id),
  consultantId: int("consultant_id").notNull().references(() => consultants.id),
  serviceId: int("service_id").notNull().references(() => services.id),
  scheduleId: int("schedule_id").notNull().references(() => schedules.id),
  consultationDate: date("consultation_date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 30 }).notNull(),
  complaint: text("complaint").notNull(),
  notes: text("notes"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
}, (table) => [
  uniqueIndex("bookings_schedule_id_unique").on(table.scheduleId),
]);

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
