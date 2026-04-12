import Image from "next/image";
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
      <main className="relative flex min-h-screen flex-col items-center justify-center text-white p-8">
        <div className="fixed inset-0 -z-10">
          <Image
            src="/backgrounds/global.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <Image
          src="/logo.png"
          alt="PromptFighter"
          width={448}
          height={120}
          className="mb-8 max-w-md w-full h-auto"
          priority
        />
        <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 backdrop-blur-xl">
          <AuthForm />
        </div>
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
    <main className="relative flex min-h-screen flex-col items-center justify-center text-white p-8 gap-4">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/backgrounds/global.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <Image
        src="/logo.png"
        alt="PromptFighter"
        width={1200}
        height={321}
        className="max-w-5xl w-full h-auto"
        priority
      />
      <p className="text-xl font-semibold tracking-wide text-zinc-200">Choose your mode</p>
      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          href="/single/intro"
          className="group flex flex-col items-center gap-3 rounded-2xl border border-amber-500/30 bg-zinc-950/90 px-12 py-8 backdrop-blur-sm transition-all duration-200 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:scale-105 cursor-pointer"
        >
          <span className="text-4xl">⚔️</span>
          <span className="text-xl font-bold text-zinc-50">Single Mode</span>
          <span className="text-sm text-zinc-400">Story Campaign</span>
        </Link>
        <Link
          href="/multi"
          className="group flex flex-col items-center gap-3 rounded-2xl border border-cyan-500/30 bg-zinc-950/90 px-12 py-8 backdrop-blur-sm transition-all duration-200 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:scale-105 cursor-pointer"
        >
          <span className="text-4xl">🎮</span>
          <span className="text-xl font-bold text-zinc-50">Multi Mode</span>
          <span className="text-sm text-zinc-400">1v1 PvP</span>
        </Link>
      </div>
      <form action={signOut}>
        <button className="text-base text-zinc-300 hover:text-zinc-100 transition-all duration-200 cursor-pointer">
          Sign out
        </button>
      </form>
    </main>
  );
}
