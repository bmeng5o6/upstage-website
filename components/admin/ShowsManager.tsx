"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Show } from "@/lib/types";

type ShowInput = {
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  price_cents: string;
  total_seats: string;
  tickets_open: boolean;
};

const EMPTY: ShowInput = {
  title: "",
  date: "",
  time: "",
  venue: "",
  description: "",
  price_cents: "",
  total_seats: "100",
  tickets_open: false,
};

export default function ShowsManager({ initialShows }: { initialShows: Show[] }) {
  const [shows, setShows] = useState<Show[]>(initialShows);
  const [editing, setEditing] = useState<Show | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ShowInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function openCreate() {
    setForm(EMPTY);
    setEditing(null);
    setCreating(true);
  }

  function openEdit(show: Show) {
    setForm({
      title: show.title,
      date: show.date,
      time: show.time,
      venue: show.venue,
      description: show.description ?? "",
      price_cents: show.price_cents !== null ? (show.price_cents / 100).toString() : "",
      total_seats: show.total_seats.toString(),
      tickets_open: show.tickets_open,
    });
    setEditing(show);
    setCreating(false);
  }

  async function saveShow() {
    setSaving(true);
    const payload = {
      title: form.title,
      date: form.date,
      time: form.time,
      venue: form.venue,
      description: form.description || null,
      price_cents: form.price_cents ? Math.round(parseFloat(form.price_cents) * 100) : null,
      total_seats: parseInt(form.total_seats, 10),
      tickets_open: form.tickets_open,
    };

    if (editing) {
      const { data } = await supabase
        .from("shows")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();
      if (data) setShows((prev) => prev.map((s) => (s.id === data.id ? data : s)));
    } else {
      const { data } = await supabase
        .from("shows")
        .insert({ ...payload, tickets_sold: 0 })
        .select()
        .single();
      if (data) setShows((prev) => [...prev, data]);
    }

    setSaving(false);
    setEditing(null);
    setCreating(false);
    router.refresh();
  }

  async function toggleOpen(show: Show) {
    const { data } = await supabase
      .from("shows")
      .update({ tickets_open: !show.tickets_open })
      .eq("id", show.id)
      .select()
      .single();
    if (data) setShows((prev) => prev.map((s) => (s.id === data.id ? data : s)));
  }

  async function deleteShow(id: string) {
    if (!confirm("Delete this show? All reservations will also be deleted.")) return;
    await supabase.from("shows").delete().eq("id", id);
    setShows((prev) => prev.filter((s) => s.id !== id));
  }

  const isOpen = creating || editing !== null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted">{shows.length} show{shows.length !== 1 ? "s" : ""}</p>
        <button
          onClick={openCreate}
          className="px-5 py-2 rounded-full bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors"
        >
          + Add Show
        </button>
      </div>

      {/* Form */}
      {isOpen && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-navy mb-5">{editing ? "Edit Show" : "New Show"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Date">
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Time">
              <input value={form.time} placeholder="7:00 PM" onChange={(e) => setForm({ ...form, time: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Venue">
              <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Price ($) — leave blank if TBD">
              <input type="number" step="0.01" value={form.price_cents} placeholder="8.00" onChange={(e) => setForm({ ...form, price_cents: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Total Seats">
              <input type="number" value={form.total_seats} onChange={(e) => setForm({ ...form, total_seats: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea value={form.description} rows={2} onChange={(e) => setForm({ ...form, description: e.target.value })} className={INPUT + " resize-none"} />
            </Field>
            <div className="flex items-center gap-3 sm:col-span-2">
              <input
                type="checkbox"
                id="tickets-open"
                checked={form.tickets_open}
                onChange={(e) => setForm({ ...form, tickets_open: e.target.checked })}
                className="w-4 h-4 accent-navy"
              />
              <label htmlFor="tickets-open" className="text-sm font-medium text-navy">
                Tickets open (visible to public)
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={saveShow} disabled={saving} className="px-6 py-2 rounded-full bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors disabled:opacity-50">
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => { setEditing(null); setCreating(false); }} className="px-6 py-2 rounded-full border border-gray-200 text-sm text-muted hover:text-navy transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Shows list */}
      <div className="space-y-3">
        {shows.map((show) => (
          <div key={show.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-navy">{show.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${show.tickets_open ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {show.tickets_open ? "Open" : "Closed"}
                </span>
              </div>
              <p className="text-sm text-muted mt-0.5">
                {show.date} · {show.time} · {show.venue}
              </p>
              <p className="text-xs text-muted mt-1">
                {show.tickets_sold}/{show.total_seats} seats reserved
                {show.price_cents !== null ? ` · $${show.price_cents / 100}` : " · Price TBD"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleOpen(show)}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-muted hover:text-navy hover:border-navy transition-colors"
              >
                {show.tickets_open ? "Close Sales" : "Open Sales"}
              </button>
              <button onClick={() => openEdit(show)} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-muted hover:text-navy hover:border-navy transition-colors">
                Edit
              </button>
              <button onClick={() => deleteShow(show.id)} className="text-xs px-3 py-1.5 rounded-full border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
        {shows.length === 0 && (
          <p className="text-muted text-sm py-8 text-center">No shows yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-medium text-navy uppercase tracking-widest">{label}</span>
      {children}
    </div>
  );
}

const INPUT = "rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition w-full";
