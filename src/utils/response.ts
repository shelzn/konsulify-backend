import type { Response } from "express";

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function successResponse<T>(res: Response, message: string, data: T, statusCode = 200, meta?: Meta) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function errorResponse(res: Response, statusCode: number, message: string, errors?: unknown) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}
