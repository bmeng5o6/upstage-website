import { LoadingRegion, VideoCardSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
          Media
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-navy leading-tight mb-12">
          Watch &amp; listen.
        </h1>

        <h2 className="text-xl font-semibold text-navy mb-6">
          Performance Videos
        </h2>
        <LoadingRegion label="Loading videos">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        </LoadingRegion>
      </div>
    </div>
  );
}
