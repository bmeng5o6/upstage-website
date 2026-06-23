"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ReservationRow = {
  id: string;
  show_id: string;
  name: string;
  email: string;
  qty: number;
  notes: string | null;
  status: string;
  created_at: string;
  shows: { title: string; time: string; date: string } | null;
};

type ShowOption = { id: string; title: string; time: string; date: string };

export default function ReservationsTable({
  initialReservations,
  shows,
}: {
  initialReservations: ReservationRow[];
  shows: ShowOption[];
}) {
  const [reservations, setReservations] = useState(initialReservations);
  const [filterShow, setFilterShow] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const supabase = createClient();

  async function updateStatus(id: string, status: string) {
    await supabase.from("reservations").update({ status }).eq("id", id);
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  const filtered = reservations.filter((r) => {
    if (filterShow !== "all" && r.show_id !== filterShow) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  const totalTickets = filtered
    .filter((r) => r.status !== "cancelled")
    .reduce((sum, r) => sum + r.qty, 0);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterShow}
          onChange={(e) => setFilterShow(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
        >
          <option value="all">All Shows</option>
          {shows.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} — {s.time}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <p className="text-sm text-muted self-center ml-auto">
          {filtered.length} reservation{filtered.length !== 1 ? "s" : ""} · {totalTickets} ticket{totalTickets !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-muted text-xs uppercase tracking-widest">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Show</th>
                <th className="px-5 py-3">Qty</th>
                <th className="px-5 py-3">Notes</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-surface">
                  <td className="px-5 py-3 font-medium text-navy whitespace-nowrap">{r.name}</td>
                  <td className="px-5 py-3 text-muted">
                    <a href={`mailto:${r.email}`} className="hover:text-navy">{r.email}</a>
                  </td>
                  <td className="px-5 py-3 text-muted whitespace-nowrap">
                    {r.shows?.title} — {r.shows?.time}
                  </td>
                  <td className="px-5 py-3">{r.qty}</td>
                  <td className="px-5 py-3 text-muted max-w-[160px] truncate">{r.notes ?? "—"}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-3 text-muted whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      {r.status !== "confirmed" && (
                        <button
                          onClick={() => updateStatus(r.id, "confirmed")}
                          className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {r.status !== "cancelled" && (
                        <button
                          onClick={() => updateStatus(r.id, "cancelled")}
                          className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      {r.status !== "pending" && (
                        <button
                          onClick={() => updateStatus(r.id, "pending")}
                          className="text-xs px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
                        >
                          Pending
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-muted">
                    No reservations found.
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
