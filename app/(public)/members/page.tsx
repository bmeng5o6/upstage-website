import MemberCard from "@/components/MemberCard";
import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/lib/types";

export const metadata = {
  title: "Members — Upstage A Cappella",
};

export default async function MembersPage() {
  const supabase = await createClient();
  const result = supabase
    ? await supabase.from("members").select("*").order("display_order", { ascending: true })
    : { data: null };
  const members = result.data as Member[] | null;

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
          The Group
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-3">
          Meet the members.
        </h1>
        <p className="text-gray-500 mb-12 max-w-xl">
          We&apos;re a co-ed group of singers from all walks of campus life.
        </p>
        {members && members.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <p className="text-muted">Members coming soon!</p>
        )}
      </div>
    </div>
  );
}
