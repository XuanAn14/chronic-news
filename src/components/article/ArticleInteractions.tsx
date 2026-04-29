"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, Check, MessageSquare, Share2, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommentItem {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface ArticleInteractionsProps {
  articleId: string;
  initialLikes: number;
  initialComments: number;
  initialViews: number;
  initialLiked: boolean;
  initialSaved: boolean;
  initialCommentList: CommentItem[];
  isLoggedIn: boolean;
}

function actionButtonClass(active: boolean, tone: "blue" | "amber" | "emerald" = "blue") {
  if (!active) {
    return "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary hover:bg-primary hover:text-white";
  }

  if (tone === "amber") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (tone === "emerald") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-primary bg-primary text-white";
}

export function ArticleInteractions({
  articleId,
  initialLikes,
  initialComments,
  initialViews,
  initialLiked,
  initialSaved,
  initialCommentList,
  isLoggedIn,
}: ArticleInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [views, setViews] = useState(initialViews);
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [shared, setShared] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState(initialCommentList);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const discussionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const actionSummary = useMemo(
    () => [
      {
        key: "share",
        label: shared ? "Copied" : "Share",
        icon: shared ? Check : Share2,
        active: shared,
        tone: "emerald" as const,
      },
      {
        key: "like",
        label: liked ? "Liked" : "Like",
        icon: ThumbsUp,
        active: liked,
        tone: "blue" as const,
      },
      {
        key: "comment",
        label: "Comment",
        icon: MessageSquare,
        active: false,
        tone: "blue" as const,
      },
      {
        key: "save",
        label: saved ? "Saved" : "Save",
        icon: Bookmark,
        active: saved,
        tone: "amber" as const,
      },
    ],
    [liked, saved, shared],
  );

  useEffect(() => {
    setLikes(initialLikes);
    setComments(initialComments);
    setViews(initialViews);
    setLiked(initialLiked);
    setSaved(initialSaved);
    setCommentList(initialCommentList);
  }, [initialLikes, initialComments, initialLiked, initialSaved, initialCommentList, initialViews]);

  useEffect(() => {
    const sessionKey = `chronicle:viewed:${articleId}`;

    if (typeof window === "undefined" || sessionStorage.getItem(sessionKey)) {
      return;
    }

    sessionStorage.setItem(sessionKey, "1");

    const run = async () => {
      try {
        const response = await fetch(`/api/articles/${articleId}/view`, {
          method: "POST",
          keepalive: true,
        });

        if (!response.ok) {
          return;
        }

        const body = await response.json();
        if (typeof body?.viewsCount === "number") {
          setViews(body.viewsCount);
        } else {
          setViews((current) => current + 1);
        }
      } catch {
        setViews((current) => current + 1);
      }
    };

    if ("requestIdleCallback" in globalThis) {
      const idleId = globalThis.requestIdleCallback(() => {
        void run();
      });

      return () => {
        globalThis.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(() => {
      void run();
    }, 250);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [articleId]);

  async function handleLike() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const response = await fetch(`/api/articles/${articleId}/like`, {
      method: "POST",
    });

    if (!response.ok) {
      return;
    }

    const body = await response.json();
    setLiked(body.liked);
    setLikes(body.likesCount);
    router.refresh();
  }

  async function handleSave() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const response = await fetch(`/api/articles/${articleId}/save`, {
      method: "POST",
    });

    if (!response.ok) {
      return;
    }

    const body = await response.json();
    setSaved(body.saved);
    router.refresh();
  }

  async function handleShare() {
    if (shared) {
      setShared(false);
      return;
    }

    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
      setShared(true);
    } catch {
      setShared(false);
    }
  }

  function focusDiscussion() {
    discussionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleCommentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    setIsSubmitting(true);

    const response = await fetch(`/api/articles/${articleId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: commentText }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      return;
    }

    setCommentText("");
    setComments((value) => value + 1);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-outline-variant bg-white p-4 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 gap-4 border-b border-outline-variant pb-4 text-center sm:grid-cols-3">
          <div>
            <p className="text-2xl font-bold text-on-surface">{views.toLocaleString()}</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Views
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">{likes.toLocaleString()}</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Likes
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">{comments.toLocaleString()}</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Comments
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actionSummary.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.key}
                type="button"
                onClick={() => {
                  if (action.key === "share") {
                    void handleShare();
                  }
                  if (action.key === "like") {
                    void handleLike();
                  }
                  if (action.key === "comment") {
                    focusDiscussion();
                  }
                  if (action.key === "save") {
                    void handleSave();
                  }
                }}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${actionButtonClass(
                  action.active,
                  action.tone,
                )}`}
              >
                <Icon className="h-4 w-4" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>

        <div ref={discussionRef} className="mt-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-headline text-xl font-bold text-on-surface">Discussion</h3>
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              {comments} items
            </span>
          </div>

          <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              rows={3}
              placeholder={isLoggedIn ? "Add your comment..." : "Sign in to comment"}
              className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <div className="flex justify-stretch sm:justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-container disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? "Posting..." : "Post comment"}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {commentList.length ? (
              commentList.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl border border-outline-variant bg-surface-container-low p-4"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <p className="font-semibold text-on-surface">{comment.authorName}</p>
                    <p className="text-xs text-on-surface-variant">
                      {new Date(comment.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">{comment.content}</p>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant">
                No comments yet. Start the discussion on this article.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
