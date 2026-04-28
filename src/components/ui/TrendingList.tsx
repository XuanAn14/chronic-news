import React from "react";
import Link from "next/link";
import { TrendingUp, Mail } from "lucide-react";
import { TRENDING_ARTICLES } from "../../constants";
import { cn } from "../../lib/utils";

export const TrendingList = ({ className }: { className?: string }) => {
  return (
    <aside className={cn("space-y-12", className)}>
      <div className="border border-outline-variant bg-surface-container-lowest p-6 rounded-xl">
        <h2 className="mb-6 flex items-center gap-2 font-headline text-lg font-bold">
          <TrendingUp className="h-5 w-5 text-secondary" />
          Trending Now
        </h2>
        <ul className="space-y-6">
          {TRENDING_ARTICLES.map((article, index) => (
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

      <div className="bg-primary-container p-8 rounded-2xl text-white shadow-xl">
        <Mail className="h-8 w-8 mb-4 opacity-80" />
        <h3 className="font-headline text-xl mb-2 font-bold uppercase tracking-tight">The Daily Brief</h3>
        <p className="text-sm text-white/80 mb-6 font-medium">
          Stay informed. Get our morning editorial newsletter delivered to your inbox.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email address"
            className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm focus:ring-2 focus:ring-white outline-none rounded-lg placeholder:text-white/50"
          />
          <button className="w-full bg-white text-primary font-bold text-sm py-3 rounded-lg hover:bg-surface transition-colors tracking-widest">
            SUBSCRIBE
          </button>
        </div>
      </div>
    </aside>
  );
};
