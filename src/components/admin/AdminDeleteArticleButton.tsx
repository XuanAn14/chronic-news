"use client";

import { useRouter } from "next/navigation";

export function AdminDeleteArticleButton({ articleId }: { articleId: string }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm("Delete this article?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/admin/articles/${articleId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-xs font-semibold text-red-600 transition hover:underline"
    >
      Delete
    </button>
  );
}
