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
              ? "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          }`}
          style={
            iWon
              ? { textShadow: "0 0 40px rgba(245,158,11,0.3)" }
              : undefined
          }
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
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-red-500/20 text-red-300";
            const isExpanded = expandedRound === round.roundNumber;

            return (
              <div
                key={round.roundNumber}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-200 hover:border-zinc-700"
              >
                <button
                  type="button"
                  onClick={() => toggle(round.roundNumber)}
                  className="flex w-full items-center gap-4 p-4 text-left cursor-pointer"
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
                    className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
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
                        <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-3">
                          <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-400">
                            Your Prompt
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-zinc-300">
                            {myPrompt || (
                              <span className="italic text-zinc-500">(none)</span>
                            )}
                          </div>
                        </div>
                        <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-3">
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
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
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
            className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 font-bold uppercase tracking-wider text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            Play Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold uppercase tracking-wider text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
