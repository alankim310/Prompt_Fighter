import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { judgeSingleBattle } from "@/lib/claude/judge";
import {
  buildSingleSystemPrompt,
  buildSingleUserContent,
} from "@/lib/claude/prompts-single";
import { getStageById } from "@/lib/game/stages";

const MULTIPLAYER_KEYS = [
  "prompt1",
  "prompt2",
  "characterId",
  "character1Id",
  "character2Id",
  "matchId",
  "roundNumber",
] as const;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Single-mode only. Multiplayer requests must use /api/multi-battle.
  const body = (await request.json()) as Record<string, unknown>;

  if (
    MULTIPLAYER_KEYS.some((key) => Object.prototype.hasOwnProperty.call(body, key))
  ) {
    return NextResponse.json(
      { error: "single mode endpoint does not accept multiplayer payloads" },
      { status: 400 },
    );
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const stageId = typeof body.stageId === "string" ? body.stageId : "";

  if (!prompt || !stageId) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const stage = getStageById(stageId);
  if (!stage) {
    return NextResponse.json({ error: "unknown stage" }, { status: 400 });
  }

  const system = buildSingleSystemPrompt(stage);
  const userContent = buildSingleUserContent({ stage, prompt });

  const result = await judgeSingleBattle({ system, userContent });
  return NextResponse.json(result);
}
