"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function NavbarSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    } else {
      params.delete("q");
    }

    const targetPath =
      pathname === "/" || pathname.startsWith("/category/") ? pathname : "/";

    router.push(params.toString() ? `${targetPath}?${params.toString()}` : targetPath);
  }

  return (
    <form onSubmit={handleSubmit} className="hidden xl:block">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the feed..."
          className="w-40 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 pl-10 text-sm outline-none transition focus:border-primary md:w-52 lg:w-64"
        />
      </div>
    </form>
  );
}
