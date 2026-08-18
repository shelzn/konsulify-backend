import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.ts";
import { authorize } from "../../middleware/role.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { bookingController } from "./booking.controller.ts";
import { bookingCreateSchema, bookingParamSchema, bookingStatusSchema } from "./booking.validation.ts";

export const bookingRoute = Router();
export const adminBookingRoute = Router();

bookingRoute.use(authenticate);
bookingRoute.post("/", validate(bookingCreateSchema), bookingController.create);
bookingRoute.get("/", bookingController.listMine);
bookingRoute.get("/:id", validate(bookingParamSchema), bookingController.detailMine);
bookingRoute.patch("/:id/cancel", validate(bookingParamSchema), bookingController.cancelMine);

adminBookingRoute.use(authenticate, authorize("admin"));
adminBookingRoute.get("/", bookingController.adminList);
adminBookingRoute.get("/:id", validate(bookingParamSchema), bookingController.adminDetail);
adminBookingRoute.patch("/:id/status", validate(bookingStatusSchema), bookingController.adminUpdateStatus);
