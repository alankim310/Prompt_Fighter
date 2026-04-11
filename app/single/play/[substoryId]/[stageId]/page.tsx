import { redirect } from "next/navigation";
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

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold">
        Substory {substoryId} — Stage {stageId}
      </h1>
      <p className="text-zinc-400 mt-2">TBD: battle screen</p>
    </main>
  );
}
