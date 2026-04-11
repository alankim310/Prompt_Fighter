"use client";

import type { CharacterConfig } from "@/lib/game/types";

export function MultiRound({
  character,
  roundNumber,
}: {
  character: CharacterConfig;
  roundNumber: number;
}) {
  // TBD: character display + dual prompt input + submit broadcast
  return <div data-character={character.id} data-round={roundNumber} />;
}
