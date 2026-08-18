import type { Request, Response } from "express";
import { successResponse } from "../../utils/response.ts";
import { adminService } from "./admin.service.ts";

export const adminController = {
  async dashboard(_req: Request, res: Response) {
    return successResponse(res, "Data berhasil diambil.", await adminService.dashboard());
  },
};
