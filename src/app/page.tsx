import { ChevronRight } from "lucide-react";
import { ArticleCard } from "../components/ui/ArticleCard";
import { TrendingList } from "../components/ui/TrendingList";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { FeedControls } from "../components/feed/FeedControls";
import { Category, type Article } from "../types";
import { categoryToSlug, mapDbArticle, normalizeCategory } from "../lib/articles";
import { getHomeArticlesCached } from "../lib/content-cache";
import { PrefetchLink } from "../components/routing/PrefetchLink";

export const revalidate = 60;

export default async function Home(props: {
  searchParams?: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const query = searchParams?.q?.trim() || "";
  const selectedCategory = searchParams?.category?.trim() || "";
  const sort = searchParams?.sort === "popular" ? "popular" : "latest";

  const articles = await getHomeArticlesCached(query, selectedCategory, sort, 20);

  const featuredArticle = articles.length > 0 ? mapDbArticle(articles[0]) : null;
  const categoryCountMap = new Map<Category, number>();
  const articleGroups = new Map<Category, typeof articles>();

  articles.forEach((article) => {
    const normalizedCategory = normalizeCategory(article.category);
    categoryCountMap.set(normalizedCategory, (categoryCountMap.get(normalizedCategory) ?? 0) + 1);
    articleGroups.set(normalizedCategory, [...(articleGroups.get(normalizedCategory) ?? []), article]);
  });

  const prominentCategories = (
    selectedCategory
      ? [normalizeCategory(selectedCategory)]
      : [...categoryCountMap.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([category]) => category)
  ).filter((category, index, array) => array.indexOf(category) === index);

  const latestArticles = articles.slice(1, 7);
  const popularArticles = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);
  const moreStories = articles.slice(7, 13);

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
              {featuredArticle ? (
                <ArticleCard article={featuredArticle} variant="featured" className="rounded-xl" />
              ) : null}

              {prominentCategories.map((sectionCategory) => {
                const sectionArticles = (articleGroups.get(sectionCategory) ?? [])
                  .slice(0, 4)
                  .map<Article>(mapDbArticle);

                if (!sectionArticles.length) {
                  return null;
                }

                return (
                  <section key={sectionCategory}>
                    <div className="mb-6 flex items-center justify-between border-b-2 border-primary-container pb-2">
                      <h2 className="font-headline text-2xl font-bold uppercase tracking-tight">
                        {sectionCategory}
                      </h2>
                      <PrefetchLink
                        href={`/category/${categoryToSlug(sectionCategory)}`}
                        className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        VIEW ALL <ChevronRight className="h-4 w-4" />
                      </PrefetchLink>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {sectionArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </section>
                );
              })}

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
                            <PrefetchLink href={`/article/${article.slug}`} className="font-headline text-sm font-bold leading-tight transition-colors group-hover:text-secondary">
                              {article.title}
                            </PrefetchLink>
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
                            <PrefetchLink href={`/article/${article.slug}`} className="font-headline text-sm font-bold leading-tight transition-colors group-hover:text-secondary">
                              {article.title}
                            </PrefetchLink>
                            <span className="text-[10px] text-on-surface-variant font-bold mt-1 block uppercase tracking-wider">
                              {article.views.toLocaleString()} reads
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
              </div>

              {moreStories.length ? (
                <section>
                  <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-2">
                    <h2 className="font-headline text-sm font-bold uppercase text-secondary">More From The Wire</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {moreStories.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={mapDbArticle(article)}
                        className="rounded-xl bg-white"
                      />
                    ))}
                  </div>
                </section>
              ) : null}
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
