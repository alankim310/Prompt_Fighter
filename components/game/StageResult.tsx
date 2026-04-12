"use client";

import type { SingleBattleResult } from "@/lib/game/types";

export function StageResult({
  result,
  primaryLabel,
  onPrimaryAction,
}: {
  result: SingleBattleResult;
  primaryLabel: string;
  onPrimaryAction: () => void;
}) {
  const cleared = result.result === 1;

  return (
    <section
      className={`rounded-[2rem] border p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur sm:p-6 ${
        cleared
          ? "border-emerald-300/25 bg-emerald-300/10"
          : "border-rose-300/25 bg-rose-300/10"
      }`}
      data-result={result.result}
    >
      <div
        className={`text-[10px] uppercase tracking-[0.35em] ${
          cleared ? "text-emerald-100/80" : "text-rose-100/80"
        }`}
      >
        Stage Result
      </div>
      <div
        className={`mt-3 text-2xl font-black ${
          cleared ? "text-emerald-50" : "text-rose-50"
        }`}
      >
        {cleared ? "Stage Cleared" : "Stage Failed"}
      </div>
      <p
        className={`mt-3 text-sm leading-7 sm:text-base ${
          cleared ? "text-emerald-50/90" : "text-rose-50/90"
        }`}
      >
        {result.narrative}
      </p>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onPrimaryAction}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            cleared
              ? "bg-emerald-300 text-emerald-950 hover:bg-emerald-200"
              : "bg-rose-300 text-rose-950 hover:bg-rose-200"
          }`}
        >
          {primaryLabel}
        </button>
      </div>
    </section>
  );
}
