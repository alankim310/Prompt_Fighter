"use client";

import Image from "next/image";
import type { MultiRoundRecord } from "@/lib/game/types";

interface RoundResultProps {
  roundNumber: number;
  record: MultiRoundRecord;
  iAmPlayer1: boolean;
  myWins: number;
  oppWins: number;
}

export function RoundResult({
  roundNumber,
  record,
  iAmPlayer1,
  myWins,
  oppWins,
}: RoundResultProps) {
  const iWon =
    (iAmPlayer1 && record.winner === "player1") ||
    (!iAmPlayer1 && record.winner === "player2");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      {/* Arena background */}
      <div className="absolute inset-0">
        <Image
          src="/backgrounds/arena.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 p-6">
        {/* Result title + score — sits above the narrative box */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            Round {roundNumber} Result
          </div>

          <div
            className={`text-7xl font-black md:text-8xl ${
              iWon
                ? "bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            }`}
            style={{
              textShadow: iWon
                ? "0 0 60px rgba(245,158,11,0.4)"
                : "0 0 60px rgba(6,182,212,0.4)",
            }}
          >
            {iWon ? "VICTORY" : "DEFEAT"}
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-4xl font-black text-amber-400">
              {myWins}
            </span>
            <span className="text-lg font-bold text-white">—</span>
            <span className="font-mono text-4xl font-black text-cyan-400">
              {oppWins}
            </span>
          </div>
        </div>

        {/* Narrative box */}
        <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 backdrop-blur-sm">
          <p className="text-center text-sm leading-relaxed text-zinc-300">
            {record.narrative}
          </p>
        </div>
      </div>
    </div>
  );
}
