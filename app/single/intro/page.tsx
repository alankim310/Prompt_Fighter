import { redirect } from "next/navigation";
import { SingleModeIntro } from "@/components/game/SingleModeIntro";
import { SINGLE_MODE_INTRO_SLIDES } from "@/lib/game/intro";
import { createClient } from "@/lib/supabase/server";

export default async function SingleIntroPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  return <SingleModeIntro slides={SINGLE_MODE_INTRO_SLIDES} />;
}
