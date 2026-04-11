import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MultiBattlePage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { matchId } = await params;

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold">Match {matchId}</h1>
      <p className="text-zinc-400 mt-2">TBD: PvP battle screen</p>
    </main>
  );
}
