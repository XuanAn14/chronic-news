"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const [email, setEmail] = useState("admin@chronic.news");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      router.push("/admin/dashboard");
      router.refresh();
      return;
    }

    const body = await response.json();
    setError(body?.error || "Invalid credentials. Please try again.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between bg-slate-900 p-10 text-white">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">
              CMS Console
            </p>
            <h1 className="mt-6 font-headline text-5xl font-bold leading-tight">
              Editorial workflow for Chronicle.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Sign in with the seeded admin account to access the dashboard, publish posts,
              and manage article status through the Prisma-backed CMS.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Default admin
            </p>
            <p className="mt-3 text-lg font-semibold">admin@chronic.news</p>
            <p className="mt-1 text-sm text-slate-400">Password comes from `ADMIN_PASSWORD` in `.env`.</p>
          </div>
        </div>

        <div className="p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-container">
              Admin Sign In
            </p>
            <h2 className="mt-4 font-headline text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Use your admin account to access the CMS interface from `code.html`.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block text-sm font-semibold text-slate-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary-container px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
