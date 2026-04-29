"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bold,
  Calendar,
  Eye,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Save,
  UploadCloud,
} from "lucide-react";
import { AdminShell } from "./AdminShell";

const categories = ["Politics", "Technology", "Economy", "Culture", "Business", "Science"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminEditorForm() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [category, setCategory] = useState("Technology");
  const [status, setStatus] = useState("Draft");
  const [featuredImage, setFeaturedImage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const slugPreview = useMemo(() => slugify(title) || "new-article-draft-01", [title]);
  const wordCount = useMemo(() => {
    const trimmed = content.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [content]);

  async function submitArticle(nextStatus: "Draft" | "Published") {
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/admin/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        excerpt,
        content,
        metaTitle,
        metaDescription,
        category,
        status: nextStatus,
        featuredImage,
      }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      router.push("/admin/dashboard");
      router.refresh();
      return;
    }

    const body = await response.json();
    setError(body?.error || "Could not create article. Please try again.");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitArticle(status as "Draft" | "Published");
  }

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

  const rightPanel = (
    <div className="space-y-8">
      <div className="space-y-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => submitArticle("Published")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-3 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-60"
        >
          <Calendar className="h-4 w-4" />
          <span>{isSubmitting ? "Publishing..." : "Publish Article"}</span>
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="submit"
            form="admin-editor-form"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold text-slate-900">Categories</h3>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded border border-slate-200 bg-slate-50 p-2 text-sm"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
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

      <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold text-slate-900">SEO Settings</h3>
        <div className="space-y-3">
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
            <p className="text-right text-[10px] text-slate-400">{metaDescription.length}/160 chars</p>
          </div>
        </div>
        <div className="rounded border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
          <p className="mb-1 font-bold">Google Preview:</p>
          <p className="truncate font-medium text-blue-600">
            {metaTitle || title || "New article draft"} - Chronicle
          </p>
          <p className="mt-1 line-clamp-2 text-slate-500">
            {metaDescription || excerpt || "Describe how this article should appear in search results."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold text-slate-900">Publishing</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Post Visibility</span>
          <span className="rounded border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
            Public
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-primary-container"
          >
            <option>Draft</option>
            <option>Published</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <AdminShell
      title="Article Editor"
      subtitle="Write, review, and publish stories with the same editorial layout defined in your HTML mockup."
      rightPanel={rightPanel}
    >
      <form id="admin-editor-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Article Title"
            className="w-full border-none bg-transparent px-0 py-2 font-headline text-4xl font-bold text-slate-900 outline-none placeholder:text-slate-300"
            required
          />
          <div className="flex items-center gap-2 text-slate-400">
            <LinkIcon className="h-4 w-4" />
            <span className="text-xs font-semibold">chronicle.news/posts/</span>
            <span className="text-xs font-semibold text-primary-container">{slugPreview}</span>
          </div>
        </div>

        <div className="sticky top-0 z-10 flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {[Bold, List, ListOrdered, ImageIcon, Quote].map((Icon, index) => (
            <button
              key={index}
              type="button"
              className="rounded p-2 text-slate-600 hover:bg-slate-100"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
          <button type="button" className="rounded p-2 text-slate-600 hover:bg-slate-100">
            <LinkIcon className="h-4 w-4" />
          </button>
          <div className="ml-auto flex items-center gap-2 pr-2 text-[10px] font-semibold text-slate-400">
            <span>Words: {wordCount}</span>
            <span>Saved: local draft</span>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Excerpt</span>
          <textarea
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm outline-none transition focus:border-primary"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Story Body</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={16}
            placeholder="Start typing your story here..."
            className="min-h-[500px] w-full rounded-xl border border-slate-200 bg-white p-6 text-lg leading-relaxed text-slate-800 shadow-sm outline-none transition focus:border-primary"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Cover Image URL</span>
          <input
            type="text"
            value={featuredImage}
            onChange={(event) => setFeaturedImage(event.target.value)}
            placeholder="/uploads/... or https://..."
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm outline-none transition focus:border-primary"
          />
        </label>

        <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-400 transition-colors hover:border-primary-container hover:bg-blue-50">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <UploadCloud className="mx-auto mb-4 h-10 w-10" />
          <p className="font-headline text-lg font-semibold text-slate-700">
            {isUploading ? "Uploading image..." : "Add Cover Image"}
          </p>
          <p className="mt-2 text-xs font-semibold">
            Recommended size: 1200x630px (JPG, PNG)
          </p>
        </label>

        {featuredImage ? (
          <img
            src={featuredImage}
            alt="Cover preview"
            className="h-56 w-full rounded-xl border border-slate-200 object-cover"
          />
        ) : null}

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </form>
    </AdminShell>
  );
}
