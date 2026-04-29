import { redirect } from "next/navigation";
import { AuthorEditorForm } from "../../../components/author/AuthorEditorForm";
import { getAuthorFromCookie } from "../../../lib/site-auth";

export default async function AuthorEditorPage() {
  const author = await getAuthorFromCookie();
  if (!author) {
    redirect("/login");
  }

  return <AuthorEditorForm authorName={author.name} />;
}
