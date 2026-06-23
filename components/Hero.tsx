import Link from "next/link";
import { getSettings } from "@/lib/settings";

export default async function Hero() {
  const s = await getSettings();

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-white text-center px-6"
      style={{ backgroundColor: "#1a1a2e" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/photos/hero-bg.jpg')] bg-cover bg-center" />

      <div className="relative z-10 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-6">
          University of Pennsylvania
        </p>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-4">
          Upstage
        </h1>
        <p className="text-xl md:text-2xl font-light text-white/70 italic mb-10">
          A Cappella
        </p>
        <p className="text-base md:text-lg text-white/60 mb-12 max-w-xl mx-auto">
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
            href="/media"
            className="px-8 py-3.5 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors text-sm"
          >
            Watch Us Perform
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 animate-bounce text-xl">
        ↓
      </div>
    </section>
  );
}
