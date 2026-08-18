import type { Request, Response } from "express";
import { successResponse } from "../../utils/response.ts";
import { authService } from "./auth.service.ts";

export const authController = {
  async register(req: Request, res: Response) {
    const user = await authService.register(req.body);
    return successResponse(res, "Register berhasil.", user, 201);
  },

  async login(req: Request, res: Response) {
    const data = await authService.login(req.body);
    return successResponse(res, "Login berhasil.", data);
  },

  async logout(_req: Request, res: Response) {
    return successResponse(res, "Logout berhasil.", null);
  },

  async forgotPassword(req: Request, res: Response) {
    const data = await authService.forgotPassword(req.body.email);
    return successResponse(res, "Instruksi reset password berhasil dibuat.", data);
  },

  async resetPassword(req: Request, res: Response) {
    await authService.resetPassword(req.body);
    return successResponse(res, "Password berhasil direset.", null);
  },
};
