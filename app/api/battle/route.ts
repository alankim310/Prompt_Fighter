import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { judgeSingleBattle } from "@/lib/claude/judge";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { prompt, stageId } = (await request.json()) as {
    prompt: string;
    stageId: string;
  };

  if (!prompt || !stageId) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  // TBD: build system prompt from stage definition (lib/claude/prompts-single.ts)
  const system = "TBD: single mode judge system prompt";
  const userContent = `Stage: ${stageId}\nPlayer prompt: ${prompt}`;

  const result = await judgeSingleBattle({ system, userContent });
  return NextResponse.json(result);
}
