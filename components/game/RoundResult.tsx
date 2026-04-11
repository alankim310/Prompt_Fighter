"use client";

import type { MultiBattleResult } from "@/lib/game/types";

export function RoundResult({ result }: { result: MultiBattleResult }) {
  // TBD: winner reveal + narrative
  return <div data-winner={result.winner} />;
}
