"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthorShell } from "./AuthorShell";

export function AuthorEditorForm({ authorName }: { authorName: string }) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [status, setStatus] = useState("Draft");
  const [featuredImage, setFeaturedImage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const wordCount = useMemo(() => {
    const trimmed = content.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [content]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/author/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        excerpt,
        content,
        category,
        status,
        featuredImage,
      }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      router.push("/author");
      router.refresh();
      return;
    }

    const body = await response.json();
    setError(body?.error || "Could not create article.");
  }

  return (
    <AuthorShell
      authorName={authorName}
      title="Create a new article"
      subtitle="Publish under your own byline and track engagement from the author studio."
    >
      <div className="grid grid-cols-12 gap-4">
        <form onSubmit={handleSubmit} className="col-span-12 space-y-4 lg:col-span-8">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Article Title"
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-4 font-headline text-3xl font-bold outline-none focus:border-primary"
            required
          />
          <textarea
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            placeholder="Article excerpt"
            rows={3}
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Start typing your story here..."
            rows={18}
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-4 text-base outline-none focus:border-primary"
            required
          />
          <input
            type="url"
            value={featuredImage}
            onChange={(event) => setFeaturedImage(event.target.value)}
            placeholder="Cover image URL"
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-sm outline-none focus:border-primary"
          />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-container disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save article"}
          </button>
        </form>

        <aside className="col-span-12 space-y-4 lg:col-span-4">
          <div className="rounded-lg border border-outline-variant bg-white p-4">
            <h3 className="font-headline text-lg font-semibold">Publishing</h3>
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Category
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  {["Technology", "Politics", "Business", "Science", "Lifestyle", "Economy"].map(
                    (item) => (
                      <option key={item}>{item}</option>
                    ),
                  )}
                </select>
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Status
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </label>
            </div>
          </div>
          <div className="rounded-lg border border-outline-variant bg-white p-4">
            <h3 className="font-headline text-lg font-semibold">Article stats</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-surface-container p-4 text-center">
                <div className="text-2xl font-bold">{wordCount}</div>
                <div className="text-xs uppercase tracking-wider text-slate-500">Words</div>
              </div>
              <div className="rounded-lg bg-surface-container p-4 text-center">
                <div className="text-2xl font-bold">{Math.max(1, Math.ceil(wordCount / 220))}</div>
                <div className="text-xs uppercase tracking-wider text-slate-500">Min read</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AuthorShell>
  );
}
