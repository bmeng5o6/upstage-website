import Image from "next/image";
import Hero from "@/components/Hero";
import ShowCard from "@/components/ShowCard";
import VideoCard from "@/components/VideoCard";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import type { Show, Video } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();
  const [showsResult, s] = await Promise.all([
    supabase
      ? supabase.from("shows").select("*").order("date", { ascending: true }).limit(3)
      : Promise.resolve({ data: null }),
    getSettings(),
  ]);
  const shows = showsResult.data as Show[] | null;
  const video: Video = {
    id: "featured",
    youtube_id: "56sSdRaITE8",
    title: "Spring 26 Show Video",
    show_name: "Bet On It!",
    year: 2026,
    display_order: 1
  }

  return (
    <>
      <Hero />

      {/* ABOUT */}
      <section id="about" className="pt-24 md:pt-32 pb-0 md:pb-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-6">
              About Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {s.about_description}
            </p>
          </div>

          <div className="relative w-full max-w-xl mx-auto lg:max-w-none rounded-2xl overflow-hidden aspect-[8/5] bg-surface border border-gray-200">
            <Image
              src="/photos/group.jpg"
              alt="Upstage A Cappella group photo"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* CURRENT SHOW */}
      <section id="shows" className="pt-8 md:pt-12 pb-24 md:pb-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-6">
              Spring Show 2026:
              <span className="block">Bet On It!</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              This semester, we performed songs from The Greatest Showman, Phantom of the Opera, The Hunger Games, and more.
            </p>
            <br />
            <p className="text-gray-600 leading-relaxed">
              Listen to an arrangement of ours here, or check out more on our YouTube channel!
            </p>
          </div>

          <div className="relative w-full max-w-xl mx-auto lg:max-w-none rounded-2xl overflow-hidden aspect-video bg-surface border border-gray-200">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtube_id}`}
              title={`${video.title} — ${video.show_name}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* UPCOMING SHOWS */}
      {/* <section id="shows" className="py-24 px-6 bg-surface">
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
      </section> */}
    </>
  );
}
