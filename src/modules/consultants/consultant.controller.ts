import type { Request, Response } from "express";
import { successResponse } from "../../utils/response.ts";
import { consultantService } from "./consultant.service.ts";

const photoPath = (req: Request) => req.file ? `/uploads/consultants/${req.file.filename}` : undefined;

export const consultantController = {
  async publicList(req: Request, res: Response) {
    const result = await consultantService.list(req.query);
    return successResponse(res, "Data berhasil diambil.", result.data, 200, result.meta);
  },
  async publicDetail(req: Request, res: Response) {
    return successResponse(res, "Data berhasil diambil.", await consultantService.detail(Number(req.params.id)));
  },
  async adminList(req: Request, res: Response) {
    const result = await consultantService.list(req.query, true);
    return successResponse(res, "Data berhasil diambil.", result.data, 200, result.meta);
  },
  async show(req: Request, res: Response) {
    return successResponse(res, "Data berhasil diambil.", await consultantService.findById(Number(req.params.id), true));
  },
  async create(req: Request, res: Response) {
    return successResponse(res, "Consultant berhasil dibuat.", await consultantService.create({ ...req.body, photo: photoPath(req) }), 201);
  },
  async update(req: Request, res: Response) {
    return successResponse(res, "Consultant berhasil diperbarui.", await consultantService.update(Number(req.params.id), { ...req.body, photo: photoPath(req) }));
  },
  async remove(req: Request, res: Response) {
    await consultantService.remove(Number(req.params.id));
    return successResponse(res, "Consultant berhasil dihapus.", null);
  },
};
