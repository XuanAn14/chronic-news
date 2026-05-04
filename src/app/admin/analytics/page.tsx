import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "../../../lib/prisma";
import { getAdminFromCookie } from "../../../lib/auth";
import { AdminShell } from "../../../components/admin/AdminShell";

export default async function AdminAnalyticsPage() {
  const admin = await getAdminFromCookie();
  if (!admin) {
    redirect("/admin/login");
  }

  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      status: true,
      views: true,
      likesCount: true,
      commentsCount: true,
      _count: {
        select: {
          saves: true,
        },
      },
    },
    orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
    take: 100,
  });

  const totals = articles.reduce(
    (summary, article) => ({
      views: summary.views + article.views,
      likes: summary.likes + article.likesCount,
      comments: summary.comments + article.commentsCount,
      saves: summary.saves + article._count.saves,
    }),
    { views: 0, likes: 0, comments: 0, saves: 0 },
  );

  const topArticle = articles[0];

  const rightPanel = (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Total Views</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{totals.views.toLocaleString()}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Total Engagement</p>
        <p className="mt-2 text-3xl font-bold text-blue-700">
          {(totals.likes + totals.comments + totals.saves).toLocaleString()}
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Top Article</p>
        <p className="mt-2 text-sm font-semibold text-slate-900">{topArticle?.title ?? "No data"}</p>
        <p className="mt-1 text-xs text-slate-500">
          {topArticle ? `${topArticle.views.toLocaleString()} views` : "Publish articles to start tracking."}
        </p>
      </div>
    </div>
  );

  return (
    <AdminShell
      title="Analytics"
      subtitle="Track total engagement and review article-level performance across the newsroom."
      rightPanel={rightPanel}
    >
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Views</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{totals.views.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Likes</p>
          <p className="mt-3 text-3xl font-bold text-blue-700">{totals.likes.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Comments</p>
          <p className="mt-3 text-3xl font-bold text-emerald-700">{totals.comments.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Saves</p>
          <p className="mt-3 text-3xl font-bold text-amber-700">{totals.saves.toLocaleString()}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-900">Per-Article Performance</h2>
          <Link href="/admin/dashboard" className="text-sm font-semibold text-primary-container hover:underline">
            Back to posts
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Article</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Views</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Likes</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Comments</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Saves</th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="p-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Open</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">{article.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{article.author}</p>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700">{article.views.toLocaleString()}</td>
                  <td className="p-4 text-sm font-medium text-slate-700">{article.likesCount}</td>
                  <td className="p-4 text-sm font-medium text-slate-700">{article.commentsCount}</td>
                  <td className="p-4 text-sm font-medium text-slate-700">{article._count.saves}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        article.status === "Published"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/editor/${article.id}`}
                      className="text-sm font-semibold text-primary-container hover:underline"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
