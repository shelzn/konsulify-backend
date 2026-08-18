import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi."),
  JWT_SECRET: z.string().min(16, "JWT_SECRET minimal 16 karakter."),
  JWT_EXPIRES_IN: z.string().default("7d"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  UPLOAD_MAX_SIZE: z.coerce.number().default(2 * 1024 * 1024),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Environment tidak valid:", parsed.error.format());
  throw new Error("Environment tidak valid.");
}

export const env = parsed.data;
