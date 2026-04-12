import { notFound, redirect } from "next/navigation";
import { BattleScreen } from "@/components/game/BattleScreen";
import {
  getStageBySubstoryAndStageNumber,
  getSubstoryById,
} from "@/lib/game/stages";
import type { GameProgress } from "@/lib/game/types";
import { createClient } from "@/lib/supabase/server";

export default async function PlayStagePage({
  params,
}: {
  params: Promise<{ substoryId: string; stageId: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { substoryId, stageId } = await params;
  const parsedSubstoryId = Number(substoryId);
  const parsedStageId = Number(stageId);

  if (Number.isNaN(parsedSubstoryId) || Number.isNaN(parsedStageId)) {
    notFound();
  }

  const stage = getStageBySubstoryAndStageNumber(parsedSubstoryId, parsedStageId);
  const substory = getSubstoryById(parsedSubstoryId);

  if (!stage || !substory) {
    notFound();
  }

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
    <main className="h-screen overflow-hidden bg-black text-white">
      <BattleScreen stage={stage} substory={substory} progress={normalizedProgress} />
    </main>
  );
}
