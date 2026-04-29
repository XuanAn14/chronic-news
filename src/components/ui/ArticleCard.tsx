import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import { type Article } from "../../types";
import { cn } from "../../lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "horizontal" | "vertical" | "mini" | "featured";
  className?: string;
}

export const ArticleCard = ({
  article,
  variant = "vertical",
  className,
}: ArticleCardProps) => {
  if (variant === "mini") {
    return (
      <article className={cn("group flex gap-4", className)}>
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-surface-container">
          {article.image && (
            <Image
              src={article.image}
              alt={article.title}
              width={80}
              height={80}
              unoptimized
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              sizes="80px"
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-secondary">
            {article.category}
          </span>
          <Link
            href={`/article/${article.id}`}
            className="font-headline text-sm font-semibold leading-tight group-hover:text-primary"
          >
            {article.title}
          </Link>
        </div>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article
        className={cn(
          "group flex flex-col gap-4 rounded-xl border border-outline-variant p-4 transition-all hover:shadow-md sm:flex-row sm:gap-6",
          className,
        )}
      >
        <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-lg bg-surface-container sm:h-32 sm:w-32">
          <Image
            src={article.image}
            alt={article.title}
            fill
            unoptimized
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 128px"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-secondary">
              {article.category}
            </span>
            <Link
              href={`/article/${article.id}`}
              className="font-headline text-lg font-bold leading-tight group-hover:text-primary"
            >
              {article.title}
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs text-on-surface-variant">
              {article.date} {" · "} {article.readTime}
            </span>
            <button className="text-outline transition-colors hover:text-primary">
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "featured") {
    return (
      <article className={cn("group relative aspect-[16/9] w-full overflow-hidden", className)}>
        <Image
          src={article.image}
          alt={article.title}
          fill
          unoptimized
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 960px"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 sm:p-8">
          <span className="mb-3 w-fit bg-primary px-3 py-1 text-xs font-bold uppercase text-white">
            {article.category}
          </span>
          <Link
            href={`/article/${article.id}`}
            className="font-headline text-2xl font-bold leading-tight text-white hover:underline md:text-4xl lg:text-5xl"
          >
            {article.title}
          </Link>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/80 sm:mt-6 sm:flex-row sm:items-center sm:gap-6">
            <span>
              By {article.author.name} {" · "} {article.date}
            </span>
            <button className="flex items-center gap-2 hover:text-white">
              <Bookmark className="h-4 w-4" />
              <span className="font-semibold">Read Later</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group border border-outline-variant p-4 transition-all hover:shadow-sm", className)}>
      <div className="relative mb-4 aspect-video overflow-hidden bg-surface-container">
        <Image
          src={article.image}
          alt={article.title}
          fill
          unoptimized
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
        {article.category}
      </span>
      <Link
        href={`/article/${article.id}`}
        className="mb-2 block font-headline text-xl font-bold leading-tight group-hover:text-primary"
      >
        {article.title}
      </Link>
      <p className="mb-4 line-clamp-2 text-sm text-on-surface-variant">{article.snippet}</p>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-on-surface-variant underline underline-offset-4 decoration-outline-variant">
          {article.date}
        </span>
        <button className="text-outline transition-colors hover:text-primary">
          <Bookmark className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};
