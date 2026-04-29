import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "../../../../../lib/prisma";
import { getAdminFromCookie } from "../../../../../lib/auth";
import { slugify } from "../../../../../lib/editor";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookie();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const params = await context.params;
  const currentCategory = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (!currentCategory) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  const body = await request.json();
  const name = body?.name?.toString().trim();
  const description = body?.description?.toString().trim() || null;

  if (!name) {
    return NextResponse.json({ error: "Category name is required." }, { status: 400 });
  }

  const slug = slugify(name);
  const duplicate = await prisma.category.findFirst({
    where: {
      id: { not: params.id },
      OR: [{ name }, { slug }],
    },
  });

  if (duplicate) {
    return NextResponse.json({ error: "Category name already exists." }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
      },
    }),
    prisma.article.updateMany({
      where: { category: currentCategory.name },
      data: { category: name },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/editor");
  revalidatePath("/author/editor");
  revalidateTag("articles");

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookie();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const params = await context.params;
  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  const articleCount = await prisma.article.count({
    where: { category: category.name },
  });

  if (articleCount > 0) {
    return NextResponse.json(
      { error: "Category still has articles assigned." },
      { status: 409 },
    );
  }

  await prisma.category.delete({
    where: { id: params.id },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/editor");
  revalidatePath("/author/editor");
  revalidateTag("articles");

  return NextResponse.json({ success: true });
}
