import Hero from "@/components/Hero";
import ShowCard from "@/components/ShowCard";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import type { Show } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();
  const [showsResult, s] = await Promise.all([
    supabase
      ? supabase.from("shows").select("*").order("date", { ascending: true }).limit(3)
      : Promise.resolve({ data: null }),
    getSettings(),
  ]);
  const shows = showsResult.data as Show[] | null;

  return (
    <>
      <Hero />

      {/* ABOUT */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              Who We Are
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-6">
              More than music.
              <br />A family.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {s.about_description}
            </p>
            <div className="flex gap-10">
              {[
                { number: s.member_count, label: "Members" },
                { number: s.show_count, label: "Shows" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-navy">{stat.number}</p>
                  <p className="text-sm text-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-surface aspect-[4/3] flex flex-col items-center justify-center text-muted text-sm border border-gray-200 gap-1">
            <span>Drop your group photo here</span>
            <span className="text-xs">public/photos/group.jpg</span>
          </div>
        </div>
      </section>

      {/* UPCOMING SHOWS */}
      <section id="shows" className="py-24 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
            Upcoming Shows
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-12">
            Come see us live.
          </h2>
          {shows && shows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shows.map((show, i) => (
                <ShowCard key={show.id} show={show} featured={i === 0} />
              ))}
            </div>
          ) : (
            <p className="text-muted">No upcoming shows yet — check back soon!</p>
          )}
        </div>
      </section>
    </>
  );
}
