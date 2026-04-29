import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";
import { getAuthorFromCookie } from "../../../../lib/site-auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 200);
}

async function generateUniqueSlug(title: string) {
  const baseSlug = slugify(title) || "article";
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

  const slug = await generateUniqueSlug(title);
  const publishedAt = status === "Published" ? new Date() : null;

  const article = await prisma.article.create({
    data: {
      title,
      slug,
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
  revalidatePath(`/article/${article.slug}`);

  return NextResponse.json({ article }, { status: 201 });
}
