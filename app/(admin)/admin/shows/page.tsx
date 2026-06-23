import { createClient } from "@/lib/supabase/server";
import ShowsManager from "@/components/admin/ShowsManager";
import type { Show } from "@/lib/types";

export const metadata = { title: "Shows — Upstage Admin" };

export default async function ShowsPage() {
  const supabase = await createClient();
  const result = supabase
    ? await supabase.from("shows").select("*").order("date", { ascending: true })
    : { data: null };
  const shows = result.data as Show[] | null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Shows</h1>
      <ShowsManager initialShows={shows ?? []} />
    </div>
  );
}
