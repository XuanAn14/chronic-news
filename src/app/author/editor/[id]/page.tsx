import { redirect, notFound } from "next/navigation";
import prisma from "../../../../lib/prisma";
import { getAuthorFromCookie } from "../../../../lib/site-auth";
import { AuthorEditorForm } from "../../../../components/author/AuthorEditorForm";

export default async function AuthorEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const author = await getAuthorFromCookie();
  if (!author) {
    redirect("/login");
  }

  const params = await props.params;
  const article = await prisma.article.findFirst({
    where: {
      id: params.id,
      siteAuthorId: author.id,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <AuthorEditorForm
      authorName={author.name}
      initialData={{
        articleId: article.id,
        title: article.title,
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
