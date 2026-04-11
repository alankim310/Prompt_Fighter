"use client";

import { useRouter } from "next/navigation";
import type { MultiRoundRecord } from "@/lib/game/types";

interface MatchResultProps {
  iWon: boolean;
  iAmPlayer1: boolean;
  rounds: MultiRoundRecord[];
  onPlayAgain?: () => void;
}

export function MatchResult({
  iWon,
  iAmPlayer1,
  rounds,
  onPlayAgain,
}: MatchResultProps) {
  const router = useRouter();

  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain();
    } else {
      router.push("/multi");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 p-6">
        <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Match Complete
        </div>

        <div
          className={`text-7xl font-black md:text-8xl ${
            iWon
              ? "bg-gradient-to-b from-yellow-300 via-fuchsia-400 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(217,70,239,0.5)]"
              : "text-zinc-600"
          }`}
        >
          {iWon ? "CHAMPION" : "DEFEATED"}
        </div>

        <div className="w-full space-y-2">
          <div className="mb-3 text-center text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            Round Summary
          </div>
          {rounds.map((round) => {
            const iWonRound =
              (iAmPlayer1 && round.winner === "player1") ||
              (!iAmPlayer1 && round.winner === "player2");
            return (
              <div
                key={round.roundNumber}
                className="flex items-center gap-4 rounded-lg border border-white/10 bg-zinc-950/80 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 font-mono text-sm font-bold">
                  {round.roundNumber}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs uppercase tracking-widest text-zinc-400">
                    {round.characterId}
                  </div>
                  <div className="truncate text-sm text-zinc-300">
                    {round.narrative}
                  </div>
                </div>
                <div
                  className={`shrink-0 rounded px-3 py-1 text-xs font-bold uppercase ${
                    iWonRound
                      ? "bg-fuchsia-500/20 text-fuchsia-300"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {iWonRound ? "Win" : "Loss"}
                </div>
                <div className="shrink-0 font-mono text-sm text-zinc-400">
                  {round.player1_score}-{round.player2_score}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex w-full gap-3">
          <button
            onClick={handlePlayAgain}
            className="flex-1 rounded-lg bg-fuchsia-600 px-6 py-3 font-bold uppercase tracking-wider text-white transition hover:bg-fuchsia-500"
          >
            Play Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 rounded-lg border border-white/20 bg-black/40 px-6 py-3 font-bold uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-900"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
