"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthForm() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fn =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });
    const { error } = await fn;
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (mode === "signup") {
      setEmailSent(true);
      return;
    }
    router.refresh();
  }

  async function handleGoogle() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  }

  if (emailSent) {
    return (
      <div className="w-full max-w-sm flex flex-col items-center gap-4 text-center">
        <div className="text-4xl">✉️</div>
        <h2 className="text-xl font-bold text-white">Check your email</h2>
        <p className="text-sm text-zinc-400">
          We sent a confirmation link to{" "}
          <span className="text-amber-400">{email}</span>.
          <br />
          Click the link to activate your account.
        </p>
        <button
          onClick={() => {
            setEmailSent(false);
            setMode("signin");
          }}
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-all duration-200 cursor-pointer"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <form onSubmit={handleEmail} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 focus:outline-none transition-all duration-200"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all duration-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-white hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        >
          {loading ? "..." : mode === "signin" ? "Sign in" : "Sign up"}
        </button>
      </form>
      <button
        onClick={handleGoogle}
        className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
      >
        Continue with Google
      </button>
      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="text-sm text-zinc-400 hover:text-zinc-200 transition-all duration-200 cursor-pointer"
      >
        {mode === "signin"
          ? "Need an account? Sign up"
          : "Have an account? Sign in"}
      </button>
      {error && <p className="text-sm text-red-400 text-center">{error}</p>}
    </div>
  );
}
