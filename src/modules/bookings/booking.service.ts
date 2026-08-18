import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { bookings, consultants, schedules, services, users } from "../../db/schema/index.ts";
import { AppError } from "../../utils/app-error.ts";
import { getPagination, makeMeta } from "../../utils/pagination.ts";

type BookingInput = {
  consultantId: number;
  serviceId: number;
  scheduleId: number;
  customerName: string;
  customerPhone: string;
  complaint: string;
  notes?: string;
};

type UpdateResult = {
  rowsAffected?: number;
  affectedRows?: number;
};

function getAffectedRows(result: unknown) {
  const value = Array.isArray(result) ? result[0] : result;
  const update = value as UpdateResult;
  return update.rowsAffected ?? update.affectedRows ?? 0;
}

function ymd(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

async function nextBookingCode() {
  const prefix = `KSL-${ymd()}-`;
  const [row] = await db.select({ value: count() }).from(bookings).where(sql`${bookings.bookingCode} like ${`${prefix}%`}`);
  return `${prefix}${String((row?.value ?? 0) + 1).padStart(4, "0")}`;
}

export const bookingService = {
  async create(userId: number, input: BookingInput) {
    const [consultant] = await db.select().from(consultants).where(and(eq(consultants.id, input.consultantId), eq(consultants.isActive, true))).limit(1);
    if (!consultant) {
      throw new AppError(404, "Konsultan tidak ditemukan atau tidak aktif.");
    }

    const [service] = await db.select().from(services).where(and(eq(services.id, input.serviceId), eq(services.isActive, true))).limit(1);
    if (!service || service.consultantId !== input.consultantId) {
      throw new AppError(400, "Layanan tidak sesuai dengan konsultan.");
    }

    const [schedule] = await db.select().from(schedules).where(eq(schedules.id, input.scheduleId)).limit(1);
    if (!schedule || schedule.consultantId !== input.consultantId) {
      throw new AppError(400, "Jadwal tidak sesuai dengan konsultan.");
    }

    return db.transaction(async (tx) => {
      const updateResult = await tx
        .update(schedules)
        .set({ status: "booked" })
        .where(and(eq(schedules.id, input.scheduleId), eq(schedules.status, "available")));

      if (getAffectedRows(updateResult) < 1) {
        throw new AppError(409, "Jadwal konsultasi sudah dipesan.");
      }

      const bookingCode = await nextBookingCode();
      await tx.insert(bookings).values({
        bookingCode,
        userId,
        consultantId: input.consultantId,
        serviceId: input.serviceId,
        scheduleId: input.scheduleId,
        consultationDate: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        complaint: input.complaint,
        notes: input.notes,
        price: service.price,
        status: "pending",
      });

      const [created] = await tx.select().from(bookings).where(eq(bookings.bookingCode, bookingCode)).limit(1);
      return created;
    });
  },

  async listForUser(userId: number, query: Record<string, unknown>) {
    return this.list(query, userId);
  },

  async listForAdmin(query: Record<string, unknown>) {
    return this.list(query);
  },

  async list(query: Record<string, unknown>, userId?: number) {
    const { page, limit, offset } = getPagination(query);
    const status = typeof query.status === "string" ? query.status : undefined;
    const where = and(
      userId ? eq(bookings.userId, userId) : undefined,
      status && ["pending", "confirmed", "completed", "cancelled"].includes(status) ? eq(bookings.status, status as typeof bookings.$inferSelect.status) : undefined,
    );
    const rows = await db
      .select({
        id: bookings.id,
        bookingCode: bookings.bookingCode,
        customerName: bookings.customerName,
        consultantName: consultants.name,
        serviceName: services.name,
        consultationDate: bookings.consultationDate,
        startTime: bookings.startTime,
        endTime: bookings.endTime,
        price: bookings.price,
        status: bookings.status,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .leftJoin(consultants, eq(consultants.id, bookings.consultantId))
      .leftJoin(services, eq(services.id, bookings.serviceId))
      .where(where)
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset);
    const [totalRow] = await db.select({ value: count() }).from(bookings).where(where);
    return { data: rows, meta: makeMeta(page, limit, totalRow?.value ?? rows.length) };
  },

  async detail(id: number, userId?: number) {
    const where = and(eq(bookings.id, id), userId ? eq(bookings.userId, userId) : undefined);
    const [row] = await db
      .select({
        id: bookings.id,
        bookingCode: bookings.bookingCode,
        customerName: bookings.customerName,
        customerPhone: bookings.customerPhone,
        complaint: bookings.complaint,
        notes: bookings.notes,
        consultantName: consultants.name,
        serviceName: services.name,
        consultationDate: bookings.consultationDate,
        startTime: bookings.startTime,
        endTime: bookings.endTime,
        price: bookings.price,
        status: bookings.status,
        userName: users.name,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .leftJoin(consultants, eq(consultants.id, bookings.consultantId))
      .leftJoin(services, eq(services.id, bookings.serviceId))
      .leftJoin(users, eq(users.id, bookings.userId))
      .where(where)
      .limit(1);

    if (!row) {
      throw new AppError(404, "Data tidak ditemukan.");
    }
    return row;
  },

  async cancel(id: number, userId: number) {
    const [booking] = await db.select().from(bookings).where(and(eq(bookings.id, id), eq(bookings.userId, userId))).limit(1);
    if (!booking) {
      throw new AppError(404, "Data tidak ditemukan.");
    }
    if (!["pending", "confirmed"].includes(booking.status)) {
      throw new AppError(400, "Booking tidak dapat dibatalkan.");
    }

    await db.transaction(async (tx) => {
      await tx.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, id));
      await tx.update(schedules).set({ status: "available" }).where(eq(schedules.id, booking.scheduleId));
    });
    return this.detail(id, userId);
  },

  async updateStatus(id: number, status: "pending" | "confirmed" | "completed" | "cancelled") {
    await this.detail(id);
    await db.update(bookings).set({ status }).where(eq(bookings.id, id));
    return this.detail(id);
  },
};
