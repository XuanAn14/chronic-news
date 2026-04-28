import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, PlusCircle } from "lucide-react";
import prisma from "../../../lib/prisma";
import { getAdminFromCookie } from "../../../lib/auth";
import { AdminShell } from "../../../components/admin/AdminShell";

export default async function AdminDashboardPage() {
  const admin = await getAdminFromCookie();
  if (!admin) {
    redirect("/admin/login");
  }

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  const publishedCount = articles.filter((item) => item.status === "Published").length;
  const draftCount = articles.filter((item) => item.status === "Draft").length;

  const rightPanel = (
    <div className="space-y-8">
      <div className="space-y-3">
        <Link
          href="/admin/editor"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Post</span>
        </Link>
      </div>

      <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold text-slate-900">Publishing</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Published</span>
          <span className="rounded border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
            {publishedCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Drafts</span>
          <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
            {draftCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Admin user</span>
          <span className="text-xs font-semibold text-primary-container">{admin.email}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold text-slate-900">Latest Post</h3>
        <div className="rounded border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            {articles[0]?.title ?? "No articles yet"}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {articles[0]
              ? new Date(articles[0].createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Start by creating your first post."}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <AdminShell
      title="Posts"
      subtitle="Review article status, publication flow, and recent editorial output."
      rightPanel={rightPanel}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Total Posts
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{articles.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Published
          </p>
          <p className="mt-3 text-3xl font-bold text-green-700">{publishedCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Drafts
          </p>
          <p className="mt-3 text-3xl font-bold text-amber-700">{draftCount}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="font-headline text-xl font-bold text-slate-900">Recent Posts</h2>
          <Link
            href="/admin/editor"
            className="text-sm font-semibold text-primary-container hover:underline"
          >
            New Post
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Title
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Category
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Author
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.length ? (
                articles.map((article) => (
                  <tr key={article.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{article.title}</div>
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                        {article.category}
                      </span>
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
                    <td className="p-4 text-sm text-slate-500">{article.author}</td>
                    <td className="p-4 text-sm text-slate-500">
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-sm text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="h-8 w-8 text-slate-300" />
                      <p>No posts yet. Create the first one from the editor.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
