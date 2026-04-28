'use client'

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Bookmark } from "lucide-react";
import { Category } from "../../types";

export const Navbar = () => {
  const pathname = usePathname();
  const isCMS = pathname.startsWith('/cms');

  if (isCMS) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-headline text-2xl font-bold tracking-tighter">
            ChronicleDaily
          </Link>
          <nav className="hidden md:flex gap-6">
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

        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 hover:bg-surface-container transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="relative rounded-full p-2 hover:bg-surface-container transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
          </button>
          <Link href="/settings" className="rounded-full p-2 hover:bg-surface-container transition-colors">
            <Bookmark className="h-5 w-5" />
          </Link>
          <Link href="/settings" className="h-8 w-8 overflow-hidden rounded-full border border-outline-variant">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};
