import cors from "cors";
import express from "express";
import path from "node:path";
import { env } from "./config/env.ts";
import { adminRoute } from "./modules/admin/admin.route.ts";
import { authRoute } from "./modules/auth/auth.route.ts";
import { adminBookingRoute, bookingRoute } from "./modules/bookings/booking.route.ts";
import { adminCategoryRoute, categoryRoute } from "./modules/categories/category.route.ts";
import { adminConsultantRoute, consultantRoute } from "./modules/consultants/consultant.route.ts";
import { adminScheduleRoute } from "./modules/schedules/schedule.route.ts";
import { adminServiceRoute, serviceRoute } from "./modules/services/service.route.ts";
import { userRoute } from "./modules/users/user.route.ts";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware.ts";

export const app = express();

app.use(cors({ origin: env.NODE_ENV === "production" ? env.APP_URL : true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  if (env.NODE_ENV !== "production" && req.path.startsWith("/api")) {
    console.log(`[API] ${req.method} ${req.originalUrl}`, req.body);
  }
  next();
});
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Konsulify API aktif.", data: { status: "ok" } });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/consultants", consultantRoute);
app.use("/api/v1/services", serviceRoute);
app.use("/api/v1/bookings", bookingRoute);

app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/admin/categories", adminCategoryRoute);
app.use("/api/v1/admin/consultants", adminConsultantRoute);
app.use("/api/v1/admin/services", adminServiceRoute);
app.use("/api/v1/admin/schedules", adminScheduleRoute);
app.use("/api/v1/admin/bookings", adminBookingRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
