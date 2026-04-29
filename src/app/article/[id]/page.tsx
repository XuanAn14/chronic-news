import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { TrendingList } from "../../../components/ui/TrendingList";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import prisma from "../../../lib/prisma";
import { hasConfiguredDatabase } from "../../../lib/env";
import { getSiteUserFromCookie } from "../../../lib/site-auth";
import { ArticleInteractions } from "../../../components/article/ArticleInteractions";

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
          <h1 className="text-3xl font-bold mb-4">Database not configured</h1>
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
        <main className="flex-grow mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 mb-8 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            <button className="hover:text-primary">Home</button>
            <ChevronRight className="h-3 w-3" />
            <button className="hover:text-primary">{article.category}</button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-on-surface">{article.title}</span>
          </nav>

          <header className="mb-12">
            <h1 className="font-headline text-4xl lg:text-5xl font-bold leading-tight mb-8">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="font-headline font-bold text-lg">{article.author}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
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
            <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-outline-variant">
              <img
                src={article.featuredImage ?? "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=800&fit=crop"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center text-xs text-on-surface-variant mt-4 italic font-medium">
              Illustration: A superconducting quantum circuit used in recent experiments at the Zurich Institute. (Credit: Chronicle/Getty)
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="hidden lg:block lg:col-span-1">
              <ArticleInteractions
                articleId={article.id}
                initialLikes={article._count.likes}
                initialComments={article._count.comments}
                initialViews={article.views + 1}
                initialLiked={Array.isArray(article.likes) ? article.likes.length > 0 : false}
                initialCommentList={article.comments.map((comment) => ({
                  id: comment.id,
                  authorName: comment.user.name,
                  content: comment.content,
                  createdAt: comment.createdAt.toISOString(),
                }))}
                isLoggedIn={Boolean(user)}
              />
            </div>

            <article className="col-span-1 lg:col-span-7 space-y-8">
              {renderParagraphs(article.content)}

              <div className="p-8 my-10 bg-surface-container border-l-4 border-primary rounded-r-2xl shadow-sm">
                <p className="font-headline text-2xl italic font-bold leading-snug text-on-surface-variant">
                  &ldquo;{article.excerpt}&rdquo;
                </p>
                <p className="mt-4 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">— {article.author}</p>
              </div>

              <p className="text-lg leading-relaxed text-on-surface-variant">
                {article.content.split(/\n\n+/)[0]}
              </p>

              <div className="grid grid-cols-2 gap-4 my-10">
                <img src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&h=400&fit=crop" className="rounded-xl object-cover h-48 w-full border border-outline-variant" alt="Related" />
                <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop" className="rounded-xl object-cover h-48 w-full border border-outline-variant" alt="Related" />
              </div>

              <section className="mt-20 p-8 bg-surface-container-low rounded-2xl border border-outline-variant">
                <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-3xl font-bold">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-headline text-2xl font-bold mb-3">About {article.author}</h3>
                    <p className="text-on-surface-variant leading-relaxed text-sm font-medium mb-4">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </section>

              <div className="lg:hidden">
                <ArticleInteractions
                  articleId={article.id}
                  initialLikes={article._count.likes}
                  initialComments={article._count.comments}
                  initialViews={article.views + 1}
                  initialLiked={Array.isArray(article.likes) ? article.likes.length > 0 : false}
                  initialCommentList={article.comments.map((comment) => ({
                    id: comment.id,
                    authorName: comment.user.name,
                    content: comment.content,
                    createdAt: comment.createdAt.toISOString(),
                  }))}
                  isLoggedIn={Boolean(user)}
                />
              </div>
            </article>

            {/* Sidebar */}
            <TrendingList className="col-span-1 lg:col-span-4" />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
