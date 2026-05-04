import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "../../../../lib/prisma";
import { getAuthorFromCookie } from "../../../../lib/site-auth";
import { slugify } from "../../../../lib/editor";
import { isAllowedFeaturedImage } from "../../../../lib/images";

async function generateUniqueSlug(preferredSlug: string, fallbackTitle: string) {
  const baseSlug = slugify(preferredSlug) || slugify(fallbackTitle) || "article";
  let slug = baseSlug;
  let suffix = 1;

  while (await prisma.article.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return slug;
}

export async function POST(request: Request) {
  const author = await getAuthorFromCookie();
  if (!author) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const title = body?.title?.toString().trim();
  const excerpt = body?.excerpt?.toString().trim();
  const content = body?.content?.toString().trim();
  const metaTitle = body?.metaTitle?.toString().trim() || "";
  const metaDescription = body?.metaDescription?.toString().trim() || "";
  const requestedSlug = body?.slug?.toString().trim() || "";
  const category = body?.category?.toString().trim() || "Technology";
  const status = body?.status?.toString().trim() || "Draft";
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

  const slug = await generateUniqueSlug(requestedSlug, title);
  const publishedAt = status === "Published" ? new Date() : null;

  const article = await prisma.article.create({
    data: {
      title,
      slug,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      excerpt,
      content,
      category,
      status,
      author: author.name,
      featuredImage:
        featuredImage ||
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=800&fit=crop",
      publishedAt,
      siteAuthorId: author.id,
      views: 0,
      likesCount: 0,
      commentsCount: 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/author");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/comments");
  revalidatePath("/admin/analytics");
  revalidatePath(`/article/${article.slug}`);
  revalidateTag("articles");

  return NextResponse.json({ article }, { status: 201 });
}
