"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getWillieTheWildcatImageUrl } from "@/lib/game/assets";
import {
  CHAPTER_FIVE_ARTIFACT_REMINDERS,
  getNextStageInSubstory,
  isLastStageInSubstory,
  TOTAL_SUBSTORIES,
} from "@/lib/game/stages";
import type { SingleBattleResult, Stage, Substory } from "@/lib/game/types";
import { StageResult } from "@/components/game/StageResult";
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
}: {
  stage: Stage;
  substory: Substory;
}) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [battleResult, setBattleResult] = useState<SingleBattleResult | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const willieImageUrl = getWillieTheWildcatImageUrl();
  const trimmedPrompt = prompt.trim();
  const nextStage = getNextStageInSubstory(stage);
  const chapterEndsHere = isLastStageInSubstory(stage);
  const encounterImages = stage.encounterImages ?? [];
  const chapterFiveArtifactReminders =
    substory.id === 5 ? CHAPTER_FIVE_ARTIFACT_REMINDERS : [];

  async function updateProgressAfterClear() {
    const supabase = createClient();
    const { data: progress, error: progressError } = await supabase
      .from("game_progress")
      .select("id, substory, stage, cleared_stages, completed")
      .maybeSingle();

    if (progressError || !progress) {
      throw new Error(progressError?.message ?? "Unable to load progress.");
    }

    const clearedStages = Array.isArray(progress.cleared_stages)
      ? [...new Set([...(progress.cleared_stages as string[]), stage.id])]
      : [stage.id];

    let nextSubstory = progress.substory;
    let nextStageNumber = progress.stage;
    let completed = progress.completed;

    const isCurrentFrontier =
      !progress.completed &&
      progress.substory === stage.substoryId &&
      progress.stage === stage.stageNumber;

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
      .eq("id", progress.id);

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

    if (chapterEndsHere) {
      router.push("/single");
      return;
    }

    if (nextStage) {
      router.push(`/single/play/${nextStage.substoryId}/${nextStage.stageNumber}`);
    }
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={substory.mapImage}
              alt={substory.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/65" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            <div className="pointer-events-none absolute bottom-0 left-[7%] z-10 h-[56%] w-[20%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={willieImageUrl}
                alt="Willie the Wildcat"
                className="h-full w-full object-contain object-bottom drop-shadow-[0_14px_36px_rgba(0,0,0,0.85)]"
              />
            </div>

            <div className="pointer-events-none absolute bottom-0 right-[3%] z-10 h-[76%] w-[38%]">
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
                <div className="flex h-full w-full items-end justify-end gap-2">
                  {encounterImages.map((image, index) => (
                    <div
                      key={`${stage.id}-encounter-${index}`}
                      className="h-[78%] flex-1"
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
                <div className="text-[10px] uppercase tracking-[0.35em] text-zinc-400">
                  Chapter {substory.id} • Stage {stage.stageNumber}
                </div>
                <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                  {stage.title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-200 sm:text-base">
                  {stage.objective}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDescriptionOpen(true)}
                className="rounded-full border border-white/10 bg-black/45 px-6 py-3 text-base font-semibold text-zinc-100 backdrop-blur transition hover:bg-black/60"
              >
                View description
              </button>
            </div>

            <div className="absolute bottom-0 left-0 z-20 max-w-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                    Chapter
                  </div>
                  <div className="mt-1 text-lg font-bold text-white">
                    {substory.title}
                  </div>
                  <div className="mt-1 text-sm text-zinc-300">{substory.theme}</div>
                </div>

                {stage.artifactImage && (
                  <div className="flex items-center gap-3 rounded-2xl border border-amber-300/20 bg-black/45 px-4 py-3 backdrop-blur">
                    <div className="h-14 w-14 shrink-0 rounded-xl border border-amber-300/20 bg-amber-300/10 p-2">
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
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-black/35 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur sm:p-6">
          {chapterFiveArtifactReminders.length > 0 && (
            <div className="mb-6 rounded-[1.5rem] border border-amber-300/20 bg-amber-300/8 p-4">
              <div className="text-[10px] uppercase tracking-[0.35em] text-amber-100/75">
                Collected Artifacts
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {chapterFiveArtifactReminders.map((artifact) => (
                  <div
                    key={artifact.name}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-3"
                  >
                    <div className="h-14 w-14 shrink-0 rounded-xl border border-amber-300/20 bg-amber-300/10 p-2">
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
            </div>
          )}

          <div className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
            Your Prompt
          </div>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={`Write how Willie handles "${stage.enemyOrChallenge}"...`}
            className="mt-3 h-44 w-full resize-none rounded-2xl border border-white/10 bg-zinc-950/85 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-fuchsia-400/70"
          />

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Prompt Ideas
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {stage.promptIdeas.join(" • ")}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <div className="text-xs text-zinc-600">{prompt.length} characters</div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!trimmedPrompt || isSubmitting}
                className="rounded-full border border-fuchsia-300/25 bg-fuchsia-400/20 px-5 py-2.5 text-sm font-bold text-fuchsia-50 transition hover:bg-fuchsia-400/30 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-zinc-500"
              >
                {isSubmitting ? "Judging..." : "Submit Prompt"}
              </button>
            </div>
          </div>

          {requestError ? (
            <div className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm leading-6 text-rose-100/90">
              {requestError}
            </div>
          ) : null}
        </section>

        {battleResult ? (
          <StageResult
            result={battleResult}
            primaryLabel={
              battleResult.result === 1
                ? chapterEndsHere
                  ? "Return to Map"
                  : "Next Stage"
                : "Try Again"
            }
            onPrimaryAction={handleResultPrimaryAction}
          />
        ) : null}
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

            <div className="mt-5 space-y-5 text-sm leading-7 text-zinc-300">
              <p>{stage.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
