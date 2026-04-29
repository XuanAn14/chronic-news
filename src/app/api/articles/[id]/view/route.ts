import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const article = await prisma.article.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
    select: {
      views: true,
    },
  });

  return NextResponse.json({
    viewsCount: article.views,
  });
}
