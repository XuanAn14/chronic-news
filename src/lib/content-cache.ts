import { unstable_cache } from "next/cache";
import prisma from "./prisma";
import { hasConfiguredDatabase } from "./env";

const articleCardSelect = {
  slug: true,
  title: true,
  category: true,
  author: true,
  publishedAt: true,
  featuredImage: true,
  excerpt: true,
  views: true,
} as const;

export const getTrendingArticlesCached = unstable_cache(
  async (limit = 5) => {
    if (!hasConfiguredDatabase()) {
      return [];
    }

    return prisma.article.findMany({
      where: {
        status: "Published",
      },
      orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
      take: limit,
      select: articleCardSelect,
    });
  },
  ["trending-articles"],
  {
    revalidate: 300,
    tags: ["articles", "trending"],
  },
);

export const getRelatedArticlesCached = unstable_cache(
  async (articleId: string, category: string, limit = 3) => {
    if (!hasConfiguredDatabase()) {
      return [];
    }

    let relatedArticles = await prisma.article.findMany({
      where: {
        status: "Published",
        id: {
          not: articleId,
        },
        category,
      },
      orderBy: [{ publishedAt: "desc" }, { views: "desc" }],
      take: limit,
      select: articleCardSelect,
    });

    if (relatedArticles.length < limit) {
      const fallbackArticles = await prisma.article.findMany({
        where: {
          status: "Published",
          id: {
            not: articleId,
          },
          slug: {
            notIn: relatedArticles.map((item) => item.slug),
          },
        },
        orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
        take: limit - relatedArticles.length,
        select: articleCardSelect,
      });

      relatedArticles = [...relatedArticles, ...fallbackArticles];
    }

    return relatedArticles;
  },
  ["related-articles"],
  {
    revalidate: 300,
    tags: ["articles", "related"],
  },
);
