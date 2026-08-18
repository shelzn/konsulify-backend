import type { Request, Response } from "express";
import { AppError } from "../../utils/app-error.ts";
import { successResponse } from "../../utils/response.ts";
import { bookingService } from "./booking.service.ts";

function userId(req: Request) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized.");
  }
  return req.user.id;
}

export const bookingController = {
  async create(req: Request, res: Response) {
    return successResponse(res, "Booking berhasil dibuat.", await bookingService.create(userId(req), req.body), 201);
  },
  async listMine(req: Request, res: Response) {
    const result = await bookingService.listForUser(userId(req), req.query);
    return successResponse(res, "Data berhasil diambil.", result.data, 200, result.meta);
  },
  async detailMine(req: Request, res: Response) {
    return successResponse(res, "Data berhasil diambil.", await bookingService.detail(Number(req.params.id), userId(req)));
  },
  async cancelMine(req: Request, res: Response) {
    return successResponse(res, "Booking berhasil dibatalkan.", await bookingService.cancel(Number(req.params.id), userId(req)));
  },
  async adminList(req: Request, res: Response) {
    const result = await bookingService.listForAdmin(req.query);
    return successResponse(res, "Data berhasil diambil.", result.data, 200, result.meta);
  },
  async adminDetail(req: Request, res: Response) {
    return successResponse(res, "Data berhasil diambil.", await bookingService.detail(Number(req.params.id)));
  },
  async adminUpdateStatus(req: Request, res: Response) {
    return successResponse(res, "Status booking berhasil diperbarui.", await bookingService.updateStatus(Number(req.params.id), req.body.status));
  },
};
