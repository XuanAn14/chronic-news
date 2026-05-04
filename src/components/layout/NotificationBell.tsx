"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  href: string;
  label: string;
  createdAt: string;
}

interface NotificationBellProps {
  className?: string;
  iconClassName?: string;
}

export function NotificationBell({ className, iconClassName }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [emptyMessage, setEmptyMessage] = useState("No notifications yet.");
  const rootRef = useRef<HTMLDivElement>(null);

  async function loadNotifications() {
    setLoading(true);

    const response = await fetch("/api/notifications", {
      method: "GET",
      cache: "no-store",
    }).catch(() => null);

    setLoading(false);

    if (!response || !response.ok) {
      setItems([]);
      setEmptyMessage("Could not load notifications.");
      setHasLoaded(true);
      return;
    }

    const body = await response.json().catch(() => ({}));
    setItems(Array.isArray(body?.items) ? body.items : []);
    setEmptyMessage(body?.emptyMessage || "No notifications yet.");
    setHasLoaded(true);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          const nextOpen = !open;
          setOpen(nextOpen);
          if (nextOpen && !hasLoaded) {
            void loadNotifications();
          }
        }}
        className={
          className ?? "relative rounded-full p-2 transition-colors hover:bg-surface-container"
        }
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className={iconClassName ?? "h-4.5 w-4.5 sm:h-5 sm:w-5"} />
        {items.length ? (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
        ) : null}
      </button>

      {open ? (
        <div className="fixed left-3 right-3 top-16 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[24rem]">
          <div className="border-b border-slate-200 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            <p className="mt-1 text-xs text-slate-500">Fresh signals based on your activity.</p>
          </div>
          <div className="max-h-[min(24rem,calc(100vh-5.5rem))] overflow-y-auto sm:max-h-[28rem]">
            {loading ? (
              <div className="px-4 py-6 text-sm text-slate-500">Loading notifications...</div>
            ) : items.length ? (
              items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-slate-100 px-4 py-4 transition-colors last:border-b-0 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                      {item.label}
                    </p>
                    <p className="shrink-0 text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
                </Link>
              ))
            ) : (
              <div className="px-4 py-6 text-sm text-slate-500">{emptyMessage}</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
