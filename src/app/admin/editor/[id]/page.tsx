import { notFound, redirect } from "next/navigation";
import prisma from "../../../../lib/prisma";
import { getAdminFromCookie } from "../../../../lib/auth";
import { AdminEditorForm } from "../../../../components/admin/AdminEditorForm";
import { getCategoryOptions } from "../../../../lib/categories";

export default async function AdminEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAdminFromCookie();
  if (!admin) {
    redirect("/admin/login");
  }

  const params = await props.params;
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  });

  if (!article) {
    notFound();
  }

  const categories = await getCategoryOptions();

  return (
    <AdminEditorForm
      categories={categories}
      initialData={{
        articleId: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        status: article.status,
        featuredImage: article.featuredImage ?? "",
        metaTitle: article.metaTitle ?? "",
        metaDescription: article.metaDescription ?? "",
      }}
    />
  );
}
