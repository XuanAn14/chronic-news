"use client";

import { useEffect, useState } from "react";
import { Bookmark, MessageSquare, Share2, ThumbsUp } from "lucide-react";
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
  initialCommentList: CommentItem[];
  isLoggedIn: boolean;
}

export function ArticleInteractions({
  articleId,
  initialLikes,
  initialComments,
  initialViews,
  initialLiked,
  initialCommentList,
  isLoggedIn,
}: ArticleInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [liked, setLiked] = useState(initialLiked);
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState(initialCommentList);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLikes(initialLikes);
    setComments(initialComments);
    setLiked(initialLiked);
    setCommentList(initialCommentList);
  }, [initialLikes, initialComments, initialLiked, initialCommentList]);

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
      <div className="sticky top-32 flex flex-col items-center gap-4">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant shadow-sm transition-all hover:bg-primary hover:text-white">
          <Share2 className="h-5 w-5" />
        </button>
        <button
          onClick={handleLike}
          className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-all ${
            liked
              ? "bg-primary text-white"
              : "bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white"
          }`}
        >
          <ThumbsUp className="h-5 w-5" />
        </button>
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant shadow-sm transition-all hover:bg-primary hover:text-white">
          <MessageSquare className="h-5 w-5" />
        </button>
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant shadow-sm transition-all hover:bg-primary hover:text-white">
          <Bookmark className="h-5 w-5" />
        </button>
      </div>

      <div className="rounded-2xl border border-outline-variant bg-white p-6 shadow-sm">
        <div className="grid grid-cols-3 gap-4 border-b border-outline-variant pb-4 text-center">
          <div>
            <p className="text-2xl font-bold text-on-surface">{initialViews.toLocaleString()}</p>
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

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
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
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-container disabled:opacity-60"
              >
                {isSubmitting ? "Posting..." : "Post comment"}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {commentList.length ? (
              commentList.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
                  <div className="flex items-center justify-between gap-3">
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
