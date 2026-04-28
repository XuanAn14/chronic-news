"use client";

import type { ReactNode } from "react";

interface AdminLogoutButtonProps {
  className?: string;
  icon?: ReactNode;
  label?: string;
}

export function AdminLogoutButton({
  className,
  icon,
  label = "Log out",
}: AdminLogoutButtonProps) {
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        className ??
        "inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      }
    >
      {icon ? <span className="mr-2">{icon}</span> : null}
      {label}
    </button>
  );
}
