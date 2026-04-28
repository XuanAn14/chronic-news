import { ChevronRight } from "lucide-react";
import { FEATURED_ARTICLE, TECH_ARTICLES } from "../constants";
import { ArticleCard } from "../components/ui/ArticleCard";
import { TrendingList } from "../components/ui/TrendingList";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import prisma from "../lib/prisma";
import { hasConfiguredDatabase } from "../lib/env";
import { Category, type Article } from "../types";

function normalizeCategory(value: string): Category {
  return Object.values(Category).includes(value as Category)
    ? (value as Category)
    : Category.Technology;
}

function mapDbArticle(article: {
  slug: string;
  title: string;
  category: string;
  author: string;
  publishedAt: Date | null;
  featuredImage: string | null;
  excerpt: string;
}): Article {
  return {
    id: article.slug,
    title: article.title,
    category: normalizeCategory(article.category),
    author: {
      name: article.author,
      role: "Editorial Desk",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    date: article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Now",
    image:
      article.featuredImage ||
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop",
    snippet: article.excerpt,
  };
}

export default async function Home() {
  let articles: Array<{
    slug: string;
    title: string;
    category: string;
    author: string;
    publishedAt: Date | null;
    featuredImage: string | null;
    excerpt: string;
  }> = [];

  if (hasConfiguredDatabase()) {
    try {
      articles = await prisma.article.findMany({
        where: { status: "Published" },
        orderBy: { publishedAt: "desc" },
      });
    } catch (error) {
      console.warn("Prisma fetch failed, falling back to static articles", error);
      articles = [];
    }
  }

  const featuredArticle = articles.length > 0 ? mapDbArticle(articles[0]) : FEATURED_ARTICLE;
  const techArticles = articles
    .filter((article) => normalizeCategory(article.category) === Category.Technology)
    .slice(0, 4)
    .map<Article>(mapDbArticle);

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

          <div className="newspaper-grid">
            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-9 space-y-12">
              {/* Hero Story */}
              <ArticleCard article={featuredArticle} variant="featured" className="rounded-xl" />

              {/* Technology Section */}
              <section>
                <div className="mb-6 flex items-center justify-between border-b-2 border-primary-container pb-2">
                  <h2 className="font-headline text-2xl font-bold uppercase tracking-tight">Technology</h2>
                  <button className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                    VIEW ALL <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(techArticles.length ? techArticles : TECH_ARTICLES).map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>

              {/* Secondary Columns Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <section>
                    <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-2">
                      <h2 className="font-headline text-sm font-bold uppercase text-secondary">Politics</h2>
                    </div>
                    <div className="space-y-6">
                      {[1, 2, 3].map(i => (
                        <article key={i} className="flex justify-between items-start border-b border-surface-container pb-4 last:border-0 group">
                          <div className="flex-1">
                            <h4 className="font-headline text-sm font-bold leading-tight group-hover:text-secondary transition-colors cursor-pointer">
                              {i === 1 && "Policy Shift: New Environmental Regulations Proposed"}
                              {i === 2 && "Voter Sentiment Peaks Ahead of Regional Elections"}
                              {i === 3 && "Urban Infrastructure: The Debate Over Public Transit Funding"}
                            </h4>
                            <span className="text-[10px] text-on-surface-variant font-bold mt-1 block uppercase tracking-wider">{i * 3}h ago</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-2">
                      <h2 className="font-headline text-sm font-bold uppercase text-secondary">Lifestyle</h2>
                    </div>
                     <div className="space-y-6">
                      {[1, 2, 3].map(i => (
                        <article key={i} className="flex justify-between items-start border-b border-surface-container pb-4 last:border-0 group">
                          <div className="flex-1">
                            <h4 className="font-headline text-sm font-bold leading-tight group-hover:text-secondary transition-colors cursor-pointer">
                              {i === 1 && "Sustainable Fashion: Why Less is More this Season"}
                              {i === 2 && "Minimalist Architecture: Designing for Mental Peace"}
                              {i === 3 && "Culinary Journeys: The Rise of Plant-Based Fine Dining"}
                            </h4>
                            <span className="text-[10px] text-on-surface-variant font-bold mt-1 block uppercase tracking-wider">{i * 2}h ago</span>
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
