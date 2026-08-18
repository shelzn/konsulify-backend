import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.ts";

export function authorize(...roles: Array<"admin" | "user">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Unauthorized."));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "Anda tidak memiliki akses."));
    }

    return next();
  };
}
