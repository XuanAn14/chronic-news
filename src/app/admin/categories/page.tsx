import { redirect } from "next/navigation";
import prisma from "../../../lib/prisma";
import { getAdminFromCookie } from "../../../lib/auth";
import { AdminShell } from "../../../components/admin/AdminShell";
import { AdminCategoryManager } from "../../../components/admin/AdminCategoryManager";
import { getCategoryRecords } from "../../../lib/categories";

export default async function AdminCategoriesPage() {
  const admin = await getAdminFromCookie();
  if (!admin) {
    redirect("/admin/login");
  }

  const categories = await getCategoryRecords();

  const articleCounts = await prisma.article.groupBy({
    by: ["category"],
    _count: {
      category: true,
    },
  });

  const countByCategory = new Map(articleCounts.map((item) => [item.category, item._count.category]));

  const normalizedCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    articleCount: countByCategory.get(category.name) ?? 0,
    updatedAt: category.updatedAt.toISOString(),
  }));

  const rightPanel = (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Categories</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{normalizedCategories.length}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Mapped Articles</p>
        <p className="mt-2 text-3xl font-bold text-blue-700">
          {normalizedCategories.reduce((sum, category) => sum + category.articleCount, 0)}
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        Renaming a category also updates existing article records that still point at the old name.
      </div>
    </div>
  );

  return (
    <AdminShell
      title="Categories"
      subtitle="Manage editorial categories used across admin and author publishing flows."
      rightPanel={rightPanel}
    >
      <AdminCategoryManager categories={normalizedCategories} />
    </AdminShell>
  );
}
