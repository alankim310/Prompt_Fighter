import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MatchmakingQueue } from "@/components/game/MatchmakingQueue";

export default async function MultiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  return <MatchmakingQueue userId={user.id} />;
}
