import Link from "next/link";
import { redirect } from "next/navigation";
import { Sidebar } from "../../components/layout/Sidebar";
import { ArticleCard } from "../../components/ui/ArticleCard";
import {
  MemoryStick as Memory,
  Gavel,
  FlaskConical as Science,
  Coffee as Lifestyle,
  BarChart3 as Monitoring,
} from "lucide-react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { getSiteUserFromCookie } from "../../lib/site-auth";
import { SiteLogoutButton } from "../../components/auth/SiteLogoutButton";
import prisma from "../../lib/prisma";
import { hasConfiguredDatabase } from "../../lib/env";
import { mapDbArticle } from "../../lib/articles";

export default async function UserSettings() {
  const user = await getSiteUserFromCookie();

  if (!user) {
    redirect("/login");
  }

  const interests = [
    { name: "Technology", desc: "AI, Gadgets, Software development", icon: Memory, checked: true },
    { name: "Politics", desc: "Global affairs, Elections, Policy", icon: Gavel, checked: false },
    { name: "Science", desc: "Space, Health, Biology", icon: Science, checked: true },
    { name: "Lifestyle", desc: "Travel, Design, Culture", icon: Lifestyle, checked: true },
    { name: "Business", desc: "Finance, Markets, Economy", icon: Monitoring, checked: false },
  ];

  const savedArticles = hasConfiguredDatabase()
    ? await prisma.articleSave.findMany({
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
              views: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 24,
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
                    <h1 className="mb-2 font-headline text-3xl font-bold sm:text-4xl">Saved Articles</h1>
                    <p className="text-on-surface-variant font-medium">
                      Signed in as {user.name} ({user.email})
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

              <section className="mb-16">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-headline text-2xl font-bold">Saved for Later</h2>
                  <span className="w-fit rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                    {savedArticles.length} ARTICLES
                  </span>
                </div>
                {savedArticles.length ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {savedArticles.map((saved) => (
                      <ArticleCard
                        key={saved.id}
                        article={mapDbArticle(saved.article)}
                        variant="horizontal"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-sm text-on-surface-variant">
                    No saved articles yet. Use the save button on any article to build your reading list.
                  </div>
                )}
              </section>

              <hr className="border-outline-variant mb-16" />

              <section>
                <div className="mb-8">
                  <h2 className="font-headline text-2xl font-bold">Interests & Personalization</h2>
                  <p className="mt-1 text-sm font-medium text-on-surface-variant">
                    Choose the topics you want to see more of in your daily feed.
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest divide-y divide-outline-variant">
                  {interests.map((interest) => {
                    const Icon = interest.icon;
                    return (
                      <div
                        key={interest.name}
                        className="flex flex-col gap-4 p-5 transition-colors hover:bg-surface-container-low sm:flex-row sm:items-center sm:justify-between sm:p-6"
                      >
                        <div className="flex items-start gap-4 sm:items-center">
                          <div className="rounded-xl bg-primary/10 p-3">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-headline text-lg font-bold">{interest.name}</h3>
                            <p className="text-sm text-on-surface-variant">{interest.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" defaultChecked={interest.checked} />
                          <div className="h-6 w-11 rounded-full bg-outline-variant peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-['']" />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
