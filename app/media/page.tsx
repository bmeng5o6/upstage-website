import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import { videos } from "@/data/videos";

export const metadata = {
  title: "Media — Upstage A Cappella",
};

// Add your photo filenames here — drop the actual files into public/photos/
const photos: { src: string; alt: string }[] = [
  { src: "/photos/show-1.jpg", alt: "Performance photo 1" },
  { src: "/photos/show-2.jpg", alt: "Performance photo 2" },
  { src: "/photos/show-3.jpg", alt: "Performance photo 3" },
  { src: "/photos/show-4.jpg", alt: "Performance photo 4" },
  { src: "/photos/show-5.jpg", alt: "Performance photo 5" },
  { src: "/photos/show-6.jpg", alt: "Performance photo 6" },
];

export default function MediaPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 pt-24">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
            Media
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-12">
            Watch &amp; listen.
          </h1>

          {/* VIDEOS */}
          <h2 className="text-xl font-semibold text-navy mb-6">
            Performance Videos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {videos.map((v) => (
              <VideoCard key={`${v.youtubeId}-${v.year}`} video={v} />
            ))}
          </div>

          {/* PHOTOS */}
          <h2 className="text-xl font-semibold text-navy mb-6">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((p) => (
              <div
                key={p.src}
                className="rounded-xl overflow-hidden aspect-square bg-surface relative border border-gray-200"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-4">
            Drop photo files into{" "}
            <code className="bg-surface px-1.5 py-0.5 rounded text-navy">
              public/photos/
            </code>{" "}
            and update the filenames in{" "}
            <code className="bg-surface px-1.5 py-0.5 rounded text-navy">
              app/media/page.tsx
            </code>
            .
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
