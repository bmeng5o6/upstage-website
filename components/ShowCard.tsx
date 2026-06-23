import Link from "next/link";
import type { Show } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function monthDay(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.getDate().toString(),
  };
}

export default function ShowCard({
  show,
  featured = false,
}: {
  show: Show;
  featured?: boolean;
}) {
  const { month, day } = monthDay(show.date);
  const remaining = show.total_seats - show.tickets_sold;

  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col gap-4 ${
        featured
          ? "border-navy bg-navy text-white"
          : "border-gray-200 bg-white text-navy"
      }`}
    >
      {featured && (
        <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
          Next Show
        </span>
      )}

      <div className="flex items-start gap-5">
        <div
          className={`flex flex-col items-center justify-center rounded-xl px-4 py-3 min-w-[60px] ${
            featured ? "bg-white/10" : "bg-surface"
          }`}
        >
          <span className={`text-xs font-bold tracking-widest ${featured ? "text-white/50" : "text-muted"}`}>
            {month}
          </span>
          <span className={`text-2xl font-bold leading-none ${featured ? "text-white" : "text-navy"}`}>
            {day}
          </span>
        </div>

        <div>
          <h3 className="font-semibold text-lg leading-tight">{show.title}</h3>
          <p className={`text-sm mt-0.5 ${featured ? "text-white/60" : "text-muted"}`}>
            {show.venue}
          </p>
          <p className={`text-sm ${featured ? "text-white/50" : "text-muted"}`}>
            {formatDate(show.date)} · {show.time}
          </p>
          <p className={`text-sm mt-2 ${featured ? "text-white/70" : "text-gray-600"}`}>
            {show.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-current/10">
        <div>
          {show.price_cents !== null ? (
            <>
              <span className="font-bold text-xl">${show.price_cents / 100}</span>
              <span className={`text-xs ml-1.5 ${featured ? "text-white/50" : "text-muted"}`}>
                per ticket
              </span>
            </>
          ) : (
            <span className={`text-sm ${featured ? "text-white/50" : "text-muted"}`}>
              Tickets coming soon
            </span>
          )}
          {show.tickets_open && remaining <= 20 && (
            <p className={`text-xs mt-0.5 font-medium ${remaining <= 5 ? "text-red-400" : "text-yellow-400"}`}>
              Only {remaining} left!
            </p>
          )}
        </div>

        {show.tickets_open ? (
          <Link
            href={`/tickets?show=${show.id}`}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              featured
                ? "bg-white text-navy hover:bg-white/90"
                : "bg-navy text-white hover:bg-navy-light"
            }`}
          >
            Reserve
          </Link>
        ) : (
          <span className={`px-5 py-2 rounded-full text-sm font-semibold opacity-40 ${
            featured ? "bg-white text-navy" : "bg-gray-200 text-navy"
          }`}>
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );
}
