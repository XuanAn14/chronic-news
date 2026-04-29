"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  HelpCircle,
  LayoutDashboard,
  Newspaper,
  PenSquare,
  Settings,
  Image as ImageIcon,
  BarChart3,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface AuthorShellProps {
  title: string;
  subtitle: string;
  authorName: string;
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/author", icon: LayoutDashboard },
  { label: "My Articles", href: "/author", icon: Newspaper },
  { label: "Engagement", href: "/author", icon: BarChart3 },
  { label: "New Article", href: "/author/editor", icon: PenSquare },
  { label: "Media", href: "#", icon: ImageIcon, disabled: true },
];

export function AuthorShell({ title, subtitle, authorName, children }: AuthorShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-gray-900">Author Studio</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-64 rounded-lg border-none bg-surface-container-low px-4 py-1.5 text-sm focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-50">
            <Bell className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-50">
            <HelpCircle className="h-5 w-5" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-white text-xs font-bold text-slate-700">
            {authorName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        <aside className="fixed left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 overflow-y-auto border-r border-gray-200 bg-white lg:block">
          <nav className="flex h-full flex-col space-y-1 p-4">
            <div className="mb-4 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black tracking-tighter text-blue-600">Author Portal</h2>
              <p className="text-xs text-tertiary">Newsroom Edition</p>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href !== "#" && pathname === item.href;

              if (item.disabled) {
                return (
                  <span
                    key={item.label}
                    className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-gray-400"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </span>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-all",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="mt-auto space-y-1 border-t border-gray-100 pt-4">
              <span className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-gray-600">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </span>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
              >
                <HelpCircle className="h-5 w-5" />
                <span>Account</span>
              </Link>
            </div>
          </nav>
        </aside>

        <main className="mx-auto w-full max-w-[1280px] flex-1 p-4 lg:ml-64">
          <section className="mb-6 flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="font-headline text-3xl font-bold text-on-surface">{title}</h1>
              <p className="text-body-md text-tertiary">{subtitle}</p>
            </div>
            <Link
              href="/author/editor"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-primary-container"
            >
              <PenSquare className="h-4 w-4" />
              <span>New Article</span>
            </Link>
          </section>

          {children}
        </main>
      </div>
    </div>
  );
}
