"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { shows } from "@/data/shows";

// Sign up for a free Formspree account at formspree.io and replace this with your form ID.
const FORMSPREE_ID = "mykqzvnw";

type FormState = "idle" | "submitting" | "success" | "error";

export default function TicketForm() {
  const params = useSearchParams();
  const preselected = params.get("show") ?? "";

  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const openShows = shows.filter((s) => s.ticketsOpen);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setState("success");
        form.reset();
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(
          (json as { error?: string }).error ??
            "Something went wrong. Please try again or email us directly."
        );
        setState("error");
      }
    } catch {
      setErrorMsg("Network error — please check your connection and try again.");
      setState("error");
    }
  }

  if (state === "success") {
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
          Questions? Email us at{" "}
          <a
            href="mailto:upstage@cornell.edu"
            className="text-navy underline"
          >
            upstage@cornell.edu
          </a>
        </p>
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
            defaultValue={preselected}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition appearance-none bg-white"
          >
            <option value="" disabled>
              Select a show…
            </option>
            {openShows.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} — {s.time}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-navy">
            Number of Tickets
          </span>
          <select
            name="qty"
            required
            defaultValue="1"
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition appearance-none bg-white"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-navy">
          Notes{" "}
          <span className="text-muted font-normal">(optional)</span>
        </span>
        <textarea
          name="notes"
          rows={3}
          placeholder="Accessibility needs, etc."
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition resize-none"
        />
      </label>

      {state === "error" && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full py-3.5 rounded-full bg-navy text-white font-semibold text-sm hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === "submitting" ? "Submitting…" : "Reserve Tickets →"}
      </button>

      <p className="text-xs text-center text-muted">
        Tickets are confirmed after payment via Venmo{" "}
        <strong>@upstage-acappella</strong> or cash at the door. We&apos;ll
        follow up within 24 hours.
      </p>
    </form>
  );
}
