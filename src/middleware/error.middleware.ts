import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../utils/app-error.ts";
import { errorResponse } from "../utils/response.ts";

export const notFoundMiddleware: RequestHandler = (req, res) => {
  return errorResponse(res, 404, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`);
};

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, err.message, err.errors);
  }

  if (err?.code === "ER_DUP_ENTRY") {
    return errorResponse(res, 409, "Data sudah digunakan.");
  }

  console.error(err);
  return errorResponse(res, 500, "Internal server error.");
};
