import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { consultants, schedules } from "../../db/schema/index.ts";
import { AppError } from "../../utils/app-error.ts";
import { getPagination, makeMeta } from "../../utils/pagination.ts";

type ScheduleInput = typeof schedules.$inferInsert;

export const scheduleService = {
  async list(query: Record<string, unknown>, admin = false) {
    const { page, limit, offset } = getPagination(query);
    const consultantId = query.consultantId ? Number(query.consultantId) : undefined;
    const where = and(
      consultantId ? eq(schedules.consultantId, consultantId) : undefined,
      admin ? undefined : eq(schedules.status, "available"),
    );
    const rows = await db
      .select({
        id: schedules.id,
        consultantId: schedules.consultantId,
        consultantName: consultants.name,
        date: schedules.date,
        startTime: schedules.startTime,
        endTime: schedules.endTime,
        status: schedules.status,
      })
      .from(schedules)
      .leftJoin(consultants, eq(consultants.id, schedules.consultantId))
      .where(where)
      .orderBy(desc(schedules.date), schedules.startTime)
      .limit(limit)
      .offset(offset);
    const [totalRow] = await db.select({ value: count() }).from(schedules).where(where);
    return { data: rows, meta: makeMeta(page, limit, totalRow?.value ?? rows.length) };
  },

  async byConsultant(consultantId: number) {
    return db.select().from(schedules).where(and(eq(schedules.consultantId, consultantId), eq(schedules.status, "available")));
  },

  async findById(id: number) {
    const [row] = await db.select().from(schedules).where(eq(schedules.id, id)).limit(1);
    if (!row) {
      throw new AppError(404, "Data tidak ditemukan.");
    }
    return row;
  },

  async create(input: ScheduleInput) {
    await db.insert(schedules).values(input);
    const [created] = await db.select().from(schedules).orderBy(desc(schedules.id)).limit(1);
    return created;
  },

  async update(id: number, input: Partial<ScheduleInput>) {
    await this.findById(id);
    await db.update(schedules).set(input).where(eq(schedules.id, id));
    return this.findById(id);
  },

  async remove(id: number) {
    await this.findById(id);
    await db.delete(schedules).where(eq(schedules.id, id));
    return true;
  },
};
