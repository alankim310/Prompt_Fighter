import { redirect } from "next/navigation";
import { StageMap } from "@/components/game/StageMap";
import { getSubstories } from "@/lib/game/stages";
import type { GameProgress } from "@/lib/game/types";
import { createClient } from "@/lib/supabase/server";

export default async function SinglePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  let { data: progress } = await supabase
    .from("game_progress")
    .select("substory, stage, cleared_stages, completed")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!progress) {
    const { data: inserted, error } = await supabase
      .from("game_progress")
      .insert({
        user_id: user.id,
        substory: 1,
        stage: 1,
        cleared_stages: [],
        completed: false,
      })
      .select("substory, stage, cleared_stages, completed")
      .single();

    if (error) {
      throw new Error(`Failed to initialize game progress: ${error.message}`);
    }

    progress = inserted;
  }

  const normalizedProgress: GameProgress = {
    substory: progress.substory,
    stage: progress.stage,
    cleared_stages: Array.isArray(progress.cleared_stages)
      ? (progress.cleared_stages as string[])
      : [],
    completed: progress.completed,
  };

  return (
    <main className="min-h-screen bg-[#120914] text-white">
      <StageMap substories={getSubstories()} progress={normalizedProgress} />
    </main>
  );
}
