import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.ts";
import { authorize } from "../../middleware/role.middleware.ts";
import { uploadImage } from "../../middleware/upload.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { scheduleController } from "../schedules/schedule.controller.ts";
import { consultantController } from "./consultant.controller.ts";
import { consultantCreateSchema, consultantParamSchema, consultantUpdateSchema } from "./consultant.validation.ts";

export const consultantRoute = Router();
export const adminConsultantRoute = Router();

consultantRoute.get("/", consultantController.publicList);
consultantRoute.get("/:id", validate(consultantParamSchema), consultantController.publicDetail);
consultantRoute.get("/:id/schedules", validate(consultantParamSchema), scheduleController.publicByConsultant);

adminConsultantRoute.use(authenticate, authorize("admin"));
adminConsultantRoute.get("/", consultantController.adminList);
adminConsultantRoute.post("/", uploadImage("consultants", "photo"), validate(consultantCreateSchema), consultantController.create);
adminConsultantRoute.get("/:id", validate(consultantParamSchema), consultantController.show);
adminConsultantRoute.patch("/:id", uploadImage("consultants", "photo"), validate(consultantUpdateSchema), consultantController.update);
adminConsultantRoute.delete("/:id", validate(consultantParamSchema), consultantController.remove);
