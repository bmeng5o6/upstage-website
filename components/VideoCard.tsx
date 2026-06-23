import type { Video } from "@/lib/types";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-shadow">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${video.youtube_id}`}
          title={`${video.title} — ${video.show_name}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="px-4 py-3">
        <p className="font-semibold text-navy text-sm">{video.title}</p>
        <p className="text-xs text-muted mt-0.5">
          {video.show_name} · {video.year}
        </p>
      </div>
    </div>
  );
}
