import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MultiBattle } from "@/components/game/MultiBattle";

export default async function MultiBattlePage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { matchId } = await params;

  return <MultiBattle matchId={matchId} userId={user.id} />;
}
