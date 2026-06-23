import VideoCard from "@/components/VideoCard";
import { createClient } from "@/lib/supabase/server";
import type { Video } from "@/lib/types";

export const metadata = {
  title: "Media — Upstage A Cappella",
};

export default async function MediaPage() {
  const supabase = await createClient();
  const result = supabase
    ? await supabase.from("videos").select("*").order("display_order", { ascending: true })
    : { data: null };
  const videos = result.data as Video[] | null;

  return (
    <div className="pt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
          Media
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-12">
          Watch &amp; listen.
        </h1>

        <h2 className="text-xl font-semibold text-navy mb-6">
          Performance Videos
        </h2>
        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        ) : (
          <p className="text-muted mb-20">Videos coming soon!</p>
        )}

        <h2 className="text-xl font-semibold text-navy mb-6">Gallery</h2>
        <p className="text-sm text-muted">
          Drop photo files into{" "}
          <code className="bg-surface px-1.5 py-0.5 rounded text-navy">
            public/photos/
          </code>{" "}
          — gallery coming soon.
        </p>
      </div>
    </div>
  );
}
