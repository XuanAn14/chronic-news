import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { getAuthorFromCookie } from "../../../../lib/site-auth";
import { getAdminFromCookie } from "../../../../lib/auth";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  const [author, admin] = await Promise.all([
    getAuthorFromCookie(),
    getAdminFromCookie(),
  ]);

  if (!author && !admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are allowed." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = path.extname(file.name) || ".png";
  const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
