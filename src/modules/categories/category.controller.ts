import type { Request, Response } from "express";
import { successResponse } from "../../utils/response.ts";
import { categoryService } from "./category.service.ts";

function filePath(req: Request, folder: string) {
  return req.file ? `/uploads/${folder}/${req.file.filename}` : undefined;
}

export const categoryController = {
  async publicList(req: Request, res: Response) {
    const result = await categoryService.list(req.query);
    return successResponse(res, "Data berhasil diambil.", result.data, 200, result.meta);
  },
  async adminList(req: Request, res: Response) {
    const result = await categoryService.list(req.query, true);
    return successResponse(res, "Data berhasil diambil.", result.data, 200, result.meta);
  },
  async show(req: Request, res: Response) {
    return successResponse(res, "Data berhasil diambil.", await categoryService.findById(Number(req.params.id), true));
  },
  async create(req: Request, res: Response) {
    return successResponse(res, "Category berhasil dibuat.", await categoryService.create({ ...req.body, image: filePath(req, "categories") }), 201);
  },
  async update(req: Request, res: Response) {
    return successResponse(res, "Category berhasil diperbarui.", await categoryService.update(Number(req.params.id), { ...req.body, image: filePath(req, "categories") }));
  },
  async remove(req: Request, res: Response) {
    await categoryService.remove(Number(req.params.id));
    return successResponse(res, "Category berhasil dihapus.", null);
  },
};
