import { boolean, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { categories } from "./categories.schema.ts";

export const consultants = mysqlTable("consultants", {
  id: int("id").primaryKey().autoincrement(),
  categoryId: int("category_id").notNull().references(() => categories.id),
  name: varchar("name", { length: 120 }).notNull(),
  title: varchar("title", { length: 80 }),
  email: varchar("email", { length: 160 }),
  phone: varchar("phone", { length: 30 }),
  specialization: varchar("specialization", { length: 160 }).notNull(),
  experienceYears: int("experience_years").notNull().default(0),
  description: text("description"),
  photo: varchar("photo", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export type Consultant = typeof consultants.$inferSelect;
export type NewConsultant = typeof consultants.$inferInsert;
