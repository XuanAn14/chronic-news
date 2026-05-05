import prisma from "./prisma";
import { hasConfiguredDatabase } from "./env";

export async function getSavedArticleIdSet(userId?: string | null, articleIds?: string[]) {
  if (!userId || !hasConfiguredDatabase()) {
    return new Set<string>();
  }

  const saves = await prisma.articleSave.findMany({
    where: {
      userId,
      ...(articleIds?.length ? { articleId: { in: articleIds } } : {}),
    },
    select: {
      articleId: true,
    },
  });

  return new Set(saves.map((save) => save.articleId));
}
