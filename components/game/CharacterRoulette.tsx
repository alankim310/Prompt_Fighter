"use client";

import type { CharacterConfig } from "@/lib/game/types";

export function CharacterRoulette({
  roster,
  selectedId,
  onComplete,
}: {
  roster: CharacterConfig[];
  selectedId: string;
  onComplete?: () => void;
}) {
  // TBD: slot-machine style portrait cycle that lands on selectedId
  return (
    <div
      data-selected={selectedId}
      data-roster={roster.length}
      data-on-complete={onComplete ? "1" : "0"}
    />
  );
}
