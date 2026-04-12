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

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-6">
        {/* Single card containing everything */}
        <div className="flex w-full max-w-lg flex-col items-center gap-5 rounded-3xl bg-zinc-950/80 px-8 py-10 backdrop-blur-sm">
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

          <div className="mt-2 w-full border-t border-zinc-800 pt-5">
            <p className="text-center text-sm leading-relaxed text-zinc-300">
              {record.narrative}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
