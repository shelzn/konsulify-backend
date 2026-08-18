import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.ts";
import { authorize } from "../../middleware/role.middleware.ts";
import { userController } from "../users/user.controller.ts";
import { adminController } from "./admin.controller.ts";

export const adminRoute = Router();

adminRoute.use(authenticate, authorize("admin"));
adminRoute.get("/", adminController.dashboard);
adminRoute.get("/users", userController.listUsers);
