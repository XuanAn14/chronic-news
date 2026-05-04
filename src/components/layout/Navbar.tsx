import Link from "next/link";
import { Suspense } from "react";
import { Category } from "../../types";
import { NavbarSearch } from "./NavbarSearch";
import { NotificationBell } from "./NotificationBell";
import { NavbarUserActions } from "./NavbarUserActions";
import { PrefetchLink } from "../routing/PrefetchLink";

export const Navbar = () => {
  const navCategories = Object.values(Category).slice(0, 6);

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
            {navCategories.map((cat) => (
              <PrefetchLink
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
              >
                {cat}
              </PrefetchLink>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Suspense fallback={null}>
            <NavbarSearch />
          </Suspense>
          <NotificationBell />
          <Suspense fallback={null}>
            <NavbarUserActions categories={navCategories} />
          </Suspense>
        </div>
      </div>
    </header>
  );
};
