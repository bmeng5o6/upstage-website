import { createClient } from "@/lib/supabase/server";
import AuditionInterests from "@/components/admin/AuditionInterests";
import { ContentIn } from "@/components/Skeleton";
import type { InterestSignup } from "@/lib/types";

export const metadata = { title: "Audition Interests — Upstage Admin" };

export default async function InterestedPage() {
  const supabase = await createClient();

  const result = supabase
    ? await supabase
        .from("interest_signups")
        .select("*")
        .order("created_at", { ascending: false })
    : { data: null };

  const signups = result.data as InterestSignup[] | null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-2">Audition Interests</h1>
      <p className="text-sm text-muted mb-8">
        Everyone who asked to hear about auditions. Export the opted-in list as
        CSV to send a mailout.
      </p>
      <ContentIn>
        <AuditionInterests initialSignups={signups ?? []} />
      </ContentIn>
    </div>
  );
}
