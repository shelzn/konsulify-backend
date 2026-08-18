import { boolean, decimal, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { consultants } from "./consultants.schema.ts";

export const services = mysqlTable("services", {
  id: int("id").primaryKey().autoincrement(),
  consultantId: int("consultant_id").notNull().references(() => consultants.id),
  name: varchar("name", { length: 140 }).notNull(),
  description: text("description"),
  durationMinutes: int("duration_minutes").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  image: varchar("image", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
