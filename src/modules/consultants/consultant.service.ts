import { and, count, desc, eq, like, or } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { categories, consultants, services } from "../../db/schema/index.ts";
import { AppError } from "../../utils/app-error.ts";
import { getPagination, makeMeta } from "../../utils/pagination.ts";

type ConsultantInput = typeof consultants.$inferInsert;

export const consultantService = {
  async list(query: Record<string, unknown>, admin = false) {
    const { page, limit, offset } = getPagination(query);
    const search = String(query.search ?? "");
    const categoryId = query.category ? Number(query.category) : undefined;
    const searchWhere = search ? or(like(consultants.name, `%${search}%`), like(consultants.specialization, `%${search}%`)) : undefined;
    const where = and(searchWhere, categoryId ? eq(consultants.categoryId, categoryId) : undefined, admin ? undefined : eq(consultants.isActive, true));
    const rows = await db
      .select({
        id: consultants.id,
        categoryId: consultants.categoryId,
        categoryName: categories.name,
        name: consultants.name,
        title: consultants.title,
        email: consultants.email,
        phone: consultants.phone,
        specialization: consultants.specialization,
        experienceYears: consultants.experienceYears,
        description: consultants.description,
        photo: consultants.photo,
        isActive: consultants.isActive,
        createdAt: consultants.createdAt,
      })
      .from(consultants)
      .leftJoin(categories, eq(categories.id, consultants.categoryId))
      .where(where)
      .orderBy(desc(consultants.createdAt))
      .limit(limit)
      .offset(offset);
    const [totalRow] = await db.select({ value: count() }).from(consultants).where(where);
    return { data: rows, meta: makeMeta(page, limit, totalRow?.value ?? rows.length) };
  },

  async findById(id: number, admin = false) {
    const [row] = await db.select().from(consultants).where(and(eq(consultants.id, id), admin ? undefined : eq(consultants.isActive, true))).limit(1);
    if (!row) {
      throw new AppError(404, "Data tidak ditemukan.");
    }
    return row;
  },

  async detail(id: number) {
    const consultant = await this.findById(id);
    const consultantServices = await db.select().from(services).where(and(eq(services.consultantId, id), eq(services.isActive, true)));
    return { ...consultant, services: consultantServices };
  },

  async create(input: ConsultantInput) {
    await db.insert(consultants).values(input);
    const [created] = await db.select().from(consultants).orderBy(desc(consultants.id)).limit(1);
    return created;
  },

  async update(id: number, input: Partial<ConsultantInput>) {
    await this.findById(id, true);
    await db.update(consultants).set(input).where(eq(consultants.id, id));
    return this.findById(id, true);
  },

  async remove(id: number) {
    await this.findById(id, true);
    await db.delete(consultants).where(eq(consultants.id, id));
    return true;
  },
};
