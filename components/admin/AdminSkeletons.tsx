/**
 * Loading placeholders for the admin panel.
 *
 * Same rule as the public skeletons: mirror the real component's box model so
 * the swap doesn't shift anything. The difference here is that admin screens
 * have a lot of *static* chrome — table headers, section titles, button labels
 * — which is known at build time. Those render for real; only the rows that
 * depend on a database round trip get shimmered.
 */

import { Skeleton } from "@/components/Skeleton";

/** The four stat tiles on the dashboard. */
export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200 p-5"
        >
          {/* h-9 matches text-3xl's line box, h-5 the text-sm label below it. */}
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-3.5 w-28 mt-2" />
        </div>
      ))}
    </div>
  );
}

/**
 * A bordered table card with real headers and shimmering rows.
 *
 * `widths` lets each column keep a plausible shape — a uniform grid of equal
 * bars reads as a loading spinner in disguise, not as a table about to appear.
 */
export function AdminTableSkeleton({
  headers,
  rows = 6,
  widths = [],
  cellClass = "px-5 py-3",
  title,
}: {
  headers: string[];
  rows?: number;
  widths?: string[];
  cellClass?: string;
  title?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {title}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-muted text-xs uppercase tracking-widest">
              {headers.map((h) => (
                <th key={h} className={cellClass}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r} className="border-b border-gray-50">
                {headers.map((h, c) => (
                  <td key={h} className={cellClass}>
                    <Skeleton className={`h-3.5 ${widths[c] ?? "w-20"}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** The filter/search strip above the reservations and interest tables. */
export function ToolbarSkeleton({
  controls = 2,
  trailing = false,
}: {
  controls?: number;
  trailing?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {Array.from({ length: controls }).map((_, i) => (
        <Skeleton key={i} className="h-[38px] w-[180px] rounded-xl" />
      ))}
      {trailing && <Skeleton className="h-[38px] w-28 rounded-xl" />}
      <Skeleton className="h-3.5 w-32 self-center ml-auto" />
    </div>
  );
}

/**
 * Header strip used by ShowsManager and MembersManager: a count on the left,
 * an add button on the right. The button label is static, so it renders live —
 * an admin can read "New Show" and know they're on the right page before the
 * list arrives.
 */
export function ManagerHeaderSkeleton({ action }: { action: string }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-3.5 w-16" />
      <span className="px-5 py-2 rounded-full bg-navy/40 text-white text-sm font-semibold select-none">
        {action}
      </span>
    </div>
  );
}

/** Matches ShowsManager's stacked row cards. */
export function ShowRowsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-56 mt-2" />
            <Skeleton className="h-3 w-32 mt-1.5" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-[30px] w-16 rounded-full" />
            <Skeleton className="h-[30px] w-14 rounded-full" />
            <Skeleton className="h-[30px] w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Matches MembersManager's three-up grid of compact member chips. */
export function MemberRowsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4 items-start"
        >
          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-20 mt-2" />
            <Skeleton className="h-3 w-28 mt-1.5" />
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * One settings card: real heading, shimmering fields. `fields` counts full-width
 * rows; `split` renders the leading row as two columns, matching the
 * member/show count pair at the top of SettingsForm.
 */
export function SettingsCardSkeleton({
  heading,
  fields = 3,
  split = false,
  textarea = false,
  action,
}: {
  heading: string;
  fields?: number;
  split?: boolean;
  textarea?: boolean;
  action?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 max-w-2xl">
      <h2 className="font-semibold text-navy text-base border-b border-gray-100 pb-3">
        {heading}
      </h2>

      {split && (
        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-[46px] w-full rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {textarea && (
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-[90px] w-full rounded-xl" />
        </div>
      )}

      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-[46px] w-full rounded-xl" />
        </div>
      ))}

      {action && (
        <span className="inline-block px-8 py-3 rounded-full bg-navy/40 text-white font-semibold text-sm select-none">
          {action}
        </span>
      )}
    </div>
  );
}
