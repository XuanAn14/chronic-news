import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { getSiteUserFromCookie } from "../../../../../lib/site-auth";
import { revalidatePath } from "next/cache";
import { checkRateLimit, getClientIp, rateLimitResponse } from "../../../../../lib/rate-limit";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const rateLimit = checkRateLimit({
    key: `article-view:${getClientIp(request)}:${id}`,
    limit: 20,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfter);
  }

  const user = await getSiteUserFromCookie();

  const article = await prisma.$transaction(async (tx) => {
    const updatedArticle = await tx.article.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        views: true,
        slug: true,
      },
    });

    if (user) {
      await tx.articleViewHistory.upsert({
        where: {
          articleId_userId: {
            articleId: id,
            userId: user.id,
          },
        },
        update: {
          viewedAt: new Date(),
        },
        create: {
          articleId: id,
          userId: user.id,
          viewedAt: new Date(),
        },
      });
    }

    return updatedArticle;
  });

  if (user) {
    revalidatePath("/history");
  }

  return NextResponse.json({
    viewsCount: article.views,
  });
}
