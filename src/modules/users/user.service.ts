import { eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { users } from "../../db/schema/index.ts";
import { AppError } from "../../utils/app-error.ts";
import { comparePassword, hashPassword } from "../../utils/password.ts";

export const userService = {
  async getMe(userId: number) {
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
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new AppError(404, "User tidak ditemukan.");
    }

    return user;
  },

  async updateProfile(userId: number, input: { name?: string; phone?: string; avatar?: string }) {
    await db.update(users).set(input).where(eq(users.id, userId));
    return this.getMe(userId);
  },

  async changePassword(userId: number, input: { currentPassword: string; password: string }) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      throw new AppError(404, "User tidak ditemukan.");
    }

    const valid = await comparePassword(input.currentPassword, user.password);
    if (!valid) {
      throw new AppError(400, "Password saat ini salah.");
    }

    await db.update(users).set({ password: await hashPassword(input.password) }).where(eq(users.id, userId));
    return true;
  },

  async listUsers() {
    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        avatar: users.avatar,
        createdAt: users.createdAt,
      })
      .from(users);
  },
};
