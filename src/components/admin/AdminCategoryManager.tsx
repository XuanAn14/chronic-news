"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  articleCount: number;
  updatedAt: string;
}

export function AdminCategoryManager({ categories }: { categories: CategoryRecord[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { name: string; description: string }>>(
    Object.fromEntries(
      categories.map((category) => [
        category.id,
        {
          name: category.name,
          description: category.description ?? "",
        },
      ]),
    ),
  );
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function createCategory() {
    if (!newName.trim()) {
      setError("Category name is required.");
      return;
    }

    setError("");
    setIsCreating(true);

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        description: newDescription,
      }),
    });

    setIsCreating(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body?.error || "Could not create category.");
      return;
    }

    setNewName("");
    setNewDescription("");
    router.refresh();
  }

  async function saveCategory(categoryId: string) {
    const draft = drafts[categoryId];
    if (!draft?.name.trim()) {
      setError("Category name is required.");
      return;
    }

    setError("");
    setBusyId(categoryId);

    const response = await fetch(`/api/admin/categories/${categoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    setBusyId(null);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body?.error || "Could not update category.");
      return;
    }

    setEditingId(null);
    router.refresh();
  }

  async function deleteCategory(categoryId: string, articleCount: number) {
    const confirmed = window.confirm(
      articleCount
        ? "This category still has articles. Move or rename those articles before deleting it."
        : "Delete this category?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setBusyId(categoryId);

    const response = await fetch(`/api/admin/categories/${categoryId}`, {
      method: "DELETE",
    });

    setBusyId(null);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body?.error || "Could not delete category.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create Category</h2>
            <p className="mt-1 text-sm text-slate-500">
              Categories are reused by admin and author editors.
            </p>
          </div>
          <button
            type="button"
            onClick={createCategory}
            disabled={isCreating}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            <span>{isCreating ? "Creating..." : "Add Category"}</span>
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">
            Name
            <input
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-normal"
              placeholder="Technology"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Description
            <input
              type="text"
              value={newDescription}
              onChange={(event) => setNewDescription(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-normal"
              placeholder="Optional internal note"
            />
          </label>
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Category
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Slug
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Description
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Articles
                </th>
                <th className="p-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const draft = drafts[category.id];
                const isEditing = editingId === category.id;

                return (
                  <tr key={category.id} className="border-b border-slate-200 align-top hover:bg-slate-50">
                    <td className="p-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={draft.name}
                          onChange={(event) =>
                            setDrafts((current) => ({
                              ...current,
                              [category.id]: {
                                ...current[category.id],
                                name: event.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                        />
                      ) : (
                        <div>
                          <p className="font-semibold text-slate-900">{category.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            Updated{" "}
                            {new Date(category.updatedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-600">{category.slug}</td>
                    <td className="p-4">
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={draft.description}
                          onChange={(event) =>
                            setDrafts((current) => ({
                              ...current,
                              [category.id]: {
                                ...current[category.id],
                                description: event.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-slate-600">{category.description || "No description"}</p>
                      )}
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700">{category.articleCount}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-3">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveCategory(category.id)}
                              disabled={busyId === category.id}
                              className="text-xs font-semibold text-primary-container hover:underline disabled:opacity-60"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="text-xs font-semibold text-slate-600 hover:underline"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditingId(category.id)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-container hover:underline"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteCategory(category.id, category.articleCount)}
                              disabled={busyId === category.id}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline disabled:opacity-60"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
