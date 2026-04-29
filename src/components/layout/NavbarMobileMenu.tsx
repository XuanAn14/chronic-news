"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface NavbarMobileMenuProps {
  categories: string[];
  isAuthor: boolean;
  isLoggedIn: boolean;
}

export function NavbarMobileMenu({
  categories,
  isAuthor,
  isLoggedIn,
}: NavbarMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted, open]);

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
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full p-2 transition-colors hover:bg-surface-container xl:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && open
        ? createPortal(
        <div className="fixed inset-0 z-[60] xl:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/45"
            aria-label="Close navigation overlay"
          />
          <div className="absolute right-0 top-0 z-10 flex h-full w-[min(22rem,92vw)] flex-col border-l border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <div>
                <p className="font-headline text-lg font-bold text-slate-900">Menu</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  ChronicleDaily
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto bg-slate-50 px-4 py-4">
              <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Search
                </p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search the feed..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-900 outline-none transition focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white"
                >
                  Search
                </button>
              </form>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Categories
                </p>
                <nav className="space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/category/${category.toLowerCase()}`}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                    >
                      {category}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Quick Access
                </p>
                <div className="space-y-1">
                  {isAuthor ? (
                    <Link
                      href="/author"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      Author Studio
                    </Link>
                  ) : null}
                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                  >
                    Saved Articles
                  </Link>
                  <Link
                    href={isLoggedIn ? "/settings" : "/login"}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                  >
                    {isLoggedIn ? "Account" : "Sign in"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )
        : null}
    </>
  );
}
