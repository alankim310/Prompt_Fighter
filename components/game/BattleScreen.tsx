"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StageResult } from "@/components/game/StageResult";
import { getWillieTheWildcatImageUrl } from "@/lib/game/assets";
import {
  CHAPTER_FIVE_ARTIFACT_REMINDERS,
  TOTAL_SUBSTORIES,
  getAllStages,
  getNextStageInSubstory,
  isLastStageInSubstory,
} from "@/lib/game/stages";
import type {
  GameProgress,
  SingleBattleResult,
  Stage,
  Substory,
} from "@/lib/game/types";
import { createClient } from "@/lib/supabase/client";

function parseSingleBattleResult(payload: unknown): SingleBattleResult | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  if (keys.length !== 2 || keys[0] !== "narrative" || keys[1] !== "result") {
    return null;
  }

  if ((record.result !== 0 && record.result !== 1) || typeof record.narrative !== "string") {
    return null;
  }

  return {
    result: record.result,
    narrative: record.narrative,
  };
}

export function BattleScreen({
  stage,
  substory,
  progress,
}: {
  stage: Stage;
  substory: Substory;
  progress: GameProgress;
}) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  const [stageMenuOpen, setStageMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [battleResult, setBattleResult] = useState<SingleBattleResult | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const willieImageUrl = getWillieTheWildcatImageUrl();
  const trimmedPrompt = prompt.trim();
  const nextStage = getNextStageInSubstory(stage);
  const chapterEndsHere = isLastStageInSubstory(stage);
  const isFinalStoryStage = stage.id === "s5-stage4";
  const encounterImages = stage.encounterImages ?? [];
  const chapterFiveArtifactReminders =
    substory.id === 5 ? CHAPTER_FIVE_ARTIFACT_REMINDERS : [];
  const clearedStageIds = new Set(progress.cleared_stages);
  const completedStages = getAllStages().filter((gameStage) =>
    clearedStageIds.has(gameStage.id),
  );
  const completedStagesByChapter = completedStages.reduce<
    Array<{ substoryId: number; stages: Stage[] }>
  >((chapters, completedStage) => {
    const chapter = chapters.find(
      (entry) => entry.substoryId === completedStage.substoryId,
    );

    if (chapter) {
      chapter.stages.push(completedStage);
      chapter.stages.sort((a, b) => a.stageNumber - b.stageNumber);
      return chapters;
    }

    return [
      ...chapters,
      {
        substoryId: completedStage.substoryId,
        stages: [completedStage],
      },
    ].sort((a, b) => a.substoryId - b.substoryId);
  }, []);
  const hasCompletedStages = completedStages.length > 0;

  async function updateProgressAfterClear() {
    const supabase = createClient();
    const { data: currentProgress, error: progressError } = await supabase
      .from("game_progress")
      .select("id, substory, stage, cleared_stages, completed")
      .maybeSingle();

    if (progressError || !currentProgress) {
      throw new Error(progressError?.message ?? "Unable to load progress.");
    }

    const clearedStages = Array.isArray(currentProgress.cleared_stages)
      ? [...new Set([...(currentProgress.cleared_stages as string[]), stage.id])]
      : [stage.id];

    let nextSubstory = currentProgress.substory;
    let nextStageNumber = currentProgress.stage;
    let completed = currentProgress.completed;

    const isCurrentFrontier =
      !currentProgress.completed &&
      currentProgress.substory === stage.substoryId &&
      currentProgress.stage === stage.stageNumber;

    if (isCurrentFrontier) {
      if (nextStage) {
        nextStageNumber = nextStage.stageNumber;
      } else if (stage.substoryId < TOTAL_SUBSTORIES) {
        nextSubstory = stage.substoryId + 1;
        nextStageNumber = 1;
      } else {
        completed = true;
      }
    }

    const { error: updateError } = await supabase
      .from("game_progress")
      .update({
        substory: nextSubstory,
        stage: nextStageNumber,
        cleared_stages: clearedStages,
        completed,
      })
      .eq("id", currentProgress.id);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  async function handleSubmit() {
    if (!trimmedPrompt || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setRequestError(null);
    setBattleResult(null);

    try {
      const response = await fetch("/api/battle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          stageId: stage.id,
        }),
      });

      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        throw new Error("The judge returned an unreadable response.");
      }

      if (!response.ok) {
        const message =
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "The judge could not process this prompt.";
        throw new Error(message);
      }

      const parsedResult = parseSingleBattleResult(payload);
      if (!parsedResult) {
        throw new Error("The judge returned an invalid result shape.");
      }

      if (parsedResult.result === 1) {
        await updateProgressAfterClear();
      }

      setBattleResult(parsedResult);
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : "The judge is unavailable right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleResultPrimaryAction() {
    if (!battleResult) return;

    if (battleResult.result === 0) {
      setBattleResult(null);
      return;
    }

    if (isFinalStoryStage) {
      router.push("/single/ending");
      return;
    }

    if (chapterEndsHere) {
      router.push("/single");
      return;
    }

    if (nextStage) {
      router.push(`/single/play/${nextStage.substoryId}/${nextStage.stageNumber}`);
    }
  }

  function handleCompletedStageSelect(substoryId: number, stageNumber: number) {
    setStageMenuOpen(false);
    router.push(`/single/play/${substoryId}/${stageNumber}`);
  }

  return (
    <>
      <div className="relative h-screen overflow-hidden bg-black text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={stage.backgroundImage}
          alt={stage.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-transparent to-black/30" />

        <div className="pointer-events-none absolute bottom-[8%] left-[7%] z-10 h-[56%] w-[20%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={willieImageUrl}
            alt="Willie the Wildcat"
            className="h-full w-full object-contain object-bottom drop-shadow-[0_14px_36px_rgba(0,0,0,0.85)]"
          />
        </div>

        <div className="pointer-events-none absolute bottom-0 right-[2%] z-10 h-[80%] w-[46%]">
          {encounterImages.length === 1 ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={encounterImages[0]}
                alt={stage.enemyOrChallenge}
                className="h-full w-full object-contain object-bottom drop-shadow-[0_14px_36px_rgba(0,0,0,0.85)]"
              />
            </>
          ) : encounterImages.length > 1 ? (
            <div className="flex h-full w-full items-end justify-end gap-1">
              {encounterImages.map((image, index) => (
                <div
                  key={`${stage.id}-encounter-${index}`}
                  className="h-[92%] flex-1"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={stage.enemyOrChallenge}
                    className="h-full w-full object-contain object-bottom drop-shadow-[0_14px_36px_rgba(0,0,0,0.85)]"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="absolute left-0 top-0 z-20 flex w-full flex-wrap items-start justify-between gap-3 p-5 sm:p-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-zinc-300/85">
              Chapter {substory.id} • Stage {stage.stageNumber}
            </div>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              {stage.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-100/90 sm:text-base">
              {stage.objective}
            </p>
          </div>

          <div className="flex w-full max-w-sm flex-col items-stretch gap-3 sm:w-auto sm:items-end">
            <div className="flex flex-wrap justify-end gap-3">
              <Link
                href="/single"
                className="rounded-full bg-black/45 px-6 py-3 text-base font-semibold text-zinc-100 backdrop-blur transition hover:bg-black/60"
              >
                Back to Map
              </Link>

              <button
                type="button"
                onClick={() => setDescriptionOpen(true)}
                className="rounded-full bg-black/45 px-6 py-3 text-base font-semibold text-zinc-100 backdrop-blur transition hover:bg-black/60"
              >
                View description
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (!hasCompletedStages) return;
                    setStageMenuOpen((open) => !open);
                  }}
                  disabled={!hasCompletedStages}
                  aria-label="Open completed stages menu"
                  className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-black/45 text-zinc-100 backdrop-blur transition hover:bg-black/60 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-zinc-500"
                >
                  <Menu className="h-5 w-5" />
                </button>

                {stageMenuOpen && hasCompletedStages ? (
                  <div className="absolute right-0 top-full z-30 mt-3 max-h-[26rem] w-80 overflow-y-auto rounded-3xl bg-[#120d16]/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
                    {completedStagesByChapter.map((chapter) => (
                      <div key={`chapter-${chapter.substoryId}`} className="mb-2 last:mb-0">
                        <div className="px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                          Chapter {chapter.substoryId}
                        </div>

                        {chapter.stages.map((completedStage) => (
                          <button
                            key={completedStage.id}
                            type="button"
                            onClick={() =>
                              handleCompletedStageSelect(
                                completedStage.substoryId,
                                completedStage.stageNumber,
                              )
                            }
                            className="flex w-full items-start justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-white/8"
                          >
                            <span>
                              <span className="block text-xs uppercase tracking-[0.25em] text-zinc-500">
                                Stage {completedStage.stageNumber}
                              </span>
                              <span className="mt-1 block text-sm font-semibold text-white">
                                {completedStage.title}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {stage.artifactImage && (
              <div className="flex items-center gap-3 self-end rounded-2xl bg-black/45 px-4 py-3 backdrop-blur">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-amber-300/10 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stage.artifactImage}
                    alt={substory.rewardArtifact}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-amber-100/70">
                    Chapter Reward
                  </div>
                  <div className="mt-1 text-sm font-semibold text-amber-50">
                    {substory.rewardArtifact}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/88 via-black/72 to-transparent px-4 pb-4 pt-20 sm:px-6 sm:pb-6">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
            {chapterFiveArtifactReminders.length > 0 && (
              <details className="mx-auto w-full max-w-2xl rounded-[1.5rem] bg-black/25 p-4 backdrop-blur">
                <summary className="cursor-pointer text-[10px] uppercase tracking-[0.35em] text-amber-100/75">
                  Collected Artifacts
                </summary>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {chapterFiveArtifactReminders.map((artifact) => (
                    <div
                      key={artifact.name}
                      className="flex items-start gap-3 rounded-2xl bg-black/35 p-3 backdrop-blur"
                    >
                      <div className="h-14 w-14 shrink-0 rounded-xl bg-amber-300/10 p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={artifact.image}
                          alt={artifact.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-amber-50">
                          {artifact.name}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-zinc-300">
                          {artifact.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}

            <div className="rounded-[1.75rem] bg-black/10 p-4 backdrop-blur-md sm:p-5">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                maxLength={500}
                placeholder={`Write how Willie handles "${stage.enemyOrChallenge}"...`}
                rows={1}
                className="h-[3.5rem] w-full resize-none rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-500 focus:border-white focus:bg-black/65"
              />

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <details className="max-w-3xl rounded-2xl bg-black/35 px-4 py-3 text-zinc-300">
                  <summary className="cursor-pointer text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                    Prompt Ideas
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {stage.promptIdeas.join(" • ")}
                  </p>
                </details>

                <div className="flex items-center justify-end gap-3">
                  <div className="text-sm font-medium text-zinc-300">
                    {prompt.length}/500 characters
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!trimmedPrompt || isSubmitting}
                    className="rounded-full bg-fuchsia-400/90 px-5 py-2.5 text-sm font-bold text-fuchsia-950 transition hover:bg-fuchsia-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-500"
                  >
                    {isSubmitting ? "Judging..." : "Submit Prompt"}
                  </button>
                </div>
              </div>

              {requestError ? (
                <div className="mt-4 rounded-2xl bg-rose-300/15 px-4 py-3 text-sm leading-6 text-rose-100/90">
                  {requestError}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {descriptionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#120d16] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                  Full Stage Description
                </div>
                <h2 className="mt-2 text-2xl font-black text-white">
                  {stage.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDescriptionOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mt-5 text-sm leading-7 text-zinc-300">
              <p>{stage.description}</p>
            </div>
          </div>
        </div>
      )}

      {battleResult && !descriptionOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl">
            <StageResult
              result={battleResult}
              primaryLabel={
                battleResult.result === 1
                  ? isFinalStoryStage
                    ? "View Ending"
                    : chapterEndsHere
                    ? "Return to Map"
                    : "Next Stage"
                  : "Try Again"
              }
              onPrimaryAction={handleResultPrimaryAction}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
