import { unstable_noStore as noStore } from "next/cache";
import { ChevronRight } from "lucide-react";
import { FEATURED_ARTICLE, TECH_ARTICLES } from "../constants";
import { ArticleCard } from "../components/ui/ArticleCard";
import { TrendingList } from "../components/ui/TrendingList";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { FeedControls } from "../components/feed/FeedControls";
import prisma from "../lib/prisma";
import { hasConfiguredDatabase } from "../lib/env";
import { Category, type Article } from "../types";
import { categoryToSlug, mapDbArticle, normalizeCategory } from "../lib/articles";

export default async function Home(props: {
  searchParams?: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  noStore();

  const searchParams = props.searchParams ? await props.searchParams : {};
  const query = searchParams?.q?.trim() || "";
  const selectedCategory = searchParams?.category?.trim() || "";
  const sort = searchParams?.sort === "popular" ? "popular" : "latest";

  let articles: Array<{
    id: string;
    slug: string;
    title: string;
    category: string;
    author: string;
    publishedAt: Date | null;
    featuredImage: string | null;
    excerpt: string;
    views: number;
  }> = [];

  if (hasConfiguredDatabase()) {
    try {
      articles = await prisma.article.findMany({
        where: {
          status: "Published",
          ...(selectedCategory ? { category: selectedCategory } : {}),
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
    } catch (error) {
      console.warn("Prisma fetch failed, falling back to static articles", error);
      articles = [];
    }
  }

  const featuredArticle = articles.length > 0 ? mapDbArticle(articles[0]) : FEATURED_ARTICLE;
  const sectionCategory = selectedCategory || Category.Technology;
  const sectionArticles = articles
    .filter((article) => normalizeCategory(article.category) === sectionCategory)
    .slice(0, 4)
    .map<Article>(mapDbArticle);
  const latestArticles = articles.slice(1, 7);
  const popularArticles = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breaking News Header */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Breaking News</span>
          </div>

          <div className="mb-8">
            <FeedControls
              categories={Object.values(Category)}
              currentCategory={selectedCategory}
              currentQuery={query}
              currentSort={sort}
              placeholder="Search the newsroom feed..."
            />
          </div>

          <div className="newspaper-grid">
            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-9 space-y-12">
              {/* Hero Story */}
              <ArticleCard article={featuredArticle} variant="featured" className="rounded-xl" />

              {/* Technology Section */}
              <section>
                <div className="mb-6 flex items-center justify-between border-b-2 border-primary-container pb-2">
                  <h2 className="font-headline text-2xl font-bold uppercase tracking-tight">
                    {sectionCategory}
                  </h2>
                  <a
                    href={`/category/${categoryToSlug(sectionCategory)}`}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    VIEW ALL <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(sectionArticles.length ? sectionArticles : TECH_ARTICLES).map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>

              {/* Secondary Columns Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <section>
                    <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-2">
                      <h2 className="font-headline text-sm font-bold uppercase text-secondary">Latest Updates</h2>
                    </div>
                    <div className="space-y-6">
                      {(latestArticles.length ? latestArticles : articles.slice(0, 3)).map((article) => (
                        <article key={article.id} className="flex justify-between items-start border-b border-surface-container pb-4 last:border-0 group">
                          <div className="flex-1">
                            <a href={`/article/${article.slug}`} className="font-headline text-sm font-bold leading-tight group-hover:text-secondary transition-colors cursor-pointer">
                              {article.title}
                            </a>
                            <span className="text-[10px] text-on-surface-variant font-bold mt-1 block uppercase tracking-wider">
                              {article.publishedAt
                                ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Now"}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-2">
                      <h2 className="font-headline text-sm font-bold uppercase text-secondary">Popular Now</h2>
                    </div>
                     <div className="space-y-6">
                      {(popularArticles.length ? popularArticles : articles.slice(0, 3)).map((article) => (
                        <article key={article.id} className="flex justify-between items-start border-b border-surface-container pb-4 last:border-0 group">
                          <div className="flex-1">
                            <a href={`/article/${article.slug}`} className="font-headline text-sm font-bold leading-tight group-hover:text-secondary transition-colors cursor-pointer">
                              {article.title}
                            </a>
                            <span className="text-[10px] text-on-surface-variant font-bold mt-1 block uppercase tracking-wider">
                              {article.views.toLocaleString()} reads
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
              </div>

              {/* Bento Visual Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 relative h-72 rounded-xl overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1579154235884-332324962137?w=1000&h=600&fit=crop"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    alt="Science"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end">
                    <span className="mb-2 w-fit bg-white/20 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white uppercase rounded">Science</span>
                    <h3 className="font-headline text-2xl font-bold text-white">New Vaccine Trials Show Promising Results</h3>
                  </div>
                </div>
                <div className="bg-surface-container p-8 flex flex-col justify-center rounded-xl border border-outline-variant">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-3">Quick Read</span>
                  <h3 className="font-headline text-lg font-bold mb-6 leading-snug">Are Smart Cities becoming too smart for their own good?</h3>
                  <button className="bg-primary px-6 py-2 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-primary-container transition-colors rounded-sm">
                    READ ESSAY
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <TrendingList className="col-span-12 lg:col-span-3" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
