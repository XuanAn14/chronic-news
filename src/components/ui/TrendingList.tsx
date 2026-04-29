import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { getTrendingArticlesCached } from "../../lib/content-cache";

export const TrendingList = async ({ className }: { className?: string }) => {
  const trendingArticles = (await getTrendingArticlesCached(3)).map((article) => ({
    id: article.slug,
    title: article.title,
    views: article.views?.toLocaleString() ?? "0",
  }));

  if (!trendingArticles.length) {
    return null;
  }

  return (
    <aside className={cn("space-y-12", className)}>
      <div className="border border-outline-variant bg-surface-container-lowest p-6 rounded-xl">
        <h2 className="mb-6 flex items-center gap-2 font-headline text-lg font-bold">
          <TrendingUp className="h-5 w-5 text-secondary" />
          Trending Now
        </h2>
        <ul className="space-y-6">
          {trendingArticles.map((article, index) => (
            <li key={article.id} className="group border-t border-outline-variant first:border-t-0 pt-6 first:pt-0">
              <Link href={`/article/${article.id}`} className="flex items-start gap-4">
                <span className="font-headline text-3xl italic text-surface-container-highest group-hover:text-secondary transition-colors">
                  0{index + 1}
                </span>
                <div>
                  <h4 className="font-headline text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <span className="mt-1 block text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                    {article.views} views
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
