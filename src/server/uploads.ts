import { mkdirSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { extname, join } from "node:path";

import { UPLOAD_DIR } from "./db";

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

const MAX_BYTES = 6 * 1024 * 1024;

export async function saveUploadedImage(file: File): Promise<string> {
  const extension = ALLOWED[file.type];
  if (!extension) throw new Error("Only JPEG, PNG, WebP or AVIF images are allowed.");

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) throw new Error("The uploaded file is empty.");
  if (buffer.length > MAX_BYTES) throw new Error("Images must be smaller than 6 MB.");

  mkdirSync(UPLOAD_DIR, { recursive: true });
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}${extension}`;
  writeFileSync(join(UPLOAD_DIR, filename), buffer);
  return `/api/uploads/${filename}`;
}

export function contentTypeFor(filename: string): string {
  const extension = extname(filename).toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".avif") return "image/avif";
  if (extension === ".svg") return "image/svg+xml";
  return "image/jpeg";
}
