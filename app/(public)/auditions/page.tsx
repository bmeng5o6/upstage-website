import AuditionForm from "@/components/AuditionForm";
import { getSettings, toParagraphs } from "@/lib/settings";

export const metadata = {
  title: "Audition — Upstage A Cappella",
};

export default async function AuditionsPage() {
  const s = await getSettings();

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-navy leading-tight mb-6">
          Interested in joining us?
        </h1>
        <p className="text-gray-600 leading-relaxed mb-16">
          {s.auditions_page_intro}
        </p>

        <h2 className="font-display text-2xl font-bold text-navy mb-6">
          What to expect
        </h2>
        <div className="space-y-4 text-gray-600 leading-relaxed mb-16">
          {toParagraphs(s.auditions_what_to_expect).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-surface p-6 sm:p-10">
          <h2 className="font-display text-2xl font-bold text-navy mb-2">
            Get audition details
          </h2>
          <br/>
          <AuditionForm />
        </div>
      </div>
    </div>
  );
}
