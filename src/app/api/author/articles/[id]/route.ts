import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "../../../../../lib/prisma";
import { getAuthorFromCookie } from "../../../../../lib/site-auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 200);
}

async function generateUniqueSlug(title: string, articleId: string) {
  const baseSlug = slugify(title) || "article";
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (!existing || existing.id === articleId) {
      return slug;
    }
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const author = await getAuthorFromCookie();
  if (!author) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await prisma.article.findFirst({
    where: { id, siteAuthorId: author.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const body = await request.json();
  const title = body?.title?.toString().trim();
  const excerpt = body?.excerpt?.toString().trim();
  const content = body?.content?.toString().trim();
  const metaTitle = body?.metaTitle?.toString().trim() || "";
  const metaDescription = body?.metaDescription?.toString().trim() || "";
  const category = body?.category?.toString().trim() || "Technology";
  const status = body?.status?.toString().trim() || "Draft";
  const featuredImage = body?.featuredImage?.toString().trim() || "";

  if (!title || !excerpt || !content) {
    return NextResponse.json(
      { error: "Title, excerpt, and content are required." },
      { status: 400 },
    );
  }

  const slug = await generateUniqueSlug(title, existing.id);
  const publishedAt =
    status === "Published"
      ? existing.publishedAt ?? new Date()
      : null;

  const article = await prisma.article.update({
    where: { id: existing.id },
    data: {
      title,
      slug,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      excerpt,
      content,
      category,
      status,
      featuredImage:
        featuredImage ||
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=800&fit=crop",
      publishedAt,
    },
  });

  revalidatePath("/");
  revalidatePath("/author");
  revalidatePath(`/article/${existing.slug}`);
  revalidatePath(`/article/${article.slug}`);

  return NextResponse.json({ article });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const author = await getAuthorFromCookie();
  if (!author) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const article = await prisma.article.findFirst({
    where: { id, siteAuthorId: author.id },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  await prisma.article.delete({ where: { id: article.id } });

  revalidatePath("/");
  revalidatePath("/author");
  revalidatePath(`/article/${article.slug}`);

  return NextResponse.json({ success: true });
}
