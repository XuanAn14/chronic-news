"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type PrefetchLinkProps = ComponentProps<typeof Link>;

export function PrefetchLink({
  href,
  onFocus,
  onMouseEnter,
  onTouchStart,
  ...props
}: PrefetchLinkProps) {
  const router = useRouter();

  function prefetch() {
    if (typeof href === "string") {
      router.prefetch(href);
    }
  }

  return (
    <Link
      href={href}
      onFocus={(event) => {
        prefetch();
        onFocus?.(event);
      }}
      onMouseEnter={(event) => {
        prefetch();
        onMouseEnter?.(event);
      }}
      onTouchStart={(event) => {
        prefetch();
        onTouchStart?.(event);
      }}
      {...props}
    />
  );
}
