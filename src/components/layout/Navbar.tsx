import Link from "next/link";
import { Bell, Bookmark } from "lucide-react";
import { Category } from "../../types";
import { getSiteUserFromCookie } from "../../lib/site-auth";
import { NavbarSearch } from "./NavbarSearch";
import { NavbarMobileMenu } from "./NavbarMobileMenu";

export const Navbar = async () => {
  const user = await getSiteUserFromCookie();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-8">
          <Link
            href="/"
            className="shrink-0 font-headline text-[1.15rem] font-bold tracking-tighter sm:text-2xl"
          >
            ChronicleDaily
          </Link>
          <nav className="hidden xl:flex gap-5 lg:gap-6">
            {Object.values(Category).slice(0, 6).map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {user?.role === "AUTHOR" ? (
            <Link
              href="/author"
              className="hidden rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container xl:inline-flex"
            >
              <span>Author Studio</span>
            </Link>
          ) : null}
          <NavbarSearch />
          <NavbarMobileMenu
            categories={Object.values(Category).slice(0, 6)}
            isAuthor={user?.role === "AUTHOR"}
            isLoggedIn={Boolean(user)}
          />
          <button
            className="relative rounded-full p-2 hover:bg-surface-container transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
          </button>
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
        </div>
      </div>
    </header>
  );
};
