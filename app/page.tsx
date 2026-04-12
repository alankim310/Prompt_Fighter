import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthForm } from "@/components/auth/AuthForm";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-8">
        <h1 className="text-5xl font-bold mb-2 tracking-tight">PromptFighter</h1>
        <p className="text-zinc-400 mb-8">Write prompts. Win battles.</p>
        <AuthForm />
      </main>
    );
  }

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-8 gap-8">
      <h1 className="text-5xl font-bold tracking-tight">Welcome to PromptFighter</h1>
      <p className="text-zinc-400">Choose your mode</p>
      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          href="/single/intro"
          className="px-10 py-6 rounded-lg bg-violet-600 hover:bg-violet-500 text-xl font-semibold"
        >
          Single Mode
        </Link>
        <Link
          href="/multi"
          className="px-10 py-6 rounded-lg bg-pink-600 hover:bg-pink-500 text-xl font-semibold"
        >
          Multi Mode
        </Link>
      </div>
      <form action={signOut}>
        <button className="text-sm text-zinc-500 hover:text-zinc-300 underline">
          Sign out
        </button>
      </form>
    </main>
  );
}
