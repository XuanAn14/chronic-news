'use client'

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, History, Mail, Shield, FileText, MessageSquare, BarChart3, Group, HelpCircle, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  variant: "account" | "cms";
}

export const Sidebar = ({ variant }: SidebarProps) => {
  const pathname = usePathname();

  const accountLinks = [
    { label: "Saved Articles", icon: Bookmark, href: "/settings" },
    { label: "Reading History", icon: History, href: "/history" },
    { label: "Newsletter Subscriptions", icon: Mail, href: "/newsletters" },
    { label: "Account Security", icon: Shield, href: "/security" },
  ];

  const cmsLinks = [
    { label: "Posts", icon: FileText, href: "/cms" },
    { label: "Comments", icon: MessageSquare, href: "/cms/comments" },
    { label: "Analytics", icon: BarChart3, href: "/cms/analytics" },
    { label: "User Management", icon: Group, href: "/cms/users" },
  ];

  const links = variant === "account" ? accountLinks : cmsLinks;

  return (
    <>
      <div className="lg:hidden">
        <div className="mb-6 rounded-2xl border border-outline-variant bg-surface p-4">
          <div className="mb-4">
            <h2 className="font-headline text-lg font-bold text-on-surface">
              {variant === "account" ? "My Account" : "CMS Console"}
            </h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              {variant === "account" ? "User Dashboard" : "Editorial Workflow"}
            </p>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-white"
                      : "border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <aside className="sticky top-24 hidden h-fit w-64 shrink-0 self-start rounded-2xl border border-outline-variant bg-surface px-4 py-6 lg:flex lg:flex-col">
        <div className="px-4 mb-8">
          <h2 className="font-headline text-lg font-bold text-on-surface">
            {variant === "account" ? "My Account" : "CMS Console"}
          </h2>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold mt-1">
            {variant === "account" ? "User Dashboard" : "Editorial Workflow"}
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 group transition-all",
                  isActive 
                    ? "bg-primary/10 text-primary font-bold ring-1 ring-primary/20" 
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-outline group-hover:text-on-surface")} />
                <span className="text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-outline-variant space-y-1">
          <Link href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-on-surface-variant transition-colors hover:bg-surface-container">
            <HelpCircle className="h-5 w-5 text-outline" />
            <span className="text-sm font-medium">Help Center</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-on-surface-variant transition-colors hover:bg-surface-container">
            <LogOut className="h-5 w-5 text-outline" />
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
