"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { InterestSignup } from "@/lib/types";

/**
 * Builds a CSV and hands it to the browser as a download.
 *
 * This is the export path for the mailing list until an email provider is
 * wired up: filter here, export, paste into whatever you send from.
 */
function downloadCsv(rows: InterestSignup[]) {
  const headers = [
    "Name",
    "Email",
    "Class Year",
    "Voice Part",
    "Subscribed",
    "Notes",
    "Signed Up",
  ];

  // A field containing a comma, quote or newline has to be quoted, and inner
  // quotes doubled — a name like O'Brien is fine, but "Smith, Jr." would
  // silently split into two columns without this.
  const escape = (value: string | null) => {
    const v = value ?? "";
    return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  };

  const body = rows.map((r) =>
    [
      r.name,
      r.email,
      r.grad_year,
      r.voice_part,
      r.subscribed ? "yes" : "no",
      r.notes,
      new Date(r.created_at).toLocaleDateString(),
    ]
      .map(escape)
      .join(",")
  );

  const csv = [headers.join(","), ...body].join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" })
  );

  const link = document.createElement("a");
  link.href = url;
  link.download = `upstage-audition-interest-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AuditionInterests({
  initialSignups,
}: {
  initialSignups: InterestSignup[];
}) {
  const [signups, setSignups] = useState(initialSignups);
  const [query, setQuery] = useState("");
  const [filterSubscribed, setFilterSubscribed] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const supabase = createClient();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return signups.filter((s) => {
      if (filterSubscribed === "yes" && !s.subscribed) return false;
      if (filterSubscribed === "no" && s.subscribed) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.voice_part ?? "").toLowerCase().includes(q)
      );
    });
  }, [signups, query, filterSubscribed]);

  const subscribedCount = filtered.filter((s) => s.subscribed).length;

  async function remove(id: string) {
    // Deleting someone's contact details is not undoable from this screen.
    if (!confirm("Delete this signup? This can't be undone.")) return;

    setDeletingId(id);
    const { error } = await supabase
      .from("interest_signups")
      .delete()
      .eq("id", id);
    setDeletingId(null);

    if (error) {
      alert(`Could not delete: ${error.message}`);
      return;
    }
    setSignups((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, part…"
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 min-w-[220px]"
        />
        <select
          value={filterSubscribed}
          onChange={(e) => setFilterSubscribed(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
        >
          <option value="all">Everyone</option>
          <option value="yes">Opted in to email</option>
          <option value="no">Not opted in</option>
        </select>

        <button
          onClick={() => downloadCsv(filtered)}
          disabled={filtered.length === 0}
          className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Export CSV
        </button>

        <p className="text-sm text-muted self-center ml-auto">
          {filtered.length} signup{filtered.length !== 1 ? "s" : ""} ·{" "}
          {subscribedCount} opted in
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-muted text-xs uppercase tracking-widest">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Year</th>
                <th className="px-5 py-3">Part</th>
                <th className="px-5 py-3">Email opt-in</th>
                <th className="px-5 py-3">Notes</th>
                <th className="px-5 py-3">Signed up</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-50 hover:bg-surface"
                >
                  <td className="px-5 py-3 font-medium text-navy whitespace-nowrap">
                    {s.name}
                  </td>
                  <td className="px-5 py-3 text-muted">
                    <a href={`mailto:${s.email}`} className="hover:text-navy">
                      {s.email}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-muted">{s.grad_year ?? "—"}</td>
                  <td className="px-5 py-3 text-muted whitespace-nowrap">
                    {s.voice_part ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        s.subscribed
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {s.subscribed ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted max-w-[200px] truncate">
                    {s.notes ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-muted whitespace-nowrap">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => remove(s.id)}
                      disabled={deletingId === s.id}
                      className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deletingId === s.id ? "…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-muted">
                    {signups.length === 0
                      ? "No signups yet."
                      : "No signups match those filters."}
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
