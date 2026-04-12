"use client";

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
}: RoundResultProps) {
  const iWon =
    (iAmPlayer1 && record.winner === "player1") ||
    (!iAmPlayer1 && record.winner === "player2");

  const myPrompt = iAmPlayer1 ? record.prompt1 : record.prompt2;
  const oppPrompt = iAmPlayer1 ? record.prompt2 : record.prompt1;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 bg-black p-6 text-white">
      <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
        Round {roundNumber} Result
      </div>

      <div
        className={`text-6xl font-black md:text-7xl ${
          iWon
            ? "text-green-400 drop-shadow-[0_0_40px_rgba(74,222,128,0.6)]"
            : "text-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,0.6)]"
        }`}
      >
        {iWon ? "VICTORY" : "DEFEAT"}
      </div>

      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
        <div
          className={`rounded-xl border bg-zinc-900 p-4 ${
            iWon ? "border-green-500/50" : "border-red-500/50"
          }`}
        >
          <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-zinc-400">
            Your Prompt
          </div>
          <p className="text-sm leading-relaxed text-zinc-200">
            {myPrompt || (
              <span className="italic text-zinc-500">(no prompt)</span>
            )}
          </p>
        </div>
        <div
          className={`rounded-xl border bg-zinc-900 p-4 ${
            !iWon ? "border-green-500/50" : "border-red-500/50"
          }`}
        >
          <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-zinc-400">
            Opponent Prompt
          </div>
          <p className="text-sm leading-relaxed text-zinc-200">
            {oppPrompt || (
              <span className="italic text-zinc-500">(no prompt)</span>
            )}
          </p>
        </div>
      </div>

      <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          Narrative
        </div>
        <p className="text-sm leading-relaxed text-zinc-200">
          {record.narrative}
        </p>
      </div>

      <p className="max-w-xl text-center text-xs italic leading-relaxed text-zinc-400">
        {record.reasoning}
      </p>
    </div>
  );
}
