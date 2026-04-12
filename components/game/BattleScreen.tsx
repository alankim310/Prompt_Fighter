"use client";

import { useState } from "react";
import { getWillieTheWildcatImageUrl } from "@/lib/game/assets";
import type { Stage, Substory } from "@/lib/game/types";

export function BattleScreen({
  stage,
  substory,
}: {
  stage: Stage;
  substory: Substory;
}) {
  const [prompt, setPrompt] = useState("");
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const willieImageUrl = getWillieTheWildcatImageUrl();

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

            <div className="pointer-events-none absolute bottom-0 left-[4%] z-10 h-[72%] w-[28%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={willieImageUrl}
                alt="Willie the Wildcat"
                className="h-full w-full object-contain object-bottom drop-shadow-[0_14px_36px_rgba(0,0,0,0.85)]"
              />
            </div>

            <div className="pointer-events-none absolute bottom-0 right-[4%] z-10 h-[68%] w-[28%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stage.encounterImage}
                alt={stage.enemyOrChallenge}
                className="h-full w-full object-contain object-bottom drop-shadow-[0_14px_36px_rgba(0,0,0,0.85)]"
              />
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
                className="rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm font-semibold text-zinc-100 backdrop-blur transition hover:bg-black/60"
              >
                View description
              </button>
            </div>

            <div className="absolute bottom-0 left-0 z-20 max-w-2xl p-5 sm:p-6">
              <div className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur">
                <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  Chapter
                </div>
                <div className="mt-1 text-lg font-bold text-white">
                  {substory.title}
                </div>
                <div className="mt-1 text-sm text-zinc-300">{substory.theme}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-black/35 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur sm:p-6">
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
            </div>
          </div>
        </section>
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
