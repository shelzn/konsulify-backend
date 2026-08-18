import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";
import { env } from "../config/env.ts";
import { AppError } from "../utils/app-error.ts";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export function uploadImage(folder: "categories" | "consultants" | "services" | "avatars", fieldName: string) {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), "uploads", folder)),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${randomUUID()}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: env.UPLOAD_MAX_SIZE },
    fileFilter: (_req, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new AppError(422, "File harus berupa JPG, PNG, atau WebP."));
      }
      return cb(null, true);
    },
  }).single(fieldName);
}
