import { and, count, desc, eq, like } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { consultants, services } from "../../db/schema/index.ts";
import { AppError } from "../../utils/app-error.ts";
import { getPagination, makeMeta } from "../../utils/pagination.ts";

type ServiceInput = typeof services.$inferInsert;

export const serviceService = {
  async list(query: Record<string, unknown>, admin = false) {
    const { page, limit, offset } = getPagination(query);
    const search = String(query.search ?? "");
    const consultantId = query.consultantId ? Number(query.consultantId) : undefined;
    const where = and(
      search ? like(services.name, `%${search}%`) : undefined,
      consultantId ? eq(services.consultantId, consultantId) : undefined,
      admin ? undefined : eq(services.isActive, true),
    );
    const rows = await db
      .select({
        id: services.id,
        consultantId: services.consultantId,
        consultantName: consultants.name,
        name: services.name,
        description: services.description,
        durationMinutes: services.durationMinutes,
        price: services.price,
        image: services.image,
        isActive: services.isActive,
        createdAt: services.createdAt,
      })
      .from(services)
      .leftJoin(consultants, eq(consultants.id, services.consultantId))
      .where(where)
      .orderBy(desc(services.createdAt))
      .limit(limit)
      .offset(offset);
    const [totalRow] = await db.select({ value: count() }).from(services).where(where);
    return { data: rows, meta: makeMeta(page, limit, totalRow?.value ?? rows.length) };
  },

  async findById(id: number, admin = false) {
    const [row] = await db.select().from(services).where(and(eq(services.id, id), admin ? undefined : eq(services.isActive, true))).limit(1);
    if (!row) {
      throw new AppError(404, "Data tidak ditemukan.");
    }
    return row;
  },

  async create(input: ServiceInput) {
    await db.insert(services).values(input);
    const [created] = await db.select().from(services).orderBy(desc(services.id)).limit(1);
    return created;
  },

  async update(id: number, input: Partial<ServiceInput>) {
    await this.findById(id, true);
    await db.update(services).set(input).where(eq(services.id, id));
    return this.findById(id, true);
  },

  async remove(id: number) {
    await this.findById(id, true);
    await db.delete(services).where(eq(services.id, id));
    return true;
  },
};
