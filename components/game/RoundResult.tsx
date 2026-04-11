"use client";

import type { MultiBattleResult } from "@/lib/game/types";

interface RoundResultProps {
  roundNumber: number;
  result: MultiBattleResult;
  iAmPlayer1: boolean;
  myWins: number;
  oppWins: number;
}

export function RoundResult({
  roundNumber,
  result,
  iAmPlayer1,
  myWins,
  oppWins,
}: RoundResultProps) {
  const iWon =
    (iAmPlayer1 && result.winner === "player1") ||
    (!iAmPlayer1 && result.winner === "player2");

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 p-6 text-white">
      <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
        Round {roundNumber} Result
      </div>

      <div
        className={`text-6xl font-black md:text-7xl ${
          iWon
            ? "bg-gradient-to-b from-yellow-300 to-fuchsia-500 bg-clip-text text-transparent"
            : "text-zinc-500"
        }`}
      >
        {iWon ? "VICTORY" : "DEFEAT"}
      </div>

      <div className="flex items-center gap-6 font-mono text-3xl font-bold">
        <span
          className={
            result.winner === "player1" ? "text-fuchsia-400" : "text-zinc-600"
          }
        >
          {result.player1_score}
        </span>
        <span className="text-zinc-700">:</span>
        <span
          className={
            result.winner === "player2" ? "text-cyan-400" : "text-zinc-600"
          }
        >
          {result.player2_score}
        </span>
      </div>

      <div className="w-full rounded-xl border border-white/10 bg-zinc-950/80 p-5">
        <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-fuchsia-400">
          Narrative
        </div>
        <p className="text-sm leading-relaxed text-zinc-200">
          {result.narrative}
        </p>
        <div className="mt-4 mb-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          Judge reasoning
        </div>
        <p className="text-xs italic leading-relaxed text-zinc-400">
          {result.reasoning}
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-black/60 px-6 py-3">
        <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
          Match Score
        </div>
        <div className="font-mono text-2xl font-black">
          <span className="text-fuchsia-400">{myWins}</span>
          <span className="mx-2 text-zinc-600">—</span>
          <span className="text-cyan-400">{oppWins}</span>
        </div>
      </div>
    </div>
  );
}
