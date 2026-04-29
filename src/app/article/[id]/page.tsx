import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TrendingList } from "../../../components/ui/TrendingList";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import prisma from "../../../lib/prisma";
import { hasConfiguredDatabase } from "../../../lib/env";
import { getSiteUserFromCookie } from "../../../lib/site-auth";
import { ArticleInteractions } from "../../../components/article/ArticleInteractions";
import { mapDbArticle } from "../../../lib/articles";
import { ArticleCard } from "../../../components/ui/ArticleCard";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  if (!hasConfiguredDatabase()) {
    return {};
  }

  const article = await prisma.article.findUnique({
    where: { slug: params.id },
    select: {
      title: true,
      excerpt: true,
      metaTitle: true,
      metaDescription: true,
    },
  });

  if (!article) {
    return {};
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
  };
}

function renderParagraphs(content: string) {
  return content.split(/\n\n+/).map((paragraph, index) => (
    <p key={index} className="text-lg leading-relaxed text-on-surface-variant">
      {paragraph}
    </p>
  ));
}

export default async function ArticleDetail(props: { params: Promise<{ id: string }> }) {
  noStore();

  const params = await props.params;

  if (!hasConfiguredDatabase()) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl rounded-3xl border border-outline-variant bg-surface-container p-12 text-center shadow-lg">
          <h1 className="mb-4 text-3xl font-bold">Database not configured</h1>
          <p className="text-sm text-on-surface-variant">
            Set up a valid `DATABASE_URL` in your environment to view article detail pages.
          </p>
        </div>
      </div>
    );
  }

  const user = await getSiteUserFromCookie();

  const article = await prisma.article.findUnique({
    where: {
      slug: params.id,
    },
    include: {
      likes: user
        ? {
            where: {
              userId: user.id,
            },
            select: {
              id: true,
            },
          }
        : false,
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      saves: user
        ? {
            where: {
              userId: user.id,
            },
            select: {
              id: true,
            },
          }
        : false,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  if (!article || article.status !== "Published") {
    return notFound();
  }

  let relatedArticles = await prisma.article.findMany({
    where: {
      status: "Published",
      id: {
        not: article.id,
      },
      category: article.category,
    },
    orderBy: [{ publishedAt: "desc" }, { views: "desc" }],
    take: 3,
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
  });

  if (relatedArticles.length < 3) {
    const fallbackArticles = await prisma.article.findMany({
      where: {
        status: "Published",
        id: {
          not: article.id,
        },
        slug: {
          notIn: relatedArticles.map((item) => item.slug),
        },
      },
      orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
      take: 3 - relatedArticles.length,
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
    });

    relatedArticles = [...relatedArticles, ...fallbackArticles];
  }

  await prisma.article.update({
    where: { id: article.id },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="relative">
        <main className="mx-auto flex-grow max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/category/${article.category.toLowerCase()}`} className="hover:text-primary">
              {article.category}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="line-clamp-1 text-on-surface">{article.title}</span>
          </nav>

          <header className="mb-12">
            <h1 className="mb-8 font-headline text-4xl font-bold leading-tight lg:text-5xl">
              {article.title}
            </h1>
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="font-headline text-lg font-bold">{article.author}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Draft"}
                </p>
              </div>
            </div>
            <div className="aspect-[21/9] overflow-hidden rounded-2xl border border-outline-variant shadow-2xl">
              <img
                src={
                  article.featuredImage ??
                  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=800&fit=crop"
                }
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <article className="col-span-1 space-y-8 lg:col-span-8">
              {renderParagraphs(article.content)}

              <div className="my-10 rounded-r-2xl border-l-4 border-primary bg-surface-container p-8 shadow-sm">
                <p className="font-headline text-2xl italic font-bold leading-snug text-on-surface-variant">
                  &ldquo;{article.excerpt}&rdquo;
                </p>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  {article.author}
                </p>
              </div>

              <ArticleInteractions
                articleId={article.id}
                initialLikes={article._count.likes}
                initialComments={article._count.comments}
                initialViews={article.views + 1}
                initialLiked={Array.isArray(article.likes) ? article.likes.length > 0 : false}
                initialSaved={Array.isArray(article.saves) ? article.saves.length > 0 : false}
                initialCommentList={article.comments.map((comment) => ({
                  id: comment.id,
                  authorName: comment.user.name,
                  content: comment.content,
                  createdAt: comment.createdAt.toISOString(),
                }))}
                isLoggedIn={Boolean(user)}
              />

              <section className="rounded-2xl border border-outline-variant bg-surface-container-low p-8">
                <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:text-left">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-3xl font-bold text-slate-700">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <h3 className="mb-3 font-headline text-2xl font-bold">About {article.author}</h3>
                    <p className="mb-4 text-sm font-medium leading-relaxed text-on-surface-variant">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </section>

              {relatedArticles.length ? (
                <section className="space-y-6">
                  <div className="flex flex-col gap-3 border-b border-outline-variant pb-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-headline text-2xl font-bold">Related Articles</h2>
                    <Link
                      href={`/category/${article.category.toLowerCase()}`}
                      className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                    >
                      More in {article.category}
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {relatedArticles.map((relatedArticle) => (
                      <ArticleCard
                        key={relatedArticle.slug}
                        article={mapDbArticle(relatedArticle)}
                        className="rounded-xl bg-white"
                      />
                    ))}
                  </div>
                </section>
              ) : null}
            </article>

            <div className="col-span-1 lg:col-span-4">
              <TrendingList />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
