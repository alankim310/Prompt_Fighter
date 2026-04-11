"use client";

import type { Stage } from "@/lib/game/types";

export function StageMap({
  stages,
  clearedStages,
}: {
  stages: Stage[];
  clearedStages: string[];
}) {
  // TBD: visual stage map with cleared markers
  return <div data-stages={stages.length} data-cleared={clearedStages.length} />;
}
