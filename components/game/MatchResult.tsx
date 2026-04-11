"use client";

import type { MultiRoundRecord } from "@/lib/game/types";

export function MatchResult({
  rounds,
  winnerId,
}: {
  rounds: MultiRoundRecord[];
  winnerId: string | null;
}) {
  // TBD: final scoreboard
  return <div data-rounds={rounds.length} data-winner={winnerId ?? ""} />;
}
