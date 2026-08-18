import type { Request, Response } from "express";
import { successResponse } from "../../utils/response.ts";
import { scheduleService } from "./schedule.service.ts";

export const scheduleController = {
  async publicByConsultant(req: Request, res: Response) {
    return successResponse(res, "Data berhasil diambil.", await scheduleService.byConsultant(Number(req.params.id)));
  },
  async adminList(req: Request, res: Response) {
    const result = await scheduleService.list(req.query, true);
    return successResponse(res, "Data berhasil diambil.", result.data, 200, result.meta);
  },
  async show(req: Request, res: Response) {
    return successResponse(res, "Data berhasil diambil.", await scheduleService.findById(Number(req.params.id)));
  },
  async create(req: Request, res: Response) {
    return successResponse(res, "Schedule berhasil dibuat.", await scheduleService.create(req.body), 201);
  },
  async update(req: Request, res: Response) {
    return successResponse(res, "Schedule berhasil diperbarui.", await scheduleService.update(Number(req.params.id), req.body));
  },
  async remove(req: Request, res: Response) {
    await scheduleService.remove(Number(req.params.id));
    return successResponse(res, "Schedule berhasil dihapus.", null);
  },
};
