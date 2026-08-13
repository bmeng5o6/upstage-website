import { createClient } from "@/lib/supabase/server";
import MembersManager from "@/components/admin/MembersManager";
import { ContentIn } from "@/components/Skeleton";
import type { Member } from "@/lib/types";

export const metadata = { title: "Members — Upstage Admin" };

export default async function AdminMembersPage() {
  const supabase = await createClient();
  const result = supabase
    ? await supabase.from("members").select("*").order("display_order", { ascending: true })
    : { data: null };
  const members = result.data as Member[] | null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Members</h1>
      <ContentIn>
        <MembersManager initialMembers={members ?? []} />
      </ContentIn>
    </div>
  );
}
