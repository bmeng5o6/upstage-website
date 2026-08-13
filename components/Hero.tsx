import Link from "next/link";
import HeroBackground from "@/components/HeroBackground";
import { getSettings } from "@/lib/settings";

export default async function Hero() {
  const s = await getSettings();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-white text-center px-6 overflow-hidden bg-navy">
      {/* Background, scrims and the stop control all live in a client
          component; this stays a server component so the tagline can come
          from Supabase settings without shipping that fetch to the browser.

          The layers degrade in order — video missing → poster still → navy —
          so a missing asset never leaves the section blank. */}
      <HeroBackground />

      <div className="relative z-10 max-w-3xl">
        <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight leading-none mb-4">
          Upstage
        </h1>
        <p className="font-display text-xl md:text-2xl font-light text-white/75 italic mb-10">
          A Cappella
        </p>
        <p className="text-base md:text-lg text-white/70 mb-12 max-w-xl mx-auto">
          {s.hero_tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tickets"
            className="px-8 py-3.5 rounded-full bg-white text-navy font-semibold hover:bg-white/90 transition-colors text-sm"
          >
            Get Tickets
          </Link>
          <Link
            href="/auditions"
            className="px-8 py-3.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors text-sm"
          >
            Audition With Us
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#about"
          aria-label="Scroll to About"
          className="block text-xl text-white/40 hover:text-white/80 transition-colors animate-[bounce-pause_3s_ease-in-out_infinite] motion-reduce:animate-none"
        >
          ↓
        </a>
      </div>
    </section>
  );
}
