import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma";
import { getAuthorFromCookie } from "../../lib/site-auth";
import { AuthorShell } from "../../components/author/AuthorShell";
import { AuthorDeleteButton } from "../../components/author/AuthorDeleteButton";

export default async function AuthorPage() {
  noStore();

  const author = await getAuthorFromCookie();
  if (!author) {
    redirect("/login");
  }

  const articles = await prisma.article.findMany({
    where: {
      siteAuthorId: author.id,
    },
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const totalReads = articles.reduce((sum, article) => sum + article.views, 0);
  const totalLikes = articles.reduce((sum, article) => sum + article._count.likes, 0);
  const totalComments = articles.reduce((sum, article) => sum + article._count.comments, 0);
  const totalWords = articles.reduce(
    (sum, article) => sum + article.content.split(/\s+/).filter(Boolean).length,
    0,
  );
  const avgReadMinutes = articles.length ? Math.max(1, Math.round(totalWords / articles.length / 220)) : 0;
  const avgReadSeconds = articles.length
    ? Math.round(((totalWords / Math.max(1, articles.length)) % 220) / 220 * 60)
    : 0;
  const avgReadTime = `${avgReadMinutes}m ${avgReadSeconds.toString().padStart(2, "0")}s`;
  const topArticle = [...articles].sort((a, b) => b.views - a.views)[0];

  return (
    <AuthorShell
      authorName={author.name}
      title={`Welcome back, ${author.name}`}
      subtitle="Here's what's happening with your news beat today."
    >
      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-outline-variant bg-white p-4">
          <div className="mb-2 flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">
              Total Reads
            </span>
            <span className="text-xs font-bold text-green-600">
              {articles.length ? `${articles.filter((item) => item.status === "Published").length} live` : "0 live"}
            </span>
          </div>
          <div className="text-3xl font-bold">{totalReads.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-outline-variant bg-white p-4">
          <div className="mb-2 flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">
              Avg Read Time
            </span>
          </div>
          <div className="text-3xl font-bold">{avgReadTime}</div>
        </div>
        <div className="rounded-lg border border-outline-variant bg-white p-4">
          <div className="mb-2 flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">
              Likes
            </span>
          </div>
          <div className="text-3xl font-bold">{totalLikes.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-outline-variant bg-white p-4">
          <div className="mb-2 flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">
              Comments
            </span>
          </div>
          <div className="text-3xl font-bold">{totalComments.toLocaleString()}</div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 space-y-4 lg:col-span-8">
          <div className="overflow-hidden rounded-lg border border-outline-variant bg-white">
            <div className="flex items-center justify-between border-b border-outline-variant bg-gray-50/50 p-4">
              <h3 className="font-headline text-lg font-semibold">Recent Articles</h3>
              <Link href="/author/editor" className="text-sm font-semibold text-primary hover:underline">
                New Article
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-outline-variant bg-white text-xs font-semibold text-tertiary">
                  <tr>
                    <th className="px-4 py-3">TITLE</th>
                    <th className="px-4 py-3 text-center">STATUS</th>
                    <th className="px-4 py-3 text-right">VIEWS</th>
                    <th className="px-4 py-3 text-right">ENGAGEMENT</th>
                    <th className="px-4 py-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {articles.map((article) => (
                    <tr key={article.id} className="transition-colors hover:bg-surface-container-low">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={article.featuredImage ?? "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=800&fit=crop"}
                            alt={article.title}
                            className="h-10 w-16 rounded object-cover"
                          />
                          <span className="line-clamp-1 font-medium text-on-surface">{article.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`rounded-sm px-2 py-1 text-xs ${
                            article.status === "Published"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-medium">{article.views.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-3 text-sm text-tertiary">
                          <span>{article._count.comments} comments</span>
                          <span>{article._count.likes} likes</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/author/editor/${article.id}`}
                            className="text-xs font-semibold text-primary transition hover:underline"
                          >
                            Edit
                          </Link>
                          <AuthorDeleteButton articleId={article.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!articles.length ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                        No articles yet. Publish your first story from the author studio.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-blue-600 p-6 text-white shadow-lg">
            <div className="relative z-10">
              <h3 className="font-headline text-2xl font-semibold">Have a lead?</h3>
              <p className="mb-4 mt-2 text-blue-100">
                Start a new draft and continue publishing under your own author account.
              </p>
              <Link
                href="/author/editor"
                className="inline-flex rounded-lg bg-white px-4 py-2 font-bold text-primary"
              >
                Draft New Story
              </Link>
            </div>
          </div>
        </div>

        <div className="col-span-12 space-y-4 lg:col-span-4">
          <div className="rounded-lg border border-outline-variant bg-white">
            <div className="flex items-center justify-between border-b border-outline-variant p-4">
              <h3 className="font-headline text-lg font-semibold">Engagement Snapshot</h3>
              <span className="rounded bg-secondary-fixed px-2 py-0.5 text-[10px] font-bold uppercase">
                Live
              </span>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <p className="text-sm font-bold text-on-surface">Most viewed article</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {topArticle?.title ?? "No published article yet"}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Total engagement</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {(totalLikes + totalComments).toLocaleString()} reactions and comments
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4">
            <h3 className="font-headline text-lg font-semibold text-on-surface">Author Tip</h3>
            <p className="mt-3 text-sm text-on-surface-variant">
              Articles with clear excerpts and a strong cover image tend to keep higher read
              depth. Publish with a finished summary instead of leaving draft placeholders.
            </p>
          </div>
        </div>
      </div>
    </AuthorShell>
  );
}
