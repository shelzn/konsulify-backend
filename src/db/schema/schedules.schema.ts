import { date, int, mysqlEnum, mysqlTable, time, timestamp } from "drizzle-orm/mysql-core";
import { consultants } from "./consultants.schema.ts";

export const schedules = mysqlTable("schedules", {
  id: int("id").primaryKey().autoincrement(),
  consultantId: int("consultant_id").notNull().references(() => consultants.id),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  status: mysqlEnum("status", ["available", "booked", "unavailable"]).notNull().default("available"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export type Schedule = typeof schedules.$inferSelect;
export type NewSchedule = typeof schedules.$inferInsert;
