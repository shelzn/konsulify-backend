import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.ts";
import { authorize } from "../../middleware/role.middleware.ts";
import { uploadImage } from "../../middleware/upload.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { serviceController } from "./service.controller.ts";
import { serviceCreateSchema, serviceParamSchema, serviceUpdateSchema } from "./service.validation.ts";

export const serviceRoute = Router();
export const adminServiceRoute = Router();

serviceRoute.get("/", serviceController.publicList);
serviceRoute.get("/:id", validate(serviceParamSchema), serviceController.publicShow);

adminServiceRoute.use(authenticate, authorize("admin"));
adminServiceRoute.get("/", serviceController.adminList);
adminServiceRoute.post("/", uploadImage("services", "image"), validate(serviceCreateSchema), serviceController.create);
adminServiceRoute.get("/:id", validate(serviceParamSchema), serviceController.show);
adminServiceRoute.patch("/:id", uploadImage("services", "image"), validate(serviceUpdateSchema), serviceController.update);
adminServiceRoute.delete("/:id", validate(serviceParamSchema), serviceController.remove);
