"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/utils";

interface SaveArticleButtonProps {
  articleId: string;
  initialSaved?: boolean;
  showLabel?: boolean;
  className?: string;
  activeClassName?: string;
  label?: string;
  savedLabel?: string;
}

export function SaveArticleButton({
  articleId,
  initialSaved = false,
  showLabel = false,
  className,
  activeClassName,
  label = "Read Later",
  savedLabel = "Saved",
}: SaveArticleButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSave() {
    if (pending) {
      return;
    }

    setPending(true);

    const response = await fetch(`/api/articles/${articleId}/save`, {
      method: "POST",
    }).catch(() => null);

    setPending(false);

    if (response?.status === 401) {
      router.push("/login");
      return;
    }

    if (!response?.ok) {
      return;
    }

    const body = await response.json().catch(() => ({}));
    setSaved(Boolean(body?.saved));
    router.refresh();
  }

  const text = saved ? savedLabel : label;

  return (
    <button
      type="button"
      disabled={pending}
      aria-pressed={saved}
      aria-label={text}
      title={text}
      onClick={() => void handleSave()}
      className={cn(className, saved && activeClassName, pending && "opacity-60")}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
      {showLabel ? <span className="font-semibold">{text}</span> : null}
    </button>
  );
}
