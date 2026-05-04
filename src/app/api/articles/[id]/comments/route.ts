import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "../../../../../lib/prisma";
import { getSiteUserFromCookie } from "../../../../../lib/site-auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "../../../../../lib/rate-limit";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSiteUserFromCookie();
  const { id } = await context.params;

  const [article, comments, liked, saved] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      select: {
        views: true,
        likesCount: true,
        commentsCount: true,
      },
    }),
    prisma.articleComment.findMany({
      where: { articleId: id },
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    }),
    user
      ? prisma.articleLike.findUnique({
          where: {
            articleId_userId: {
              articleId: id,
              userId: user.id,
            },
          },
          select: { id: true },
        })
      : Promise.resolve(null),
    user
      ? prisma.articleSave.findUnique({
          where: {
            articleId_userId: {
              articleId: id,
              userId: user.id,
            },
          },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);

  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  return NextResponse.json({
    isLoggedIn: Boolean(user),
    liked: Boolean(liked),
    saved: Boolean(saved),
    likesCount: article.likesCount,
    commentsCount: article.commentsCount,
    viewsCount: article.views,
    comments: comments.map((comment) => ({
      id: comment.id,
      authorName: comment.user.name,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    })),
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const rateLimit = checkRateLimit({
    key: `article-comment:${getClientIp(request)}:${id}`,
    limit: 10,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfter);
  }

  const user = await getSiteUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const content = body?.content?.toString().trim();

  if (!content) {
    return NextResponse.json({ error: "Comment content is required." }, { status: 400 });
  }

  await prisma.articleComment.create({
    data: {
      articleId: id,
      userId: user.id,
      content,
    },
  });

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
    commentsCount: article._count.comments,
  });
}
