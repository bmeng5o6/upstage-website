"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Show } from "@/lib/types";

type FormState = "idle" | "submitting" | "success" | "error";

export default function TicketForm() {
  const params = useSearchParams();
  const preselected = params.get("show") ?? "";

  const [shows, setShows] = useState<Show[]>([]);
  const [selectedShowId, setSelectedShowId] = useState(preselected);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  // Load open shows
  useEffect(() => {
    supabase
      .from("shows")
      .select("*")
      .eq("tickets_open", true)
      .order("date", { ascending: true })
      .then(({ data }) => {
        if (data) setShows(data);
      });
  }, []);

  // Update selected show + subscribe to real-time seat count
  useEffect(() => {
    const show = shows.find((s) => s.id === selectedShowId) ?? null;
    setSelectedShow(show);

    if (!show) return;

    const channel = supabase
      .channel(`show-seats-${show.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "shows",
          filter: `id=eq.${show.id}`,
        },
        (payload) => {
          setSelectedShow((prev) =>
            prev ? { ...prev, ...(payload.new as Partial<Show>) } : prev
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedShowId, shows]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedShow) return;
    setFormState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const qty = parseInt(fd.get("qty") as string, 10);
    const remaining = selectedShow.total_seats - selectedShow.tickets_sold;

    if (qty > remaining) {
      setErrorMsg(`Only ${remaining} seat${remaining === 1 ? "" : "s"} remaining for this show.`);
      setFormState("error");
      return;
    }

    const { error } = await supabase.from("reservations").insert({
      show_id: selectedShow.id,
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      qty,
      notes: (fd.get("notes") as string) || null,
      status: "pending",
    });

    if (error) {
      setErrorMsg("Something went wrong. Please try again or email us directly.");
      setFormState("error");
      return;
    }

    // Increment tickets_sold on the show
    await supabase
      .from("shows")
      .update({ tickets_sold: selectedShow.tickets_sold + qty })
      .eq("id", selectedShow.id);

    setFormState("success");
    form.reset();
    setSelectedShowId("");
  }

  const remaining = selectedShow
    ? selectedShow.total_seats - selectedShow.tickets_sold
    : null;

  if (formState === "success") {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="text-2xl font-bold text-navy mb-2">
          You&apos;re on the list!
        </h3>
        <p className="text-muted">
          Check your inbox for a confirmation. We&apos;ll see you at the show.
        </p>
        <p className="text-sm text-muted mt-4">
          Questions? Email{" "}
          <a href="mailto:upstage@upenn.edu" className="text-navy underline">
            upstage@upenn.edu
          </a>
        </p>
        <button
          onClick={() => setFormState("idle")}
          className="mt-8 text-sm text-navy underline"
        >
          Reserve more tickets
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-navy">Full Name</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-navy">Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="you@email.com"
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-navy">Show</span>
          <select
            name="show"
            required
            value={selectedShowId}
            onChange={(e) => setSelectedShowId(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition appearance-none bg-white"
          >
            <option value="" disabled>Select a show…</option>
            {shows.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} — {s.time}
              </option>
            ))}
          </select>
          {remaining !== null && (
            <span className={`text-xs font-medium ${remaining <= 5 ? "text-red-500" : remaining <= 20 ? "text-yellow-600" : "text-green-600"}`}>
              {remaining} seat{remaining === 1 ? "" : "s"} remaining
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-navy">Tickets</span>
          <select
            name="qty"
            required
            defaultValue="1"
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition appearance-none bg-white"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-navy">
          Notes <span className="text-muted font-normal">(optional)</span>
        </span>
        <textarea
          name="notes"
          rows={3}
          placeholder="Accessibility needs, etc."
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition resize-none"
        />
      </label>

      {formState === "error" && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={formState === "submitting" || (remaining !== null && remaining === 0)}
        className="w-full py-3.5 rounded-full bg-navy text-white font-semibold text-sm hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {remaining === 0
          ? "Sold Out"
          : formState === "submitting"
          ? "Submitting…"
          : "Reserve Tickets →"}
      </button>

      <p className="text-xs text-center text-muted">
        Confirmed after payment via Venmo{" "}
        <strong>@upstage-acappella</strong> or cash at the door.
        We&apos;ll follow up within 24 hours.
      </p>
    </form>
  );
}
