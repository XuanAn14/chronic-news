import Link from "next/link";
import { redirect } from "next/navigation";
import { Sidebar } from "../../components/layout/Sidebar";
import { ArticleCard } from "../../components/ui/ArticleCard";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { getSiteUserFromCookie } from "../../lib/site-auth";
import { SiteLogoutButton } from "../../components/auth/SiteLogoutButton";
import prisma from "../../lib/prisma";
import { hasConfiguredDatabase } from "../../lib/env";
import { mapDbArticle } from "../../lib/articles";

export default async function ReadingHistoryPage() {
  const user = await getSiteUserFromCookie();

  if (!user) {
    redirect("/login");
  }

  const readingHistory = hasConfiguredDatabase()
    ? await prisma.articleViewHistory.findMany({
        where: {
          userId: user.id,
        },
        include: {
          article: {
            select: {
              slug: true,
              title: true,
              category: true,
              author: true,
              publishedAt: true,
              featuredImage: true,
              excerpt: true,
              content: true,
              views: true,
            },
          },
        },
        orderBy: {
          viewedAt: "desc",
        },
      })
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <Sidebar variant="account" />
            <div className="min-w-0 flex-1">
              <header className="mb-12">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="mb-2 font-headline text-3xl font-bold sm:text-4xl">Reading History</h1>
                    <p className="text-on-surface-variant font-medium">
                      Recently opened articles for {user.name}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {user.role === "AUTHOR" ? (
                      <Link
                        href="/author"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-container"
                      >
                        Author Studio
                      </Link>
                    ) : null}
                    <SiteLogoutButton />
                  </div>
                </div>
              </header>

              <section>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-headline text-2xl font-bold">Recently Read</h2>
                  <span className="w-fit rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                    {readingHistory.length} ARTICLES
                  </span>
                </div>
                {readingHistory.length ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {readingHistory.map((entry) => (
                      <div key={entry.id} className="space-y-2">
                        <ArticleCard article={mapDbArticle(entry.article)} variant="horizontal" />
                        <p className="px-1 text-xs font-medium text-on-surface-variant">
                          Opened{" "}
                          {new Date(entry.viewedAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-sm text-on-surface-variant">
                    No reading history yet. Open an article while signed in and it will appear here.
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
