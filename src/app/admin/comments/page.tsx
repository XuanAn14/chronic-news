import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "../../../lib/prisma";
import { getAdminFromCookie } from "../../../lib/auth";
import { AdminShell } from "../../../components/admin/AdminShell";

export default async function AdminCommentsPage(props: {
  searchParams?: Promise<{ articleId?: string }>;
}) {
  const admin = await getAdminFromCookie();
  if (!admin) {
    redirect("/admin/login");
  }

  const searchParams = await props.searchParams;
  const selectedArticleId = searchParams?.articleId;

  const articles = await prisma.article.findMany({
    include: {
      comments: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: [{ commentsCount: "desc" }, { updatedAt: "desc" }],
  });

  const visibleArticles = selectedArticleId
    ? articles.filter((article) => article.id === selectedArticleId)
    : articles.filter((article) => article.comments.length > 0);

  const rightPanel = (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Commented Posts</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {articles.filter((article) => article._count.comments > 0).length}
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Total Comments</p>
        <p className="mt-2 text-3xl font-bold text-blue-700">
          {articles.reduce((sum, article) => sum + article._count.comments, 0)}
        </p>
      </div>
    </div>
  );

  return (
    <AdminShell
      title="Comments"
      subtitle="Review discussion grouped by article and inspect reader responses."
      rightPanel={rightPanel}
    >
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Article
                  </th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Comments
                  </th>
                  <th className="p-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Open
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{article.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{article.author}</p>
                    </td>
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
                    <td className="p-4 text-sm font-medium text-slate-700">{article._count.comments}</td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/comments?articleId=${article.id}`}
                        className="text-sm font-semibold text-primary-container hover:underline"
                      >
                        View thread
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          {visibleArticles.length ? (
            visibleArticles.map((article) => (
              <section key={article.id} className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{article.title}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {article._count.comments} comments by readers
                      </p>
                    </div>
                    <Link
                      href={`/article/${article.slug}`}
                      className="text-sm font-semibold text-primary-container hover:underline"
                    >
                      Open live article
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-slate-200">
                  {article.comments.length ? (
                    article.comments.map((comment) => (
                      <div key={comment.id} className="px-6 py-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{comment.user.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                              {comment.user.email}
                            </p>
                          </div>
                          <p className="text-xs font-medium text-slate-500">
                            {new Date(comment.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-700">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-sm text-slate-500">No comments on this article yet.</div>
                  )}
                </div>
              </section>
            ))
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
              No article comments yet.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
