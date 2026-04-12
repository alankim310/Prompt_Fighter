"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import type { GameProgress, Substory } from "@/lib/game/types";

const STORY_NODE_POSITIONS: Record<number, { left: string; top: string }> = {
  1: { left: "12.2%", top: "53.1%" },
  2: { left: "35.5%", top: "53.1%" },
  3: { left: "54.9%", top: "53.1%" },
  4: { left: "72.1%", top: "53.1%" },
  5: { left: "88.1%", top: "53.1%" },
};

export function StageMap({
  substories,
  progress,
}: {
  substories: Substory[];
  progress: GameProgress;
}) {
  const router = useRouter();
  const highestUnlockedSubstory = getHighestUnlockedSubstory(progress);
  const initialSubstory =
    substories.find((substory) => substory.id === highestUnlockedSubstory)?.id ??
    substories[0]?.id ??
    1;

  const [selectedSubstoryId, setSelectedSubstoryId] = useState(initialSubstory);
  const [isChapterSettingOpen, setIsChapterSettingOpen] = useState(false);
  const [chapterSettingSubstory, setChapterSettingSubstory] =
    useState<Substory | null>(null);
  const [pendingStageHref, setPendingStageHref] = useState<string | null>(null);
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

  function getChapterStageTarget(substoryId: number) {
    const chapterStages = getStagesForSubstory(substoryId);
    const nextStage =
      chapterStages.find(
        (stage) =>
          isSubstoryUnlocked(progress, substoryId) &&
          !progress.cleared_stages.includes(stage.id),
      ) ?? chapterStages[0];

    return {
      href: `/single/play/${substoryId}/${nextStage.stageNumber}`,
      stageNumber: nextStage.stageNumber,
    };
  }

  function closeChapterSetting() {
    setIsChapterSettingOpen(false);
    setChapterSettingSubstory(null);
    setPendingStageHref(null);
  }

  function handleChapterClick(substory: Substory, unlocked: boolean) {
    if (!unlocked) return;

    setSelectedSubstoryId(substory.id);

    const target = getChapterStageTarget(substory.id);
    if (target.stageNumber === 1) {
      setChapterSettingSubstory(substory);
      setPendingStageHref(target.href);
      setIsChapterSettingOpen(true);
      return;
    }

    router.push(target.href);
  }

  function handleStartStage() {
    if (!pendingStageHref) return;

    closeChapterSetting();
    router.push(pendingStageHref);
  }

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={worldMapUrl}
          alt="Single mode world map"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,214,94,0.14),_transparent_30%),linear-gradient(180deg,_rgba(11,7,15,0.08)_0%,_rgba(7,5,11,0.18)_100%)]" />

        <div className="relative min-h-screen w-full">
          <div className="absolute left-4 top-4 z-40 sm:left-6 sm:top-6">
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm font-semibold text-zinc-100 backdrop-blur transition hover:bg-black/60"
            >
              Back to Home
            </Link>
          </div>

          {stagesBySubstory.map(({ substory, unlocked, cleared }) => {
            const selected = substory.id === selectedSubstoryId;
            const position = STORY_NODE_POSITIONS[substory.id];

            if (!position) return null;

            return (
              <button
                key={substory.id}
                type="button"
                onClick={() => handleChapterClick(substory, unlocked)}
                disabled={!unlocked}
                className={`absolute z-20 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full transition ${
                  unlocked ? "cursor-pointer" : "cursor-not-allowed"
                } ${selected ? "scale-115" : "hover:scale-105"}`}
                style={{ left: position.left, top: position.top }}
                aria-label={substory.title}
              >
                {selected && unlocked && (
                  <div className="pointer-events-none absolute -top-24 left-1/2 z-30 h-28 w-28 -translate-x-1/2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={willieImageUrl}
                      alt="Willie the Wildcat"
                      className="h-full w-full object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.85)]"
                    />
                  </div>
                )}

                <div
                  className={`absolute inset-0 rounded-full border-4 shadow-[0_0_30px_rgba(0,0,0,0.45)] ${
                    cleared
                      ? "border-emerald-300 bg-emerald-300/25"
                      : unlocked
                        ? "border-yellow-300 bg-yellow-300/20"
                        : "border-zinc-500/70 bg-black/45"
                  } ${selected ? "ring-4 ring-white/35" : ""}`}
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

      {isChapterSettingOpen && chapterSettingSubstory ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="chapter-setting-title"
            className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#120d16] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] sm:p-8"
          >
            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                    Setting
                  </div>
                  <h2
                    id="chapter-setting-title"
                    className="mt-2 text-2xl font-black text-white sm:text-3xl"
                  >
                    Chapter {chapterSettingSubstory.id}: {chapterSettingSubstory.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeChapterSetting}
                  aria-label="Close setting"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-semibold text-zinc-200 transition hover:bg-white/10"
                >
                  X
                </button>
              </div>

              <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2">
                <p className="text-sm leading-7 text-zinc-300 sm:text-base">
                  {chapterSettingSubstory.setting}
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleStartStage}
                  className="rounded-full border border-amber-300/50 bg-amber-300 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black shadow-[0_10px_30px_rgba(251,191,36,0.35)] transition hover:bg-amber-200"
                >
                  Start Stage
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
