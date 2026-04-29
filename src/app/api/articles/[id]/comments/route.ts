import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "../../../../../lib/prisma";
import { getSiteUserFromCookie } from "../../../../../lib/site-auth";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSiteUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
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
