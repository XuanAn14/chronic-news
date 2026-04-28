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
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-64 flex-col border-r border-outline-variant bg-surface px-4 py-6 md:flex">
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
                "flex items-center gap-3 px-4 py-3 rounded-r-full group transition-all",
                isActive 
                  ? "bg-primary/10 text-primary font-bold border-r-4 border-primary" 
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
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-r-full transition-colors">
          <HelpCircle className="h-5 w-5 text-outline" />
          <span className="text-sm font-medium">Help Center</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-r-full transition-colors">
          <LogOut className="h-5 w-5 text-outline" />
          <span className="text-sm font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
};
