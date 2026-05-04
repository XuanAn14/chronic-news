import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "../../../../../lib/prisma";
import { getSiteUserFromCookie } from "../../../../../lib/site-auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "../../../../../lib/rate-limit";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const rateLimit = checkRateLimit({
    key: `article-like:${getClientIp(request)}:${id}`,
    limit: 30,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfter);
  }

  const user = await getSiteUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

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
