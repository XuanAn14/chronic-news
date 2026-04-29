"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { AuthorShell } from "./AuthorShell";

interface AuthorEditorInitialData {
  articleId?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  status?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export function AuthorEditorForm({
  authorName,
  initialData,
}: {
  authorName: string;
  initialData?: AuthorEditorInitialData;
}) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "Technology");
  const [status, setStatus] = useState(initialData?.status ?? "Draft");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage ?? "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isEditing = Boolean(initialData?.articleId);
  const wordCount = useMemo(() => {
    const trimmed = content.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [content]);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads/image", {
      method: "POST",
      body: formData,
    });

    setIsUploading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body?.error || "Could not upload image.");
      return;
    }

    const body = await response.json();
    setFeaturedImage(body.url);
  }

  async function handleDelete() {
    if (!initialData?.articleId) {
      return;
    }

    const confirmed = window.confirm("Delete this article?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/author/articles/${initialData.articleId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Could not delete article.");
      return;
    }

    router.push("/author");
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const endpoint = isEditing
      ? `/api/author/articles/${initialData?.articleId}`
      : "/api/author/articles";
    const method = isEditing ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
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
        metaTitle,
        metaDescription,
      }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      router.push("/author");
      router.refresh();
      return;
    }

    const body = await response.json();
    setError(body?.error || "Could not save article.");
  }

  return (
    <AuthorShell
      authorName={authorName}
      title={isEditing ? "Edit article" : "Create a new article"}
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

          <div className="space-y-3">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Cover Image URL</span>
              <input
                type="text"
                value={featuredImage}
                onChange={(event) => setFeaturedImage(event.target.value)}
                placeholder="/uploads/... or https://..."
                className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-400 transition-colors hover:border-primary-container hover:bg-blue-50"
            >
              <UploadCloud className="mx-auto mb-4 h-10 w-10" />
              <p className="font-headline text-lg font-semibold text-slate-700">
                {isUploading ? "Uploading image..." : "Upload Cover Image"}
              </p>
              <p className="mt-2 text-xs font-semibold">
                Choose JPG or PNG from your computer
              </p>
            </button>
            {featuredImage ? (
              <img
                src={featuredImage}
                alt="Cover preview"
                className="h-48 w-full rounded-lg border border-outline-variant object-cover"
              />
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-container disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update article" : "Save article"}
            </button>
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Delete article
              </button>
            ) : null}
          </div>
        </form>

        <aside className="col-span-12 space-y-4 lg:col-span-4">
          <div className="rounded-lg border border-outline-variant bg-white p-4">
            <h3 className="font-headline text-lg font-semibold">Categories</h3>
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
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-surface-container px-3 py-1 text-sm text-slate-800">
                  {category}
                </span>
                {status === "Published" ? (
                  <span className="rounded bg-green-50 px-3 py-1 text-sm text-green-700">Public</span>
                ) : (
                  <span className="rounded bg-amber-50 px-3 py-1 text-sm text-amber-700">Draft</span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-outline-variant bg-white p-4">
            <h3 className="font-headline text-lg font-semibold">SEO Settings</h3>
            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(event) => setMetaTitle(event.target.value)}
                  className="w-full rounded border border-slate-200 p-2 text-sm"
                />
                <p className="text-right text-[10px] text-slate-400">{metaTitle.length}/60 chars</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(event) => setMetaDescription(event.target.value)}
                  className="w-full rounded border border-slate-200 p-2 text-sm"
                />
                <p className="text-right text-[10px] text-slate-400">
                  {metaDescription.length}/160 chars
                </p>
              </div>
            </div>
            <div className="mt-3 rounded border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
              <p className="mb-1 font-bold">Google Preview:</p>
              <p className="truncate font-medium text-blue-600">
                {metaTitle || title || "New article draft"} - Chronicle
              </p>
              <p className="mt-1 line-clamp-2 text-slate-500">
                {metaDescription || excerpt || "Describe how this article should appear in search results."}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-outline-variant bg-white p-4">
            <h3 className="font-headline text-lg font-semibold">Publishing</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Post Visibility</span>
                <span className="rounded border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                  Public
                </span>
              </div>
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
              <p className="text-xs leading-5 text-slate-500">
                Only articles with status <span className="font-semibold text-slate-700">Published</span>{" "}
                appear immediately in the news feed.
              </p>
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
