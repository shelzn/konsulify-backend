import type { Request, Response } from "express";
import { AppError } from "../../utils/app-error.ts";
import { successResponse } from "../../utils/response.ts";
import { userService } from "./user.service.ts";

export const userController = {
  async me(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError(401, "Unauthorized.");
    }
    return successResponse(res, "Data berhasil diambil.", await userService.getMe(req.user.id));
  },

  async updateProfile(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError(401, "Unauthorized.");
    }
    return successResponse(res, "Profil berhasil diperbarui.", await userService.updateProfile(req.user.id, req.body));
  },

  async changePassword(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError(401, "Unauthorized.");
    }
    await userService.changePassword(req.user.id, req.body);
    return successResponse(res, "Password berhasil diubah.", null);
  },

  async listUsers(_req: Request, res: Response) {
    return successResponse(res, "Data berhasil diambil.", await userService.listUsers());
  },
};
