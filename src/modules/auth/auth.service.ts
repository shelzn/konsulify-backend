import { randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { passwordResetTokens, users } from "../../db/schema/index.ts";
import { AppError } from "../../utils/app-error.ts";
import { signToken } from "../../utils/jwt.ts";
import { comparePassword, hashPassword } from "../../utils/password.ts";

function sanitizeUser(user: typeof users.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
  };
}

export const authService = {
  async register(input: { name: string; email: string; phone?: string; password: string }) {
    const [existing] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
    if (existing) {
      throw new AppError(409, "Email sudah terdaftar.");
    }

    const hashed = await hashPassword(input.password);
    await db.insert(users).values({
      name: input.name,
      email: input.email,
      phone: input.phone,
      password: hashed,
      role: "user",
    });

    const [created] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
    if (!created) {
      throw new AppError(500, "Gagal membuat akun.");
    }

    return sanitizeUser(created);
  },

  async login(input: { email: string; password: string }) {
    const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
    if (!user) {
      throw new AppError(401, "Email atau password salah.");
    }

    const valid = await comparePassword(input.password, user.password);
    if (!valid) {
      throw new AppError(401, "Email atau password salah.");
    }

    return {
      token: signToken({ id: user.id, role: user.role }),
      user: sanitizeUser(user),
    };
  },

  async forgotPassword(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return { resetToken: null };
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
    await db.insert(passwordResetTokens).values({ userId: user.id, token, expiresAt });
    return { resetToken: token };
  },

  async resetPassword(input: { token: string; password: string }) {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(and(eq(passwordResetTokens.token, input.token), gt(passwordResetTokens.expiresAt, new Date())))
      .limit(1);

    if (!resetToken) {
      throw new AppError(400, "Token reset password tidak valid atau sudah kedaluwarsa.");
    }

    const hashed = await hashPassword(input.password);
    await db.update(users).set({ password: hashed }).where(eq(users.id, resetToken.userId));
    return true;
  },
};
