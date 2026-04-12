import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MatchmakingQueue } from "@/components/game/MatchmakingQueue";

export default async function MultiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  // If user already has an active match, redirect to it instead of re-queuing
  const { data: activeMatch } = await supabase
    .from("matches")
    .select("id")
    .eq("status", "in_progress")
    .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (activeMatch) {
    redirect(`/multi/battle/${activeMatch.id}`);
  }

  return <MatchmakingQueue userId={user.id} />;
}
