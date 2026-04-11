"use client";

import type { Stage } from "@/lib/game/types";

export function BattleScreen({ stage }: { stage: Stage }) {
  // TBD: single mode battle UI (background + hero overlay + prompt input)
  return <div data-stage={stage.id} />;
}
