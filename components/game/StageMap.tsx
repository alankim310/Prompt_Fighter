"use client";

import { useMemo, useState } from "react";
import {
  getSingleModeWorldMapUrl,
  getWillieTheWildcatImageUrl,
} from "@/lib/game/assets";
import {
  getHighestUnlockedSubstory,
  getStagesForSubstory,
  isSubstoryUnlocked,
} from "@/lib/game/stages";
import type { GameProgress, Stage, Substory } from "@/lib/game/types";

const STORY_NODE_POSITIONS: Record<number, { left: string; top: string }> = {
  1: { left: "11.8%", top: "53.3%" },
  2: { left: "35.4%", top: "53.3%" },
  3: { left: "54.8%", top: "53.3%" },
  4: { left: "72.0%", top: "53.3%" },
  5: { left: "89.0%", top: "53.3%" },
};

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
  const willieImageUrl = getWillieTheWildcatImageUrl();
  const worldMapUrl = getSingleModeWorldMapUrl();

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

  const selectedEntry =
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
                Select a chapter directly on the world map. Earlier stories stay
                replayable, the next route unlocks in order, and Willie marks the
                chapter you are currently focused on.
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
                Current unlock: Chapter {highestUnlockedSubstory}
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
                Click the glowing markers on the map
              </div>
            </div>
            <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Chapter select
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
            <div className="relative aspect-[3/2] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={worldMapUrl}
                alt="Single mode world map"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />

              {stagesBySubstory.map(({ substory, unlocked, cleared }) => {
                const selected = substory.id === selectedSubstoryId;
                const position = STORY_NODE_POSITIONS[substory.id];
                const statusLabel = cleared
                  ? "Cleared"
                  : unlocked
                    ? "Unlocked"
                    : "Locked";

                if (!position) return null;

                return (
                  <button
                    key={substory.id}
                    type="button"
                    onClick={() => unlocked && setSelectedSubstoryId(substory.id)}
                    disabled={!unlocked}
                    className={`absolute z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full transition ${
                      unlocked ? "cursor-pointer" : "cursor-not-allowed"
                    } ${selected ? "scale-110" : "hover:scale-105"}`}
                    style={{ left: position.left, top: position.top }}
                    aria-label={`${substory.title} ${statusLabel}`}
                  >
                    {selected && unlocked && (
                      <div className="pointer-events-none absolute -top-14 left-1/2 z-30 h-16 w-16 -translate-x-1/2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={willieImageUrl}
                          alt="Willie the Wildcat"
                          className="h-full w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.75)]"
                        />
                      </div>
                    )}

                    <div
                      className={`absolute inset-0 rounded-full border-4 shadow-[0_0_30px_rgba(0,0,0,0.4)] ${
                        cleared
                          ? "border-emerald-300 bg-emerald-300/25"
                          : unlocked
                            ? "border-yellow-300 bg-yellow-300/20"
                            : "border-zinc-500/70 bg-black/45"
                      } ${selected ? "ring-4 ring-white/30" : ""}`}
                    />
                    <div
                      className={`absolute inset-2 rounded-full ${
                        cleared
                          ? "bg-emerald-200"
                          : unlocked
                            ? "bg-yellow-200"
                            : "bg-zinc-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {selectedEntry && (
            <div className="mt-5 flex flex-wrap items-start justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
              <div className="max-w-3xl">
                <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  Selected Story
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {selectedEntry.substory.title}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.25em] text-zinc-400">
                  {selectedEntry.substory.theme}
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {selectedEntry.substory.description}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
                <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  Status
                </div>
                <div className="mt-2 text-sm font-bold text-white">
                  {selectedEntry.cleared
                    ? "Cleared"
                    : selectedEntry.unlocked
                      ? "Unlocked"
                      : "Locked"}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
