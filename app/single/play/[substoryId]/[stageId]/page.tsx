import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSingleModeHeroImageUrl } from "@/lib/game/assets";
import {
  getStageBackgroundUrl,
  getStageBySubstoryAndStageNumber,
} from "@/lib/game/stages";
import { createClient } from "@/lib/supabase/server";

const TYPE_LABELS = {
  battle: "Battle",
  obstacle: "Obstacle",
  social: "Social",
  puzzle: "Puzzle",
  boss: "Boss",
} as const;

export default async function PlayStagePage({
  params,
}: {
  params: Promise<{ substoryId: string; stageId: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { substoryId, stageId } = await params;
  const parsedSubstoryId = Number(substoryId);
  const parsedStageId = Number(stageId);

  if (Number.isNaN(parsedSubstoryId) || Number.isNaN(parsedStageId)) {
    notFound();
  }

  const stage = getStageBySubstoryAndStageNumber(parsedSubstoryId, parsedStageId);
  if (!stage) {
    notFound();
  }

  const heroImageUrl = getSingleModeHeroImageUrl();
  const backgroundImageUrl = getStageBackgroundUrl(stage);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.12),_transparent_24%),linear-gradient(180deg,_#120914_0%,_#0b0812_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Story {stage.substoryId} • Stage {stage.stageNumber}
            </div>
            <h1 className="mt-2 text-4xl font-black">{stage.title}</h1>
          </div>
          <Link
            href="/single"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
          >
            Back to Map
          </Link>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-fuchsia-100">
              {TYPE_LABELS[stage.type]}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
              Difficulty {stage.difficulty}
            </span>
          </div>

          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300">
            {stage.description}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Challenge
              </div>
              <div className="mt-2 text-lg font-bold text-white">
                {stage.enemyOrChallenge}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Background URL
              </div>
              <div className="mt-2 font-mono text-sm text-zinc-300">
                {backgroundImageUrl}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Hero URL
              </div>
              <div className="mt-2 font-mono text-sm text-zinc-300">
                {heroImageUrl}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-amber-100/80">
              Judge Context Preview
            </div>
            <p className="mt-2 text-sm leading-6 text-amber-50/90">
              {stage.systemPromptContext}
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-dashed border-white/10 bg-black/20 p-6 text-zinc-400">
          <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Next Step
          </div>
          <p className="mt-3 max-w-2xl leading-7">
            This route is now stage-aware and ready for the battle/challenge screen.
            The next implementation step is to render the hero, background, prompt
            input, and result flow for this specific stage.
          </p>
        </section>
      </div>
    </main>
  );
}
