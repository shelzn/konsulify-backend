import type { Request, Response } from "express";
import { successResponse } from "../../utils/response.ts";
import { serviceService } from "./service.service.ts";

const imagePath = (req: Request) => req.file ? `/uploads/services/${req.file.filename}` : undefined;

export const serviceController = {
  async publicList(req: Request, res: Response) {
    const result = await serviceService.list(req.query);
    return successResponse(res, "Data berhasil diambil.", result.data, 200, result.meta);
  },
  async publicShow(req: Request, res: Response) {
    return successResponse(res, "Data berhasil diambil.", await serviceService.findById(Number(req.params.id)));
  },
  async adminList(req: Request, res: Response) {
    const result = await serviceService.list(req.query, true);
    return successResponse(res, "Data berhasil diambil.", result.data, 200, result.meta);
  },
  async show(req: Request, res: Response) {
    return successResponse(res, "Data berhasil diambil.", await serviceService.findById(Number(req.params.id), true));
  },
  async create(req: Request, res: Response) {
    return successResponse(res, "Service berhasil dibuat.", await serviceService.create({ ...req.body, image: imagePath(req) }), 201);
  },
  async update(req: Request, res: Response) {
    return successResponse(res, "Service berhasil diperbarui.", await serviceService.update(Number(req.params.id), { ...req.body, image: imagePath(req) }));
  },
  async remove(req: Request, res: Response) {
    await serviceService.remove(Number(req.params.id));
    return successResponse(res, "Service berhasil dihapus.", null);
  },
};
