"use client";

import type { SingleBattleResult } from "@/lib/game/types";

export function StageResult({ result }: { result: SingleBattleResult }) {
  // TBD: win/lose narrative + retry/next button
  return <div data-outcome={result.outcome} />;
}
