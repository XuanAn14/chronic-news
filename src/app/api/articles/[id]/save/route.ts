import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "../../../../../lib/prisma";
import { getSiteUserFromCookie } from "../../../../../lib/site-auth";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSiteUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  const existingSave = await prisma.articleSave.findUnique({
    where: {
      articleId_userId: {
        articleId: id,
        userId: user.id,
      },
    },
  });

  if (existingSave) {
    await prisma.articleSave.delete({
      where: {
        articleId_userId: {
          articleId: id,
          userId: user.id,
        },
      },
    });
  } else {
    await prisma.articleSave.create({
      data: {
        articleId: id,
        userId: user.id,
      },
    });
  }

  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      slug: true,
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath(`/article/${article.slug}`);

  return NextResponse.json({
    saved: !existingSave,
  });
}
