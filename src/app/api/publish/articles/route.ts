import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "../../../../lib/prisma";
import { getPublishApiKey, verifyPublishApiKey } from "../../../../lib/api-key";
import { getClientIp, checkRateLimit, rateLimitResponse } from "../../../../lib/rate-limit";
import {
  slugify,
  suggestMetaDescription,
  suggestMetaTitle,
  trimMetaDescription,
  trimMetaTitle,
} from "../../../../lib/editor";
import { isAllowedFeaturedImage } from "../../../../lib/images";

const DEFAULT_FEATURED_IMAGE =
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=800&fit=crop";
const MAX_BATCH_SIZE = 100;

type PublishArticleInput = {
  title?: unknown;
  slug?: unknown;
  externalId?: unknown;
  excerpt?: unknown;
  content?: unknown;
  category?: unknown;
  status?: unknown;
  author?: unknown;
  featuredImage?: unknown;
  metaTitle?: unknown;
  metaDescription?: unknown;
  publishedAt?: unknown;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeContent(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => asString(item)).filter(Boolean).join("\n\n").trim();
  }

  return asString(value);
}

function parsePublishedAt(value: unknown) {
  const rawValue = asString(value);

  if (!rawValue) {
    return new Date();
  }

  const date = new Date(rawValue);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function generateUniqueSlug(preferredSlug: string, title: string) {
  const baseSlug = slugify(preferredSlug) || slugify(title) || "article";

  for (let suffix = 0; suffix < 50; suffix += 1) {
    const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix + 1}`;
    const existing = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }
  }

  return `${baseSlug}-${Date.now()}`;
}

function articleResult(article: {
  id: string;
  slug: string;
  externalId: string | null;
  status: string;
  publishedAt: Date | null;
}) {
  return {
    id: article.id,
    slug: article.slug,
    externalId: article.externalId,
    status: article.status,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    url: `/article/${article.slug}`,
  };
}

async function createArticle(input: PublishArticleInput) {
  const title = asString(input.title);
  const content = normalizeContent(input.content);
  const excerpt =
    asString(input.excerpt) || trimMetaDescription(content.replace(/\n+/g, " "));
  const status = asString(input.status) || "Published";
  const externalId = asString(input.externalId) || null;
  const featuredImage = asString(input.featuredImage);
  const publishedAt = status === "Published" ? parsePublishedAt(input.publishedAt) : null;

  if (!title || !content) {
    return {
      ok: false as const,
      status: 400,
      error: "Title and content are required.",
    };
  }

  if (!["Draft", "Published"].includes(status)) {
    return {
      ok: false as const,
      status: 400,
      error: "Status must be Draft or Published.",
    };
  }

  if (status === "Published" && !publishedAt) {
    return {
      ok: false as const,
      status: 400,
      error: "publishedAt must be a valid date when provided.",
    };
  }

  if (!isAllowedFeaturedImage(featuredImage)) {
    return {
      ok: false as const,
      status: 400,
      error: "Featured image must be an uploaded image or an allowed HTTPS image URL.",
    };
  }

  if (externalId) {
    const existing = await prisma.article.findUnique({
      where: { externalId },
      select: {
        id: true,
        slug: true,
        externalId: true,
        status: true,
        publishedAt: true,
      },
    });

    if (existing) {
      return {
        ok: true as const,
        duplicate: true,
        article: articleResult(existing),
      };
    }
  }

  const slug = await generateUniqueSlug(asString(input.slug), title);
  const metaTitle = trimMetaTitle(asString(input.metaTitle) || suggestMetaTitle(title));
  const metaDescription = trimMetaDescription(
    asString(input.metaDescription) || suggestMetaDescription(excerpt, content),
  );

  try {
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        externalId,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        excerpt,
        content,
        category: asString(input.category) || "Technology",
        status,
        author: asString(input.author) || "API Publisher",
        featuredImage: featuredImage || DEFAULT_FEATURED_IMAGE,
        publishedAt,
        views: 0,
        likesCount: 0,
        commentsCount: 0,
      },
      select: {
        id: true,
        slug: true,
        externalId: true,
        status: true,
        publishedAt: true,
      },
    });

    return {
      ok: true as const,
      duplicate: false,
      article: articleResult(article),
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        ok: false as const,
        status: 409,
        error: "Article slug or externalId already exists.",
      };
    }

    throw error;
  }
}

export async function POST(request: Request) {
  if (!getPublishApiKey()) {
    return NextResponse.json(
      { error: "PUBLISH_API_KEY is not configured." },
      { status: 503 },
    );
  }

  if (!verifyPublishApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const rateLimit = checkRateLimit({
    key: `publish-api:${getClientIp(request)}`,
    limit: 600,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfter);
  }

  const body = await request.json().catch(() => null);
  const inputs = Array.isArray(body?.articles) ? body.articles : [body];

  if (!body || !inputs.length) {
    return NextResponse.json({ error: "Request body is required." }, { status: 400 });
  }

  if (inputs.length > MAX_BATCH_SIZE) {
    return NextResponse.json(
      { error: `Batch size must be ${MAX_BATCH_SIZE} articles or fewer.` },
      { status: 400 },
    );
  }

  const results = [];
  for (const input of inputs) {
    results.push(await createArticle(input ?? {}));
  }

  revalidatePath("/");
  revalidateTag("articles");

  const hasErrors = results.some((result) => !result.ok);
  const payload = {
    results: results.map((result, index) => ({
      index,
      ...result,
    })),
  };

  if (Array.isArray(body?.articles)) {
    return NextResponse.json(payload, { status: hasErrors ? 207 : 201 });
  }

  const [result] = payload.results;
  return NextResponse.json(result, { status: result.ok ? (result.duplicate ? 200 : 201) : result.status });
}
