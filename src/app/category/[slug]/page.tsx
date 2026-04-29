import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { ArrowRight, ChevronRight, Mail, Search } from "lucide-react";
import prisma from "../../../lib/prisma";
import { hasConfiguredDatabase } from "../../../lib/env";
import { categoryToSlug, mapDbArticle, slugToCategory } from "../../../lib/articles";
import { FeedControls } from "../../../components/feed/FeedControls";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import { Category } from "../../../types";

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ q?: string; sort?: string }>;
}) {
  noStore();

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
                  <img
                    src={hero.featuredImage || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop"}
                    alt={hero.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4">
                    <span className="rounded-sm bg-primary-container px-3 py-1 text-xs font-semibold uppercase tracking-widest text-on-primary-container">
                      Breaking News
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6">
                  <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">
                    {hero.category} •{" "}
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
                    <button className="flex items-center gap-2 border border-outline px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all hover:bg-surface-container">
                      Save for Later
                    </button>
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
                    <div className="h-48 overflow-hidden">
                      <img
                        src={mapped.image}
                        alt={article.title}
                        className="h-full w-full object-cover"
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

            <div className="bg-primary-container p-6 text-on-primary-container">
              <Mail className="mb-2 h-8 w-8" />
              <h3 className="font-headline text-lg font-semibold">The {category} Briefing</h3>
              <p className="mb-4 mt-2 text-sm opacity-90">
                New stories from the {category.toLowerCase()} desk, delivered as soon as they publish.
              </p>
              <input
                type="email"
                placeholder="Your email address"
                className="mb-3 w-full rounded-sm border-none bg-white px-4 py-2 text-sm text-on-surface focus:ring-2 focus:ring-white/50"
              />
              <button className="w-full bg-on-background py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-black">
                Subscribe Now
              </button>
            </div>

            <div className="border border-outline-variant p-6">
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-on-surface-variant" />
                <h3 className="font-headline text-lg font-semibold">Explore Regions</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["World", "Politics", "Technology", "Science", "Business", "Lifestyle"].map((item) => (
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
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
