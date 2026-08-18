import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "../utils/app-error.ts";

type ValidatedRequestParts = {
  body?: unknown;
  params?: Request["params"];
};

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(new AppError(422, "Validation error.", result.error.format()));
    }

    const data = result.data as ValidatedRequestParts;
    req.body = data.body ?? req.body;
    req.params = data.params ?? req.params;
    return next();
  };
}
