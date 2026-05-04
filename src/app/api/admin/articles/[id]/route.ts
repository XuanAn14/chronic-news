import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "../../../../../lib/prisma";
import { getAdminFromCookie } from "../../../../../lib/auth";
import { slugify } from "../../../../../lib/editor";
import { isAllowedFeaturedImage } from "../../../../../lib/images";

async function generateUniqueSlug(preferredSlug: string, fallbackTitle: string, articleId: string) {
  const baseSlug = slugify(preferredSlug) || slugify(fallbackTitle) || "article";
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
  const admin = await getAdminFromCookie();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await prisma.article.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const body = await request.json();
  const title = body?.title?.toString().trim();
  const excerpt = body?.excerpt?.toString().trim();
  const content = body?.content?.toString().trim();
  const metaTitle = body?.metaTitle?.toString().trim() || "";
  const metaDescription = body?.metaDescription?.toString().trim() || "";
  const requestedSlug = body?.slug?.toString().trim() || "";
  const category = body?.category?.toString().trim() || existing.category;
  const status = body?.status?.toString().trim() || existing.status;
  const featuredImage = body?.featuredImage?.toString().trim() || "";

  if (!title || !excerpt || !content) {
    return NextResponse.json(
      { error: "Title, excerpt, and content are required." },
      { status: 400 },
    );
  }

  if (!["Draft", "Published"].includes(status)) {
    return NextResponse.json({ error: "Invalid article status." }, { status: 400 });
  }

  if (!isAllowedFeaturedImage(featuredImage)) {
    return NextResponse.json(
      { error: "Featured image must be an uploaded image or an allowed HTTPS image URL." },
      { status: 400 },
    );
  }

  const slug = await generateUniqueSlug(requestedSlug, title, existing.id);
  const publishedAt = status === "Published" ? existing.publishedAt ?? new Date() : null;

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
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/comments");
  revalidatePath("/admin/analytics");
  revalidatePath("/admin/categories");
  revalidatePath(`/article/${existing.slug}`);
  revalidatePath(`/article/${article.slug}`);
  revalidateTag("articles");

  return NextResponse.json({ article });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookie();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  await prisma.article.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/comments");
  revalidatePath("/admin/analytics");
  revalidatePath("/admin/categories");
  revalidatePath(`/article/${article.slug}`);
  revalidateTag("articles");

  return NextResponse.json({ success: true });
}
