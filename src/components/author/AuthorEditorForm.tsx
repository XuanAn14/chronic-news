"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, RefreshCw, Save, UploadCloud, X } from "lucide-react";
import { AuthorShell } from "./AuthorShell";
import { getSuggestedSlug, suggestMetaDescription, suggestMetaTitle } from "../../lib/editor";

interface AuthorEditorInitialData {
  articleId?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  status?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
}

function PreviewModal({
  open,
  onClose,
  title,
  slug,
  excerpt,
  content,
  featuredImage,
  metaTitle,
  metaDescription,
  category,
  authorName,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  authorName: string;
}) {
  if (!open) {
    return null;
  }

  const previewTitle = title || "Untitled draft";
  const previewDescription =
    metaDescription || excerpt || "Add a short summary to improve search preview.";
  const previewImage =
    featuredImage ||
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=800&fit=crop";
  const paragraphs = content.split(/\n\n+/).filter(Boolean).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 lg:p-10">
      <div className="w-full max-w-5xl rounded-2xl bg-slate-50 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Preview before publish
            </p>
            <p className="mt-1 text-sm text-slate-600">Live draft rendering from current editor fields.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Search preview</p>
              <p className="mt-3 truncate text-sm text-green-700">
                chronicle.news/article/{slug || getSuggestedSlug(title)}
              </p>
              <p className="mt-1 truncate text-xl font-semibold text-blue-700">
                {metaTitle || suggestMetaTitle(title) || previewTitle}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{previewDescription}</p>
            </div>

            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                <span>{category}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>Draft Preview</span>
              </div>
              <h1 className="font-headline text-4xl font-bold leading-tight text-slate-950">
                {previewTitle}
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">{excerpt || "Add an excerpt for the deck."}</p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                <img src={previewImage} alt={previewTitle} className="h-80 w-full object-cover" />
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-700">
                  {authorName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{authorName}</p>
                  <p className="text-sm text-slate-500">Preview mode</p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {(paragraphs.length ? paragraphs : ["Start typing your story here..."]).map((paragraph, index) => (
                  <p key={index} className="text-lg leading-8 text-slate-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Publishing URL</p>
              <p className="mt-2 break-all text-sm font-medium text-slate-700">
                /article/{slug || getSuggestedSlug(title)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">SEO payload</p>
              <dl className="mt-3 space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-900">Meta title</dt>
                  <dd>{metaTitle || suggestMetaTitle(title) || "Missing"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Meta description</dt>
                  <dd>{previewDescription}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Editorial checks</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Slug is generated from the current title and can be edited manually.</li>
                <li>Meta description falls back to excerpt or story body.</li>
                <li>Only published posts appear in the main feed immediately.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function AuthorEditorForm({
  authorName,
  categories,
  initialData,
}: {
  authorName: string;
  categories: string[];
  initialData?: AuthorEditorInitialData;
}) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hasCustomSlug, setHasCustomSlug] = useState(Boolean(initialData?.slug));
  const [hasCustomMetaTitle, setHasCustomMetaTitle] = useState(Boolean(initialData?.metaTitle));
  const [hasCustomMetaDescription, setHasCustomMetaDescription] = useState(
    Boolean(initialData?.metaDescription),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isEditing = Boolean(initialData?.articleId);
  const wordCount = useMemo(() => {
    const trimmed = content.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [content]);

  useEffect(() => {
    if (!hasCustomSlug) {
      setSlug(getSuggestedSlug(title));
    }
  }, [title, hasCustomSlug]);

  useEffect(() => {
    if (!hasCustomMetaTitle) {
      setMetaTitle(suggestMetaTitle(title));
    }
  }, [title, hasCustomMetaTitle]);

  useEffect(() => {
    if (!hasCustomMetaDescription) {
      setMetaDescription(suggestMetaDescription(excerpt, content));
    }
  }, [excerpt, content, hasCustomMetaDescription]);

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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const body = await response.json();
    setFeaturedImage(body.url);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        slug,
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

  function resetSlugSuggestion() {
    setHasCustomSlug(false);
    setSlug(getSuggestedSlug(title));
  }

  function resetSeoSuggestion() {
    setHasCustomMetaTitle(false);
    setHasCustomMetaDescription(false);
    setMetaTitle(suggestMetaTitle(title));
    setMetaDescription(suggestMetaDescription(excerpt, content));
  }

  return (
    <AuthorShell
      authorName={authorName}
      title={isEditing ? "Edit article" : "Create a new article"}
      subtitle="Publish under your own byline and review the article exactly as it will appear before it goes live."
    >
      <PreviewModal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        slug={slug}
        excerpt={excerpt}
        content={content}
        featuredImage={featuredImage}
        metaTitle={metaTitle}
        metaDescription={metaDescription}
        category={category}
        authorName={authorName}
      />

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

          <div className="rounded-lg border border-outline-variant bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Article slug</p>
                <p className="mt-1 text-xs text-slate-500">Used for the public article URL and search sharing.</p>
              </div>
              <button
                type="button"
                onClick={resetSlugSuggestion}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Auto-generate
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <span className="hidden text-sm text-slate-500 sm:inline">chronicle.news/article/</span>
              <input
                type="text"
                value={slug}
                onChange={(event) => {
                  setHasCustomSlug(true);
                  setSlug(event.target.value);
                }}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none"
                placeholder="story-url"
              />
            </div>
          </div>

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
              accept=".jpg,.jpeg,.png,.webp,.gif,.avif,image/*"
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
                Choose JPG, PNG, WEBP, GIF, or AVIF from your computer
              </p>
            </button>
            {featuredImage ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-outline-variant bg-slate-50 p-3">
                <img
                  src={featuredImage}
                  alt="Cover preview"
                  className="h-full w-full rounded object-contain"
                />
              </div>
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-container disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? "Saving..." : isEditing ? "Update article" : "Save article"}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
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
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
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
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-headline text-lg font-semibold">SEO Settings</h3>
              <button
                type="button"
                onClick={resetSeoSuggestion}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Suggest
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(event) => {
                    setHasCustomMetaTitle(true);
                    setMetaTitle(event.target.value);
                  }}
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
                  onChange={(event) => {
                    setHasCustomMetaDescription(true);
                    setMetaDescription(event.target.value);
                  }}
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
                {metaTitle || suggestMetaTitle(title) || "New article draft"} - Chronicle
              </p>
              <p className="mt-1 line-clamp-2 text-slate-500">
                {metaDescription ||
                  suggestMetaDescription(excerpt, content) ||
                  "Describe how this article should appear in search results."}
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
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Eye className="h-4 w-4" />
                Open publish preview
              </button>
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
