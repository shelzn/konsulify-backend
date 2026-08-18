import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { users, type User } from "../db/schema/index.ts";
import { AppError } from "../utils/app-error.ts";
import { verifyToken } from "../utils/jwt.ts";

export type AuthUser = Pick<User, "id" | "name" | "email" | "phone" | "role" | "avatar">;

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new AppError(401, "Unauthorized."));
  }

  try {
    const payload = verifyToken(token);
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, payload.id))
      .limit(1);

    if (!user) {
      return next(new AppError(401, "Unauthorized."));
    }

    req.user = user;
    return next();
  } catch {
    return next(new AppError(401, "Unauthorized."));
  }
}
