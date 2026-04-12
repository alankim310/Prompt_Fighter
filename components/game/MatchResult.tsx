"use client";

import { useState } from "react";
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
  const [expandedRound, setExpandedRound] = useState<number | null>(null);

  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain();
    } else {
      router.push("/multi");
    }
  };

  const toggle = (roundNumber: number) => {
    setExpandedRound((prev) => (prev === roundNumber ? null : roundNumber));
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
              ? "bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(250,204,21,0.5)]"
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
            const isVoid = round.winner === "void";
            const iWonRound =
              (iAmPlayer1 && round.winner === "player1") ||
              (!iAmPlayer1 && round.winner === "player2");
            const myPrompt = iAmPlayer1 ? round.prompt1 : round.prompt2;
            const oppPrompt = iAmPlayer1 ? round.prompt2 : round.prompt1;
            const badgeLabel = isVoid ? "Void" : iWonRound ? "Win" : "Loss";
            const badgeClass = isVoid
              ? "bg-amber-500/20 text-amber-300"
              : iWonRound
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300";
            const isExpanded = expandedRound === round.roundNumber;

            return (
              <div
                key={round.roundNumber}
                className="rounded-lg border border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700"
              >
                <button
                  type="button"
                  onClick={() => toggle(round.roundNumber)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-700 font-mono text-sm font-bold">
                    {round.roundNumber}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-widest text-zinc-400">
                      {round.character1Id} vs {round.character2Id}
                    </div>
                    <div className="truncate text-sm text-zinc-300">
                      {round.narrative}
                    </div>
                  </div>
                  <div
                    className={`shrink-0 rounded px-3 py-1 text-xs font-bold uppercase ${badgeClass}`}
                  >
                    {badgeLabel}
                  </div>
                  <svg
                    className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="border-t border-zinc-800 px-4 pb-4 pt-3">
                    {!isVoid && (
                      <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div className="rounded border border-zinc-700 bg-zinc-950 p-3">
                          <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-400">
                            Your Prompt
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-zinc-300">
                            {myPrompt || (
                              <span className="italic text-zinc-500">(none)</span>
                            )}
                          </div>
                        </div>
                        <div className="rounded border border-zinc-700 bg-zinc-950 p-3">
                          <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-400">
                            Opponent Prompt
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-zinc-300">
                            {oppPrompt || (
                              <span className="italic text-zinc-500">(none)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="rounded border border-zinc-800 bg-zinc-950 p-3">
                      <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-500">
                        Narrative
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-300">
                        {round.narrative}
                      </p>
                    </div>
                  </div>
                )}
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
            className="flex-1 rounded-lg border border-zinc-700 bg-black px-6 py-3 font-bold uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-900"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
