import { redirect } from "next/navigation";
import { EndingScene } from "./EndingScene";
import { getSingleModeEndingImageUrl } from "@/lib/game/assets";
import { createClient } from "@/lib/supabase/server";

export default async function SingleEndingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: progress } = await supabase
    .from("game_progress")
    .select("completed")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!progress?.completed) {
    redirect("/single");
  }

  return <EndingScene imageUrl={getSingleModeEndingImageUrl()} />;
}
