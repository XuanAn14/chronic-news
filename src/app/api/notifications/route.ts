import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getSiteUserFromCookie } from "../../../lib/site-auth";
import { hasConfiguredDatabase } from "../../../lib/env";

function trimComment(content: string) {
  return content.length > 96 ? `${content.slice(0, 93)}...` : content;
}

export async function GET() {
  if (!hasConfiguredDatabase()) {
    return NextResponse.json({
      items: [],
      emptyMessage: "Database is not configured for notifications.",
    });
  }

  const user = await getSiteUserFromCookie();
  if (!user) {
    return NextResponse.json({
      items: [],
      emptyMessage: "Sign in to get personalized notifications.",
    });
  }

  if (user.role === "AUTHOR") {
    const articles = await prisma.article.findMany({
      where: {
        siteAuthorId: user.id,
      },
      select: {
        id: true,
        title: true,
        views: true,
        updatedAt: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            saves: true,
          },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          take: 2,
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
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    });

    const commentNotifications = articles.flatMap((article) =>
      article.comments.map((comment) => ({
        id: `comment-${comment.id}`,
        title: article.title,
        body: `${comment.user.name} commented: "${trimComment(comment.content)}"`,
        href: `/author/editor/${article.id}`,
        label: "New comment",
        createdAt: comment.createdAt.toISOString(),
      })),
    );

    const summaryNotifications = articles
      .filter(
        (article) =>
          article.views > 0 ||
          article._count.likes > 0 ||
          article._count.comments > 0 ||
          article._count.saves > 0,
      )
      .map((article) => ({
        id: `summary-${article.id}`,
        title: article.title,
        body: `${article.views.toLocaleString()} views, ${article._count.likes} likes, ${article._count.comments} comments, ${article._count.saves} saves`,
        href: "/author",
        label: "Engagement",
        createdAt: article.updatedAt.toISOString(),
      }));

    const items = [...commentNotifications, ...summaryNotifications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);

    return NextResponse.json({
      items,
      emptyMessage: "Publish articles to start receiving engagement notifications.",
    });
  }

  const [likedCategories, savedCategories, commentCategories] = await Promise.all([
    prisma.articleLike.findMany({
      where: { userId: user.id },
      select: { article: { select: { category: true } } },
      take: 20,
      orderBy: { createdAt: "desc" },
    }),
    prisma.articleSave.findMany({
      where: { userId: user.id },
      select: { article: { select: { category: true } } },
      take: 20,
      orderBy: { createdAt: "desc" },
    }),
    prisma.articleComment.findMany({
      where: { userId: user.id },
      select: { article: { select: { category: true } } },
      take: 20,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const categoryCounts = new Map<string, number>();
  [...likedCategories, ...savedCategories, ...commentCategories].forEach((item) => {
    const category = item.article.category;
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  });

  const preferredCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);

  const freshArticles = await prisma.article.findMany({
    where: {
      status: "Published",
      ...(preferredCategories.length ? { category: { in: preferredCategories } } : {}),
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 6,
  });

  const items = freshArticles.map((article) => ({
    id: article.id,
    title: article.title,
    body: preferredCategories.length
      ? `New ${article.category.toLowerCase()} story that matches your recent reading activity.`
      : article.excerpt,
    href: `/article/${article.slug}`,
    label: preferredCategories.length ? "For you" : "Latest story",
    createdAt: (article.publishedAt ?? new Date()).toISOString(),
  }));

  return NextResponse.json({
    items,
    emptyMessage: "Read, save, or like articles to personalize your feed notifications.",
  });
}
