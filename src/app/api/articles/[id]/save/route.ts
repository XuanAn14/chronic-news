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
    key: `article-save:${getClientIp(request)}:${id}`,
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

  const article = await prisma.article.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
      status: "Published",
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const existingSave = await prisma.articleSave.findUnique({
    where: {
      articleId_userId: {
        articleId: article.id,
        userId: user.id,
      },
    },
  });

  if (existingSave) {
    await prisma.articleSave.delete({
      where: {
        articleId_userId: {
          articleId: article.id,
          userId: user.id,
        },
      },
    });
  } else {
    await prisma.articleSave.create({
      data: {
        articleId: article.id,
        userId: user.id,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/history");
  revalidatePath(`/article/${article.slug}`);

  return NextResponse.json({
    saved: !existingSave,
  });
}
