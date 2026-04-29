"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Users,
  BarChart3,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { AdminLogoutButton } from "./AdminLogoutButton";

interface AdminShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  rightPanel?: ReactNode;
}

const navItems = [
  { label: "Posts", href: "/admin/dashboard", icon: FileText },
  { label: "Editor", href: "/admin/editor", icon: LayoutDashboard },
  { label: "Comments", href: "#", icon: MessageSquare, disabled: true },
  { label: "Analytics", href: "#", icon: BarChart3, disabled: true },
  { label: "User Management", href: "/admin/users", icon: Users },
];

export function AdminShell({ title, subtitle, children, rightPanel }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-slate-200 bg-slate-50 py-4 lg:flex">
        <div className="mb-8 px-6">
          <h1 className="text-xl font-black text-slate-900">CMS Console</h1>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Editorial Workflow
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "#" && pathname.startsWith(item.href) && item.href !== "/admin/dashboard");

            if (item.disabled) {
              return (
                <span
                  key={item.label}
                  className="flex cursor-default items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-400"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </span>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "border-r-4 border-blue-600 bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className={cn("h-4 w-4", isActive && "fill-current")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 border-t border-slate-200 px-3 pt-4">
          <Link
            href="/admin/editor"
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </Link>
          <span className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600">
            <HelpCircle className="h-4 w-4" />
            <span>Help Center</span>
          </span>
          <AdminLogoutButton
            className="w-full justify-start px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            icon={<LogOut className="h-4 w-4" />}
            label="Logout"
          />
        </div>
      </aside>

      <div className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded border border-slate-200 bg-slate-100 px-3 py-1.5">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-48 border-none bg-transparent px-2 text-sm outline-none ring-0 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-slate-200 pr-4">
              <button className="relative rounded p-2 text-slate-600 transition-colors hover:bg-slate-50">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-secondary" />
              </button>
              <button className="rounded p-2 text-slate-600 transition-colors hover:bg-slate-50">
                <Settings className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">Admin Pulse</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Editor-in-Chief
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700">
                AP
              </div>
            </div>
          </div>
        </header>

        <main className="flex min-h-[calc(100vh-64px)] flex-col overflow-hidden xl:flex-row">
          <section className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-5xl space-y-6">
              <div>
                <h1 className="font-headline text-3xl font-bold text-slate-900">{title}</h1>
                <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
              </div>
              {children}
            </div>
          </section>

          {rightPanel ? (
            <aside className="w-full border-t border-slate-200 bg-white p-6 xl:w-80 xl:border-l xl:border-t-0">
              {rightPanel}
            </aside>
          ) : null}
        </main>
      </div>
    </div>
  );
}
