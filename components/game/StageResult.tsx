"use client";

import type { SingleBattleResult } from "@/lib/game/types";

export function StageResult({ result }: { result: SingleBattleResult }) {
  // TBD: single-mode result UI with retry/next flow
  return <div data-result={result.result} />;
}
