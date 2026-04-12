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
  myWins,
  oppWins,
}: RoundResultProps) {
  const iWon =
    (iAmPlayer1 && record.winner === "player1") ||
    (!iAmPlayer1 && record.winner === "player2");

  const myPrompt = iAmPlayer1 ? record.prompt1 : record.prompt2;
  const oppPrompt = iAmPlayer1 ? record.prompt2 : record.prompt1;
  const myScore = iAmPlayer1 ? record.player1_score : record.player2_score;
  const oppScore = iAmPlayer1 ? record.player2_score : record.player1_score;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-5 p-6 text-white">
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
            record.winner === "player1" ? "text-fuchsia-400" : "text-zinc-600"
          }
        >
          {record.player1_score}
        </span>
        <span className="text-zinc-700">:</span>
        <span
          className={
            record.winner === "player2" ? "text-cyan-400" : "text-zinc-600"
          }
        >
          {record.player2_score}
        </span>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
        <div
          className={`rounded-xl border p-4 ${
            iWon
              ? "border-fuchsia-500/50 bg-fuchsia-950/30"
              : "border-white/10 bg-zinc-950/80"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.25em] text-fuchsia-400">
              Your Prompt
            </div>
            <div className="font-mono text-xs font-bold text-fuchsia-300">
              {myScore}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-zinc-200">
            {myPrompt || <span className="italic text-zinc-500">(no prompt)</span>}
          </p>
        </div>
        <div
          className={`rounded-xl border p-4 ${
            !iWon
              ? "border-cyan-500/50 bg-cyan-950/30"
              : "border-white/10 bg-zinc-950/80"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-400">
              Opponent Prompt
            </div>
            <div className="font-mono text-xs font-bold text-cyan-300">
              {oppScore}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-zinc-200">
            {oppPrompt || <span className="italic text-zinc-500">(no prompt)</span>}
          </p>
        </div>
      </div>

      <div className="w-full rounded-xl border border-white/10 bg-zinc-950/80 p-5">
        <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-fuchsia-400">
          Narrative
        </div>
        <p className="text-sm leading-relaxed text-zinc-200">
          {record.narrative}
        </p>
        <div className="mt-4 mb-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          Judge reasoning
        </div>
        <p className="text-xs italic leading-relaxed text-zinc-400">
          {record.reasoning}
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
