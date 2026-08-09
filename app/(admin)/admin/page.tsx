import { createClient } from "@/lib/supabase/server";
import type { Show, Reservation } from "@/lib/types";

type ReservationWithShow = Reservation & {
  shows: { title: string; time: string } | null;
};

export const metadata = { title: "Dashboard — Upstage Admin" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [showsResult, reservationsResult, allReservationsResult, membersResult] =
    supabase
      ? await Promise.all([
          supabase.from("shows").select("*").order("date", { ascending: true }),
          supabase.from("reservations").select("*, shows(title, time)").order("created_at", { ascending: false }).limit(10),
          supabase.from("reservations").select("qty, status"),
          supabase.from("members").select("*", { count: "exact", head: true }),
        ])
      : [{ data: null }, { data: null }, { data: null }, { count: null }];

  const shows = showsResult.data as Show[] | null;
  const reservations = reservationsResult.data as ReservationWithShow[] | null;
  const allReservations = allReservationsResult.data as
    | Pick<Reservation, "qty" | "status">[]
    | null;
  const memberCount = membersResult.count;

  const totalTickets =
    allReservations
      ?.filter((r) => r.status !== "cancelled")
      .reduce((sum, r) => sum + r.qty, 0) ?? 0;

  const pendingCount =
    allReservations?.filter((r) => r.status === "pending").length ?? 0;

  const upcomingShows = shows?.filter((s) => s.tickets_open) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Upcoming Shows", value: upcomingShows.length },
          { label: "Total Tickets Reserved", value: totalTickets },
          { label: "Members", value: memberCount ?? 0 },
          { label: "Pending Reservations", value: pendingCount },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-3xl font-bold text-navy">{stat.value}</p>
            <p className="text-sm text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent reservations */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-navy">Recent Reservations</h2>
          <a href="/admin/reservations" className="text-sm text-navy/60 hover:text-navy">
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-muted text-xs uppercase tracking-widest">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Show</th>
                <th className="px-6 py-3">Qty</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {reservations?.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-surface">
                  <td className="px-6 py-3 font-medium text-navy">{r.name}</td>
                  <td className="px-6 py-3 text-muted">
                    {r.shows?.title} — {r.shows?.time}
                  </td>
                  <td className="px-6 py-3">{r.qty}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-3 text-muted">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!reservations || reservations.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted">
                    No reservations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    confirmed: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
