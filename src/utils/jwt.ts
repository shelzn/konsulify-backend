import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.ts";

export type JwtUser = {
  id: number;
  role: "admin" | "user";
};

export function signToken(payload: JwtUser) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as SignOptions);
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtUser;
}
