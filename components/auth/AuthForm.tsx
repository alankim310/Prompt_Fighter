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

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <form onSubmit={handleEmail} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-3 rounded-md bg-zinc-900 border border-zinc-800 focus:border-violet-500 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded-md bg-zinc-900 border border-zinc-800 focus:border-violet-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-3 rounded-md bg-violet-600 hover:bg-violet-500 font-semibold disabled:opacity-50"
        >
          {loading ? "..." : mode === "signin" ? "Sign in" : "Sign up"}
        </button>
      </form>
      <button
        onClick={handleGoogle}
        className="px-4 py-3 rounded-md bg-white text-black font-semibold hover:bg-zinc-200"
      >
        Continue with Google
      </button>
      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="text-sm text-zinc-400 hover:text-zinc-200"
      >
        {mode === "signin"
          ? "Need an account? Sign up"
          : "Have an account? Sign in"}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
