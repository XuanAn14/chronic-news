import { redirect } from "next/navigation";
import { AuthorEditorForm } from "../../../components/author/AuthorEditorForm";
import { getAuthorFromCookie } from "../../../lib/site-auth";
import { getCategoryOptions } from "../../../lib/categories";

export default async function AuthorEditorPage() {
  const author = await getAuthorFromCookie();
  if (!author) {
    redirect("/login");
  }

  const categories = await getCategoryOptions();

  return <AuthorEditorForm authorName={author.name} categories={categories} />;
}
