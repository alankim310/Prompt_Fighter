import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { judgeMultiBattle } from "@/lib/claude/judge";
import { getCharacter } from "@/lib/claude/characters";
import {
  buildMultiSystemPrompt,
  buildMultiUserContent,
} from "@/lib/claude/prompts-multi";
import type { MultiRoundRecord } from "@/lib/game/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { prompt1, prompt2, character1Id, character2Id, matchId, roundNumber } =
    (await request.json()) as {
      prompt1: string;
      prompt2: string;
      character1Id: string;
      character2Id: string;
      matchId: string;
      roundNumber: number;
    };

  if (
    !prompt1 ||
    !prompt2 ||
    !character1Id ||
    !character2Id ||
    !matchId ||
    !roundNumber
  ) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const character1 = getCharacter(character1Id);
  const character2 = getCharacter(character2Id);
  if (!character1 || !character2) {
    return NextResponse.json({ error: "unknown character" }, { status: 400 });
  }

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("player1_id, player2_id, rounds, status")
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    return NextResponse.json({ error: "match not found" }, { status: 404 });
  }

  if (user.id !== match.player1_id && user.id !== match.player2_id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const system = buildMultiSystemPrompt(character1, character2);
  const userContent = buildMultiUserContent({ prompt1, prompt2 });
  const result = await judgeMultiBattle({ system, userContent });

  const existing: MultiRoundRecord[] =
    (match.rounds as MultiRoundRecord[] | null) ?? [];
  const newRound: MultiRoundRecord = {
    roundNumber,
    character1Id,
    character2Id,
    prompt1,
    prompt2,
    ...result,
  };
  const rounds = [...existing, newRound];

  let p1Wins = 0;
  let p2Wins = 0;
  for (const r of rounds) {
    if (r.winner === "player1") p1Wins++;
    else if (r.winner === "player2") p2Wins++;
  }

  const update: {
    rounds: MultiRoundRecord[];
    winner_id?: string;
    status?: string;
  } = { rounds };

  if (p1Wins >= 2) {
    update.winner_id = match.player1_id as string;
    update.status = "completed";
  } else if (p2Wins >= 2) {
    update.winner_id = match.player2_id as string;
    update.status = "completed";
  }

  const { error: updateError } = await supabase
    .from("matches")
    .update(update)
    .eq("id", matchId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ record: newRound });
}
