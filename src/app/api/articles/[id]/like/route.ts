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

  const existingLike = await prisma.articleLike.findUnique({
    where: {
      articleId_userId: {
        articleId: id,
        userId: user.id,
      },
    },
  });

  if (existingLike) {
    await prisma.articleLike.delete({
      where: {
        articleId_userId: {
          articleId: id,
          userId: user.id,
        },
      },
    });
  } else {
    await prisma.articleLike.create({
      data: {
        articleId: id,
        userId: user.id,
      },
    });
  }

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  await prisma.article.update({
    where: { id },
    data: {
      likesCount: article._count.likes,
      commentsCount: article._count.comments,
    },
  });

  revalidatePath("/");
  revalidatePath("/author");
  revalidatePath(`/article/${article.slug}`);

  return NextResponse.json({
    liked: !existingLike,
    likesCount: article._count.likes,
  });
}
