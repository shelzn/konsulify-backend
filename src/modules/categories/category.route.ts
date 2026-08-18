import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.ts";
import { authorize } from "../../middleware/role.middleware.ts";
import { uploadImage } from "../../middleware/upload.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { categoryController } from "./category.controller.ts";
import { categoryCreateSchema, categoryParamSchema, categoryUpdateSchema } from "./category.validation.ts";

export const categoryRoute = Router();
export const adminCategoryRoute = Router();

categoryRoute.get("/", categoryController.publicList);

adminCategoryRoute.use(authenticate, authorize("admin"));
adminCategoryRoute.get("/", categoryController.adminList);
adminCategoryRoute.post("/", uploadImage("categories", "image"), validate(categoryCreateSchema), categoryController.create);
adminCategoryRoute.get("/:id", validate(categoryParamSchema), categoryController.show);
adminCategoryRoute.patch("/:id", uploadImage("categories", "image"), validate(categoryUpdateSchema), categoryController.update);
adminCategoryRoute.delete("/:id", validate(categoryParamSchema), categoryController.remove);
