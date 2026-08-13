/**
 * Loading placeholders.
 *
 * Every skeleton here mirrors the real component's box model — same aspect
 * ratios, same padding, same border radius. That is the whole point: if the
 * placeholder and the content have different heights, swapping them shifts the
 * layout, which looks worse than showing nothing at all.
 */

/** One shimmering block. Compose these; don't animate the wrapper. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-gray-200 ${className}`}
    >
      {/* The highlight sweeps across a clipped parent, so it animates transform
          only — no layout or paint work per frame. */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-[skeleton-shimmer_1.6s_ease-in-out_infinite] motion-reduce:hidden" />
    </div>
  );
}

/** Matches MemberCard: 4/5 photo, then name + part chip, year, bio lines. */
export function MemberCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <Skeleton className="aspect-[4/5] rounded-none" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>
        <Skeleton className="h-3 w-32 mb-3" />
        <Skeleton className="h-3 w-full mb-1.5" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

/** Matches VideoCard: 16/9 embed well, then title + show/year. */
export function VideoCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
      <Skeleton className="aspect-video rounded-none" />
      <div className="p-5">
        <Skeleton className="h-4 w-3/5 mb-2" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  );
}

/** Matches ShowCard: date chip, title block, then the price/CTA footer. */
export function ShowCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
      <div className="flex items-start gap-5">
        <Skeleton className="h-[68px] w-[60px] rounded-xl shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-1.5" />
          <Skeleton className="h-3 w-3/5 mb-3" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Matches TicketForm's idle layout. Worth having as a real skeleton: the form
 * can't render its show dropdown until a client-side round trip finishes, so
 * this is on screen for a genuine beat, not just a frame.
 */
export function FormSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-[46px] w-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-[46px] w-full rounded-xl" />
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-[86px] w-full rounded-xl" />
      </div>
      <Skeleton className="h-[50px] w-full rounded-full" />
    </div>
  );
}

/**
 * Wraps the real content that replaces a skeleton, fading it up over the same
 * footprint instead of cutting to it.
 *
 * Pure CSS, so it works in a server component and costs no client JS: the
 * animation runs when the element is inserted into the DOM, which is exactly
 * the moment the Suspense fallback goes away.
 *
 * Wrap only the parts that were actually skeletons. Headings that render
 * identically in both `loading.tsx` and the page never disappeared, so
 * animating them makes stable text flicker for no reason.
 */
export function ContentIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Stagger sibling blocks so a dense screen resolves in sequence. */
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-[content-in_450ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Page-level wrapper. Screen readers get one polite announcement instead of a
 * pile of meaningless empty boxes.
 */
export function LoadingRegion({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}
