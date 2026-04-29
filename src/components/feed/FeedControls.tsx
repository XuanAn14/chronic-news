"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface FeedControlsProps {
  categories: string[];
  currentQuery?: string;
  currentCategory?: string;
  currentSort?: "latest" | "popular";
  lockCategory?: boolean;
  placeholder?: string;
}

export function FeedControls({
  categories,
  currentQuery = "",
  currentCategory = "",
  currentSort = "latest",
  lockCategory = false,
  placeholder = "Search articles...",
}: FeedControlsProps) {
  const [query, setQuery] = useState(currentQuery);
  const [category, setCategory] = useState(currentCategory);
  const [sort, setSort] = useState<"latest" | "popular">(currentSort);
  const router = useRouter();
  const pathname = usePathname();

  function applyFilters(nextCategory = category, nextSort = sort, nextQuery = query) {
    const params = new URLSearchParams();

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    }

    if (nextCategory) {
      params.set("category", nextCategory);
    }

    if (nextSort !== "latest") {
      params.set("sort", nextSort);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <div className="rounded-xl border border-outline-variant bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.9fr_0.8fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                applyFilters();
              }
            }}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary"
          />
        </div>
        <select
          value={category}
          disabled={lockCategory}
          onChange={(event) => {
            const nextValue = event.target.value;
            setCategory(nextValue);
            applyFilters(nextValue, sort, query);
          }}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary disabled:opacity-70"
        >
          <option value="">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) => {
            const nextValue = event.target.value as "latest" | "popular";
            setSort(nextValue);
            applyFilters(category, nextValue, query);
          }}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-primary"
        >
          <option value="latest">Latest</option>
          <option value="popular">Most Read</option>
        </select>
        <button
          type="button"
          onClick={() => applyFilters()}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
