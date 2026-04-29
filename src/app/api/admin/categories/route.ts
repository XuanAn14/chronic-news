import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "../../../../lib/prisma";
import { getAdminFromCookie } from "../../../../lib/auth";
import { slugify } from "../../../../lib/editor";

export async function POST(request: Request) {
  const admin = await getAdminFromCookie();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const name = body?.name?.toString().trim();
  const description = body?.description?.toString().trim() || null;

  if (!name) {
    return NextResponse.json({ error: "Category name is required." }, { status: 400 });
  }

  const slug = slugify(name);
  if (!slug) {
    return NextResponse.json({ error: "Invalid category name." }, { status: 400 });
  }

  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name }, { slug }],
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Category already exists." }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/editor");
  revalidatePath("/author/editor");
  revalidateTag("articles");

  return NextResponse.json({ category }, { status: 201 });
}
