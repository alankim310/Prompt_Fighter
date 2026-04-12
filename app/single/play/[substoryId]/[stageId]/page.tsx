import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BattleScreen } from "@/components/game/BattleScreen";
import {
  getStageBySubstoryAndStageNumber,
  getSubstoryById,
} from "@/lib/game/stages";
import { createClient } from "@/lib/supabase/server";

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
  const substory = getSubstoryById(parsedSubstoryId);

  if (!stage || !substory) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.1),_transparent_24%),linear-gradient(180deg,_#120914_0%,_#0b0812_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 flex w-full max-w-6xl justify-end">
        <Link
          href="/single"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
        >
          Back to Map
        </Link>
      </div>

      <BattleScreen stage={stage} substory={substory} />
    </main>
  );
}
