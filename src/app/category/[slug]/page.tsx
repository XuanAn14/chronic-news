import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import prisma from "../../../lib/prisma";
import { hasConfiguredDatabase } from "../../../lib/env";
import { categoryToSlug, mapDbArticle, slugToCategory } from "../../../lib/articles";
import { FeedControls } from "../../../components/feed/FeedControls";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import { ArticleCard } from "../../../components/ui/ArticleCard";
import { Category } from "../../../types";

export const revalidate = 60;

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ q?: string; sort?: string }>;
}) {
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const category = slugToCategory(params.slug);
  const query = searchParams?.q?.trim() || "";
  const sort = searchParams?.sort === "popular" ? "popular" : "latest";

  if (!category) {
    notFound();
  }

  if (!hasConfiguredDatabase()) {
    return notFound();
  }

  const articles = await prisma.article.findMany({
    where: {
      status: "Published",
      category,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { excerpt: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
              { author: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy:
      sort === "popular"
        ? [{ views: "desc" }, { publishedAt: "desc" }]
        : [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 20,
  });

  if (!articles.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-10">
          <div className="rounded-2xl border border-outline-variant bg-white p-10 text-center">
            <h1 className="font-headline text-4xl font-bold text-on-surface">{category}</h1>
            <p className="mt-4 text-on-surface-variant">
              No published articles in this category yet.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hero = articles[0];
  const secondary = articles.slice(1, 4);
  const latest = articles.slice(4, 10);
  const trending = [...articles].sort((a, b) => b.views - a.views).slice(0, 4);

  const otherCategoryCounts = await prisma.article.groupBy({
    by: ["category"],
    where: {
      status: "Published",
      category: {
        not: category,
      },
    },
    _count: {
      category: true,
    },
    orderBy: {
      _count: {
        category: "desc",
      },
    },
    take: 4,
  });

  const relatedDesks = otherCategoryCounts.map((item) => item.category);
  const crossDeskStories = relatedDesks.length
    ? await prisma.article.findMany({
        where: {
          status: "Published",
          category: {
            in: relatedDesks,
          },
        },
        orderBy: [{ publishedAt: "desc" }, { views: "desc" }],
        take: 3,
      })
    : [];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="mx-auto max-w-[1280px] px-4 py-6">
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-bold text-primary">{category}</span>
        </nav>

        <div className="mb-8">
          <FeedControls
            categories={Object.values(Category)}
            currentCategory={category}
            currentQuery={query}
            currentSort={sort}
            lockCategory
            placeholder={`Search ${category.toLowerCase()} coverage...`}
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-9">
            <section className="group overflow-hidden border border-outline-variant bg-white shadow-sm transition-all hover:shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-[300px] overflow-hidden md:h-[480px]">
                  <Image
                    src={
                      hero.featuredImage ||
                      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop"
                    }
                    alt={hero.title}
                    fill
                    unoptimized
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute left-4 top-4">
                    <span className="rounded-sm bg-primary-container px-3 py-1 text-xs font-semibold uppercase tracking-widest text-on-primary-container">
                      Breaking News
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6">
                  <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">
                    {hero.category} {" · "}{" "}
                    {hero.publishedAt
                      ? new Date(hero.publishedAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Now"}
                  </span>
                  <h1 className="font-headline text-4xl font-bold leading-tight text-on-surface">
                    {hero.title}
                  </h1>
                  <p className="mb-6 mt-4 text-lg leading-8 text-on-surface-variant">
                    {hero.excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/article/${hero.slug}`}
                      className="bg-primary-container px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-on-primary-container transition-all hover:brightness-110"
                    >
                      Read Full Story
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {secondary.map((article) => {
                const mapped = mapDbArticle(article);
                return (
                  <article
                    key={article.id}
                    className="border border-outline-variant bg-white transition-all hover:border-primary"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={mapped.image}
                        alt={article.title}
                        fill
                        unoptimized
                        className="h-full w-full object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                        {article.category}
                      </span>
                      <Link
                        href={`/article/${article.slug}`}
                        className="mt-2 block font-headline text-lg font-semibold leading-tight hover:text-primary"
                      >
                        {article.title}
                      </Link>
                      <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">
                        {article.excerpt}
                      </p>
                    </div>
                  </article>
                );
              })}
            </section>

            <section>
              <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-2">
                <h2 className="font-headline text-2xl font-semibold uppercase tracking-tight text-on-surface">
                  Latest Updates
                </h2>
                <Link
                  href={`/category/${categoryToSlug(category)}`}
                  className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
                >
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-6">
                {(latest.length ? latest : articles.slice(1)).map((article) => (
                  <div key={article.id} className="group flex gap-4">
                    <span className="w-16 shrink-0 text-2xl font-bold text-secondary">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                        : "Now"}
                    </span>
                    <div className="flex-1 border-b border-surface-container pb-6">
                      <Link
                        href={`/article/${article.slug}`}
                        className="mb-1 block font-headline text-lg font-semibold transition-colors group-hover:text-primary"
                      >
                        {article.title}
                      </Link>
                      <p className="text-base text-on-surface-variant">{article.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="col-span-12 space-y-8 lg:col-span-3">
            <div className="border border-outline-variant bg-surface-container-low p-6">
              <h2 className="mb-6 inline-block border-b-2 border-secondary font-headline text-lg font-semibold text-on-surface">
                Trending in {category}
              </h2>
              <ul className="space-y-6">
                {trending.map((article, index) => (
                  <li key={article.id} className="flex gap-4">
                    <span className="font-headline text-3xl font-bold text-outline-variant opacity-50">
                      0{index + 1}
                    </span>
                    <div>
                      <Link
                        href={`/article/${article.slug}`}
                        className="mb-1 block font-headline text-base font-semibold leading-tight transition-colors hover:text-primary"
                      >
                        {article.title}
                      </Link>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                        {article.views.toLocaleString()} Reads
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {crossDeskStories.length ? (
              <div className="space-y-4">
                <div className="border border-outline-variant bg-white p-6">
                  <h3 className="font-headline text-lg font-semibold">Across Other Desks</h3>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Fresh stories from related categories readers are also following.
                  </p>
                </div>
                {crossDeskStories.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={mapDbArticle(article)}
                    variant="mini"
                    className="rounded-xl border border-outline-variant bg-white p-4"
                  />
                ))}
              </div>
            ) : null}

            {relatedDesks.length ? (
              <div className="border border-outline-variant p-6">
                <h3 className="font-headline text-lg font-semibold">Explore More Categories</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedDesks.map((item) => (
                    <Link
                      key={item}
                      href={`/category/${categoryToSlug(item)}`}
                      className="rounded-sm bg-surface-container-high px-3 py-1 text-xs font-semibold transition-all hover:bg-primary hover:text-white"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
