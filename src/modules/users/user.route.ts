import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { changePasswordSchema, updateProfileSchema } from "./user.validation.ts";
import { userController } from "./user.controller.ts";

export const userRoute = Router();

userRoute.get("/me", authenticate, userController.me);
userRoute.patch("/profile", authenticate, validate(updateProfileSchema), userController.updateProfile);
userRoute.patch("/profile/password", authenticate, validate(changePasswordSchema), userController.changePassword);
