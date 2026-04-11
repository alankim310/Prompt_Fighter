import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { judgeMultiBattle } from "@/lib/claude/judge";
import type { MultiRoundRecord } from "@/lib/game/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { prompt1, prompt2, characterId, matchId, roundNumber } =
    (await request.json()) as {
      prompt1: string;
      prompt2: string;
      characterId: string;
      matchId: string;
      roundNumber: number;
    };

  if (!prompt1 || !prompt2 || !characterId || !matchId || !roundNumber) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  // TBD: build system prompt from character config (lib/claude/prompts-multi.ts)
  const system = "TBD: multi mode judge system prompt";
  const userContent = `Character: ${characterId}\nPlayer 1 prompt: ${prompt1}\nPlayer 2 prompt: ${prompt2}`;

  const result = await judgeMultiBattle({ system, userContent });

  const { data: match } = await supabase
    .from("matches")
    .select("rounds")
    .eq("id", matchId)
    .single();

  const existing: MultiRoundRecord[] = (match?.rounds as MultiRoundRecord[]) ?? [];
  const newRound: MultiRoundRecord = {
    roundNumber,
    characterId,
    ...result,
  };
  const rounds = [...existing, newRound];

  await supabase.from("matches").update({ rounds }).eq("id", matchId);

  return NextResponse.json(result);
}
