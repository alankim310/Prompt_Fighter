import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function SinglePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold">Single Mode — Stage Map</h1>
      <p className="text-zinc-400 mt-2">TBD: stage map UI</p>
    </main>
  );
}
