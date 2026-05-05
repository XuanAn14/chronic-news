import { Category, type Article } from "../types";

export function estimateReadTimeMinutes(content?: string, excerpt?: string) {
  const source = `${content ?? ""} ${excerpt ?? ""}`.trim();
  const wordCount = source ? source.split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export function normalizeCategory(value: string): Category {
  return Object.values(Category).includes(value as Category)
    ? (value as Category)
    : Category.Technology;
}

export function categoryToSlug(category: string) {
  return category.toLowerCase();
}

export function slugToCategory(slug: string) {
  const normalized = slug.trim().toLowerCase();
  const match = Object.values(Category).find(
    (category) => category.toLowerCase() === normalized,
  );

  return match ?? null;
}

export function mapDbArticle(article: {
  id?: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  publishedAt: Date | null;
  featuredImage: string | null;
  excerpt: string;
  content?: string;
  views?: number;
  saved?: boolean;
}): Article {
  const readTimeMinutes = estimateReadTimeMinutes(article.content, article.excerpt);

  return {
    id: article.slug,
    databaseId: article.id,
    title: article.title,
    category: normalizeCategory(article.category),
    author: {
      name: article.author,
      role: "Editorial Desk",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    date: article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Now",
    image:
      article.featuredImage ||
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop",
    snippet: article.excerpt,
    readTime: `${readTimeMinutes} min read`,
    views: article.views?.toLocaleString(),
    saved: article.saved,
  };
}
