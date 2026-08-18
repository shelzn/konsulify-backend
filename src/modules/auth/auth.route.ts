import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.ts";
import { validate } from "../../middleware/validate.middleware.ts";
import { authController } from "./auth.controller.ts";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "./auth.validation.ts";

export const authRoute = Router();

authRoute.post("/register", validate(registerSchema), authController.register);
authRoute.post("/login", validate(loginSchema), authController.login);
authRoute.post("/logout", authenticate, authController.logout);
authRoute.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
authRoute.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);
