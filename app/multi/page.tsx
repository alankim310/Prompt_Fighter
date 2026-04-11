import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MultiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold">Multi Mode — Matchmaking</h1>
      <p className="text-zinc-400 mt-2">TBD: matchmaking queue</p>
    </main>
  );
}
