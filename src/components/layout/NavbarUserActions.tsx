"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { NavbarMobileMenu } from "./NavbarMobileMenu";

interface NavbarUser {
  name: string;
  role: "READER" | "AUTHOR";
}

interface NavbarUserActionsProps {
  categories: string[];
}

export function NavbarUserActions({ categories }: NavbarUserActionsProps) {
  const [user, setUser] = useState<NavbarUser | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      }).catch(() => null);

      if (!response?.ok || ignore) {
        return;
      }

      const body = await response.json().catch(() => ({}));
      setUser(body?.user ?? null);
    }

    void loadUser();

    return () => {
      ignore = true;
    };
  }, []);

  const isAuthor = user?.role === "AUTHOR";
  const isLoggedIn = Boolean(user);

  return (
    <>
      {isAuthor ? (
        <Link
          href="/author"
          className="hidden rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container xl:inline-flex"
        >
          <span>Author Studio</span>
        </Link>
      ) : null}
      <NavbarMobileMenu
        categories={categories}
        isAuthor={isAuthor}
        isLoggedIn={isLoggedIn}
      />
      <Link
        href="/settings"
        className="rounded-full p-2 hover:bg-surface-container transition-colors"
        aria-label="Saved articles"
      >
        <Bookmark className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
      </Link>
      {user ? (
        <Link
          href="/settings"
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container text-[11px] font-bold text-on-surface sm:text-xs"
        >
          {user.name.charAt(0).toUpperCase()}
        </Link>
      ) : (
        <Link
          href="/login"
          className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-container sm:px-4 sm:text-sm"
        >
          Sign in
        </Link>
      )}
    </>
  );
}
