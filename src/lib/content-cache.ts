import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import prisma from "./prisma";
import { hasConfiguredDatabase } from "./env";

const articleCardSelect = {
  id: true,
  slug: true,
  title: true,
  category: true,
  author: true,
  publishedAt: true,
  featuredImage: true,
  excerpt: true,
  views: true,
} as const;

type ArticleSort = "latest" | "popular";
type ArticleCardResult = {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  publishedAt: Date | null;
  featuredImage: string | null;
  excerpt: string;
  views: number;
};

function getArticleOrderBy(sort: ArticleSort) {
  return sort === "popular"
    ? [{ views: "desc" as const }, { publishedAt: "desc" as const }]
    : [{ publishedAt: "desc" as const }, { createdAt: "desc" as const }];
}

function getArticleSearchOrderBy(sort: ArticleSort) {
  return sort === "popular"
    ? Prisma.sql`"views" DESC, "publishedAt" DESC NULLS LAST`
    : Prisma.sql`"publishedAt" DESC NULLS LAST, "createdAt" DESC`;
}

async function searchPublicArticles(
  query: string,
  selectedCategory: string,
  sort: ArticleSort,
  limit: number,
) {
  const searchQuery = query.trim();

  return prisma.$queryRaw<ArticleCardResult[]>`
    SELECT
      "id",
      "slug",
      "title",
      "category",
      "author",
      "publishedAt",
      "featuredImage",
      "excerpt",
      "views"
    FROM "Article"
    WHERE "status" = 'Published'
      ${selectedCategory ? Prisma.sql`AND "category" = ${selectedCategory}` : Prisma.empty}
      AND to_tsvector(
        'english',
        coalesce("title", '') || ' ' ||
        coalesce("excerpt", '') || ' ' ||
        coalesce("content", '') || ' ' ||
        coalesce("author", '')
      ) @@ websearch_to_tsquery('english', ${searchQuery})
    ORDER BY ${getArticleSearchOrderBy(sort)}
    LIMIT ${limit}
  `;
}

export const getHomeArticlesCached = unstable_cache(
  async (query = "", selectedCategory = "", sort: ArticleSort = "latest", limit = 20) => {
    if (!hasConfiguredDatabase()) {
      return [];
    }

    if (query.trim()) {
      return searchPublicArticles(query, selectedCategory, sort, limit);
    }

    return prisma.article.findMany({
      where: {
        status: "Published",
        ...(selectedCategory ? { category: selectedCategory } : {}),
      },
      orderBy: getArticleOrderBy(sort),
      take: limit,
      select: articleCardSelect,
    });
  },
  ["home-articles"],
  {
    revalidate: 60,
    tags: ["articles", "home"],
  },
);

export const getCategoryArticlesCached = unstable_cache(
  async (category: string, query = "", sort: ArticleSort = "latest", limit = 20) => {
    if (!hasConfiguredDatabase()) {
      return [];
    }

    if (query.trim()) {
      return searchPublicArticles(query, category, sort, limit);
    }

    return prisma.article.findMany({
      where: {
        status: "Published",
        category,
      },
      orderBy: getArticleOrderBy(sort),
      take: limit,
      select: articleCardSelect,
    });
  },
  ["category-articles"],
  {
    revalidate: 60,
    tags: ["articles", "category"],
  },
);

export const getOtherCategoryCountsCached = unstable_cache(
  async (category: string, limit = 4) => {
    if (!hasConfiguredDatabase()) {
      return [];
    }

    return prisma.article.groupBy({
      by: ["category"],
      where: {
        status: "Published",
        category: {
          not: category,
        },
      },
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: "desc",
        },
      },
      take: limit,
    });
  },
  ["other-category-counts"],
  {
    revalidate: 300,
    tags: ["articles", "category"],
  },
);

export const getCrossDeskArticlesCached = unstable_cache(
  async (categories: string[], limit = 3) => {
    if (!hasConfiguredDatabase() || !categories.length) {
      return [];
    }

    return prisma.article.findMany({
      where: {
        status: "Published",
        category: {
          in: categories,
        },
      },
      orderBy: [{ publishedAt: "desc" }, { views: "desc" }],
      take: limit,
      select: articleCardSelect,
    });
  },
  ["cross-desk-articles"],
  {
    revalidate: 300,
    tags: ["articles", "category"],
  },
);

export const getArticleDetailCached = unstable_cache(
  async (slug: string) => {
    if (!hasConfiguredDatabase()) {
      return null;
    }

    return prisma.article.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        metaTitle: true,
        metaDescription: true,
        excerpt: true,
        content: true,
        category: true,
        status: true,
        author: true,
        featuredImage: true,
        publishedAt: true,
        views: true,
        likesCount: true,
        commentsCount: true,
      },
    });
  },
  ["article-detail"],
  {
    revalidate: 300,
    tags: ["articles", "article"],
  },
);

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
