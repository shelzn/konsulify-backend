import { count, desc, eq, like, or } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { categories } from "../../db/schema/index.ts";
import { AppError } from "../../utils/app-error.ts";
import { getPagination, makeMeta } from "../../utils/pagination.ts";
import { slugify } from "../../utils/slug.ts";

type CategoryInput = {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
};

export const categoryService = {
  async list(query: Record<string, unknown>, admin = false) {
    const { page, limit, offset } = getPagination(query);
    const search = String(query.search ?? "");
    const where = search
      ? or(like(categories.name, `%${search}%`), like(categories.description, `%${search}%`))
      : undefined;

    const rows = await db.select().from(categories).where(where).orderBy(desc(categories.createdAt)).limit(limit).offset(offset);
    const [totalRow] = await db.select({ value: count() }).from(categories).where(where);
    const filtered = admin ? rows : rows.filter((item) => item.isActive);

    return { data: filtered, meta: makeMeta(page, limit, totalRow?.value ?? filtered.length) };
  },

  async findById(id: number, admin = false) {
    const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (!category || (!admin && !category.isActive)) {
      throw new AppError(404, "Data tidak ditemukan.");
    }
    return category;
  },

  async create(input: CategoryInput) {
    const slug = input.slug ? slugify(input.slug) : slugify(input.name);
    await db.insert(categories).values({ ...input, slug });
    const [created] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return created;
  },

  async update(id: number, input: Partial<CategoryInput>) {
    await this.findById(id, true);
    const payload = { ...input, ...(input.name && !input.slug ? { slug: slugify(input.name) } : {}) };
    await db.update(categories).set(payload).where(eq(categories.id, id));
    return this.findById(id, true);
  },

  async remove(id: number) {
    await this.findById(id, true);
    await db.delete(categories).where(eq(categories.id, id));
    return true;
  },
};
