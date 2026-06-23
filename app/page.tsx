import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ShowCard from "@/components/ShowCard";
import { shows } from "@/data/shows";

export default function Home() {
  const upcomingShows = shows.slice(0, 3);

  return (
    <>
      <Navbar />

      <main className="flex-1">
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
              <p className="text-gray-600 leading-relaxed mb-4">
                Upstage A Cappella is Cornell University&apos;s premier co-ed a
                cappella group. Founded in [year], we&apos;ve been bringing vocal
                harmony to stages across campus and beyond — blending
                contemporary pop, R&amp;B, and original arrangements performed
                entirely with the human voice.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                We audition each semester and welcome singers of all
                backgrounds. Our shows sell out fast — follow us on social
                media to stay in the loop.
              </p>

              <div className="flex gap-10">
                {[
                  { number: "XX", label: "Members" },
                  { number: "20XX", label: "Founded" },
                  { number: "XX+", label: "Shows" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-bold text-navy">{s.number}</p>
                    <p className="text-sm text-muted mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Replace with a real <Image> once you have a group photo */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingShows.map((show, i) => (
                <ShowCard key={show.id} show={show} featured={i === 0} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
