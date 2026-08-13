import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import ShowCard from "@/components/ShowCard";
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

      {/* ABOUT — text left, image right, narrower than the band below it.
          The two content sections deliberately differ in width, background and
          column order; back-to-back identical grids read as one flat slab. */}
      <section id="about" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy leading-tight mb-6">
              About Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {s.about_description}
            </p>
          </Reveal>

          <Reveal delay={80}>
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
          </Reveal>
        </div>
      </section>

      {/* CURRENT SHOW — media flips to the left on desktop and the whole band
          sits on surface grey, so the eye registers a new section. */}
      <section id="shows" className="py-24 md:py-32 px-6 bg-surface border-y border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:order-last">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy leading-tight mb-6">
              Spring Show 2026:
              <span className="block italic">Bet On It!</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              This semester, we performed songs from The Greatest Showman, Phantom of the Opera, The Hunger Games, and more.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Listen to an arrangement of ours here, or check out more on our YouTube channel!
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="relative w-full max-w-xl mx-auto lg:max-w-none rounded-2xl overflow-hidden aspect-video bg-white border border-gray-200 shadow-sm">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${video.youtube_id}`}
                title={`${video.title} — ${video.show_name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* AUDITIONS — a third beat between the show band and the footer. The
          page previously ran hero → two sections → footer, which is what made
          it feel like it stopped early. */}
      <section className="py-24 md:py-32 px-6">
        <Reveal className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy leading-tight mb-6">
            Join us!
          </h2>
          <p className="text-gray-600 leading-relaxed mb-10">
            We hold auditions at the start of every semester. No experience
            with a cappella required, just bring a song you love! Drop us
            your email for further information on the process!
          </p>
          <Link
            href="/auditions"
            className="inline-block px-8 py-3.5 rounded-full bg-navy text-white font-semibold text-sm hover:bg-navy-light transition-colors"
          >
            Audition Info
          </Link>
        </Reveal>
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
