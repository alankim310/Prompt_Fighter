"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getHighestUnlockedSubstory,
  getStagesForSubstory,
  isStageUnlocked,
  isSubstoryUnlocked,
} from "@/lib/game/stages";
import type { GameProgress, Stage, Substory } from "@/lib/game/types";

const TYPE_STYLES: Record<Stage["type"], string> = {
  battle: "bg-rose-500/20 text-rose-200 border-rose-400/40",
  obstacle: "bg-amber-500/20 text-amber-100 border-amber-300/40",
  social: "bg-sky-500/20 text-sky-100 border-sky-300/40",
  puzzle: "bg-violet-500/20 text-violet-100 border-violet-300/40",
  boss: "bg-fuchsia-500/20 text-fuchsia-100 border-fuchsia-300/40",
};

function formatStageNumber(stageNumber: number): string {
  return stageNumber.toString().padStart(2, "0");
}

export function StageMap({
  stages,
  substories,
  progress,
}: {
  stages: Stage[];
  substories: Substory[];
  progress: GameProgress;
}) {
  const highestUnlockedSubstory = getHighestUnlockedSubstory(progress);
  const initialSubstory =
    substories.find((substory) => substory.id === highestUnlockedSubstory)?.id ??
    substories[0]?.id ??
    1;
  const [selectedSubstoryId, setSelectedSubstoryId] = useState(initialSubstory);

  const stagesBySubstory = useMemo(() => {
    return substories.map((substory) => ({
      substory,
      stages: getStagesForSubstory(substory.id),
      unlocked: isSubstoryUnlocked(progress, substory.id),
      cleared: getStagesForSubstory(substory.id).every((stage) =>
        progress.cleared_stages.includes(stage.id),
      ),
    }));
  }, [progress, substories]);

  const selectedSubstoryEntry =
    stagesBySubstory.find(({ substory }) => substory.id === selectedSubstoryId) ??
    stagesBySubstory[0];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,214,94,0.12),_transparent_30%),radial-gradient(circle_at_20%_20%,_rgba(52,211,153,0.12),_transparent_25%),radial-gradient(circle_at_80%_35%,_rgba(244,114,182,0.12),_transparent_28%),linear-gradient(180deg,_#120914_0%,_#1a1027_52%,_#100611_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.35em] text-amber-200/70">
                Single Mode
              </div>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Story Overworld
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">
                Travel the campaign like a classic world map. Cleared stories stay
                replayable, the next route unlocks in order, and later regions stay
                sealed until you reach them.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right">
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                Progress
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                {progress.cleared_stages.length}
                <span className="ml-2 text-sm font-medium text-zinc-400">
                  / {stages.length} cleared
                </span>
              </div>
              <div className="mt-2 text-sm text-zinc-400">
                Current unlock: Story {highestUnlockedSubstory}
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[2rem] border border-white/10 bg-black/25 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                World Path
              </div>
              <div className="mt-1 text-lg font-bold text-white">
                Move forward or revisit earlier stories
              </div>
            </div>
            <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Mario-style story select
            </div>
          </div>

          <div className="relative overflow-x-auto pb-2">
            <div className="relative flex min-w-[880px] items-center justify-between gap-6 px-4 py-8">
              <div className="absolute left-10 right-10 top-1/2 h-2 -translate-y-1/2 rounded-full bg-white/10" />
              <div
                className="absolute left-10 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-300 via-yellow-300 to-fuchsia-300 transition-all"
                style={{
                  width: `${Math.max(
                    0,
                    ((highestUnlockedSubstory - 1) / Math.max(substories.length - 1, 1)) *
                      100,
                  )}%`,
                }}
              />

              {stagesBySubstory.map(({ substory, unlocked, cleared }, index) => {
                const selected = substory.id === selectedSubstoryId;
                const statusLabel = cleared
                  ? "Cleared"
                  : unlocked
                    ? "Open"
                    : "Locked";

                return (
                  <button
                    key={substory.id}
                    type="button"
                    onClick={() => unlocked && setSelectedSubstoryId(substory.id)}
                    disabled={!unlocked}
                    className={`group relative z-10 flex w-44 shrink-0 flex-col items-center text-center transition ${
                      unlocked ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                  >
                    <div
                      className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full border text-2xl font-black shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition ${
                        cleared
                          ? "border-emerald-300/80 bg-emerald-400/20 text-emerald-100"
                          : unlocked
                            ? "border-yellow-300/80 bg-yellow-300/20 text-yellow-100"
                            : "border-white/10 bg-white/5 text-zinc-600"
                      } ${selected ? "scale-110 ring-4 ring-white/15" : "group-hover:scale-105"}`}
                    >
                      {unlocked ? index + 1 : "?"}
                    </div>

                    <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                      {statusLabel}
                    </div>
                    <div className="mt-2 text-lg font-black text-white">
                      {substory.title}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.25em] text-zinc-400">
                      {substory.theme}
                    </div>
                    <div className="mt-2 max-w-[13rem] text-xs leading-5 text-zinc-500">
                      {unlocked ? substory.description : substory.unlockLabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {selectedSubstoryEntry && (
          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                    Story {selectedSubstoryEntry.substory.id}
                  </div>
                  <h2 className="mt-2 text-3xl font-black text-white">
                    {selectedSubstoryEntry.substory.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">
                    {selectedSubstoryEntry.substory.description}
                  </p>
                </div>
                <div
                  className={`rounded-2xl bg-gradient-to-r px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-slate-950 ${selectedSubstoryEntry.substory.accentClassName}`}
                >
                  {selectedSubstoryEntry.substory.theme}
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4 overflow-x-auto pb-2">
                {selectedSubstoryEntry.stages.map((stage, index) => {
                  const unlocked = isStageUnlocked(progress, stage);
                  const cleared = progress.cleared_stages.includes(stage.id);
                  const isCurrent =
                    !cleared &&
                    progress.substory === stage.substoryId &&
                    progress.stage === stage.stageNumber &&
                    !progress.completed;

                  return (
                    <div key={stage.id} className="flex items-center gap-4">
                      <div className="flex shrink-0 flex-col items-center gap-3">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-sm font-black transition ${
                            cleared
                              ? "border-emerald-300 bg-emerald-400/20 text-emerald-100"
                              : unlocked
                                ? "border-yellow-300 bg-yellow-300/15 text-yellow-100"
                                : "border-white/10 bg-white/5 text-zinc-600"
                          } ${isCurrent ? "ring-4 ring-fuchsia-400/30" : ""}`}
                        >
                          {unlocked ? formatStageNumber(stage.stageNumber) : "??"}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                          {cleared ? "Cleared" : isCurrent ? "Next" : unlocked ? "Open" : "Locked"}
                        </div>
                      </div>
                      {index < selectedSubstoryEntry.stages.length - 1 && (
                        <div className="h-1 w-12 shrink-0 rounded-full bg-white/10 sm:w-20" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur">
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Stage Select
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                Choose a stop on this route
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Earlier cleared stages stay available for replay. The next uncleared
                stage opens in order, and later ones remain locked until you reach
                them.
              </p>

              <div className="mt-6 space-y-3">
                {selectedSubstoryEntry.stages.map((stage) => {
                  const unlocked = isStageUnlocked(progress, stage);
                  const cleared = progress.cleared_stages.includes(stage.id);

                  return (
                    <div
                      key={stage.id}
                      className={`rounded-2xl border p-4 transition ${
                        unlocked
                          ? "border-white/10 bg-white/[0.03]"
                          : "border-white/5 bg-white/[0.02] opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                            Stage {formatStageNumber(stage.stageNumber)}
                          </div>
                          <div className="mt-1 text-lg font-bold text-white">
                            {stage.title}
                          </div>
                          <div className="mt-2 text-sm text-zinc-400">
                            {stage.description}
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] ${TYPE_STYLES[stage.type]}`}
                        >
                          {stage.type}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-zinc-500">
                          Challenge: {stage.enemyOrChallenge}
                        </div>
                        {unlocked ? (
                          <Link
                            href={`/single/play/${stage.substoryId}/${stage.stageNumber}`}
                            className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] transition ${
                              cleared
                                ? "bg-emerald-400/20 text-emerald-100 hover:bg-emerald-400/30"
                                : "bg-yellow-300/90 text-slate-950 hover:bg-yellow-200"
                            }`}
                          >
                            {cleared ? "Replay" : "Enter"}
                          </Link>
                        ) : (
                          <div className="rounded-full border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                            Locked
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
