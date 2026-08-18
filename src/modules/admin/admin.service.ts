import { count, desc, eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { bookings, consultants, services, users } from "../../db/schema/index.ts";

export const adminService = {
  async dashboard() {
    const [userTotal] = await db.select({ value: count() }).from(users);
    const [consultantTotal] = await db.select({ value: count() }).from(consultants);
    const [serviceTotal] = await db.select({ value: count() }).from(services);
    const [bookingTotal] = await db.select({ value: count() }).from(bookings);
    const [pendingTotal] = await db.select({ value: count() }).from(bookings).where(eq(bookings.status, "pending"));
    const [completedTotal] = await db.select({ value: count() }).from(bookings).where(eq(bookings.status, "completed"));
    const latestBookings = await db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(10);

    return {
      summary: {
        totalUser: userTotal?.value ?? 0,
        totalConsultant: consultantTotal?.value ?? 0,
        totalService: serviceTotal?.value ?? 0,
        totalBooking: bookingTotal?.value ?? 0,
        pendingBooking: pendingTotal?.value ?? 0,
        completedBooking: completedTotal?.value ?? 0,
      },
      latestBookings,
    };
  },
};
