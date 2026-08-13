import { LoadingRegion, MemberCardSkeleton } from "@/components/Skeleton";

// Header copy is static, so render it for real — only the roster is unknown.
// A skeleton that also greys out the heading throws away information the
// router already has.
export default function Loading() {
  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
          The Group
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-navy leading-tight mb-3">
          Meet the members.
        </h1>
        <p className="text-gray-500 mb-12 max-w-xl">
          We&apos;re a co-ed group of singers from all walks of campus life.
        </p>

        <LoadingRegion label="Loading members">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <MemberCardSkeleton key={i} />
            ))}
          </div>
        </LoadingRegion>
      </div>
    </div>
  );
}
