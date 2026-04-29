"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Mode = "login" | "register";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      mode === "login" ? { email, password } : { name, email, password };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setIsSubmitting(false);

    if (response.ok) {
      const body = await response.json();
      const destination = body?.user?.role === "AUTHOR" ? "/author" : "/settings";
      router.push(destination);
      router.refresh();
      return;
    }

    const errorBody = await response.json();
    setError(errorBody?.error || "Authentication failed.");
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[640px] overflow-hidden bg-slate-900 lg:block">
          <Image
            src="https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=1400&fit=crop"
            alt="Chronicle welcome"
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">
              Chronicle Account
            </p>
            <h1 className="mt-4 max-w-lg font-headline text-4xl font-bold leading-tight">
              Welcome back to your daily reading desk.
            </h1>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                mode === "register"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Create account
            </button>
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-container">
              {mode === "login" ? "Welcome back" : "Register account"}
            </p>
            <h2 className="mt-3 font-headline text-3xl font-bold text-slate-900">
              {mode === "login"
                ? "Sign in to your reader account"
                : "Create your Chronicle profile"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === "login"
                ? "Use your email and password to continue."
                : "Your profile information will be stored in the database immediately."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" ? (
              <label className="block text-sm font-semibold text-slate-700">
                Full name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </label>
            ) : null}

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

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary-container px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
