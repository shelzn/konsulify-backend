import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.ts";
import { authorize } from "../../middleware/role.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { scheduleController } from "./schedule.controller.ts";
import { scheduleCreateSchema, scheduleParamSchema, scheduleUpdateSchema } from "./schedule.validation.ts";

export const adminScheduleRoute = Router();

adminScheduleRoute.use(authenticate, authorize("admin"));
adminScheduleRoute.get("/", scheduleController.adminList);
adminScheduleRoute.post("/", validate(scheduleCreateSchema), scheduleController.create);
adminScheduleRoute.get("/:id", validate(scheduleParamSchema), scheduleController.show);
adminScheduleRoute.patch("/:id", validate(scheduleUpdateSchema), scheduleController.update);
adminScheduleRoute.delete("/:id", validate(scheduleParamSchema), scheduleController.remove);
