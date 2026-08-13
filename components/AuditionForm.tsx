"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type FormState = "idle" | "submitting" | "success" | "error";

const VOICE_PARTS = ["Soprano", "Alto", "Tenor", "Bass", "Beatboxer", "Not sure"];

const INPUT_CLASS =
  "rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition bg-white";

export default function AuditionForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Writes go through the RPC rather than a table insert: RLS blocks
    // anonymous inserts on interest_signups on purpose, since the anon key is
    // in every browser. The function validates and upserts on the email.
    const { error } = await supabase.rpc("submit_interest", {
      p_name: fd.get("name") as string,
      p_email: fd.get("email") as string,
      p_grad_year: (fd.get("grad_year") as string) || null,
      p_voice_part: (fd.get("voice_part") as string) || null,
      p_notes: (fd.get("notes") as string) || null,
      p_subscribed: fd.get("subscribed") === "on",
    });

    if (error) {
      setErrorMsg(error.message);
      setFormState("error");
      return;
    }

    setFormState("success");
    form.reset();
  }

  if (formState === "success") {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="font-display text-2xl font-bold text-navy mb-2">
          You&apos;re on the list!
        </h3>
        <p className="text-muted max-w-sm mx-auto">
          We&apos;ll email you as soon as audition dates and times are set.
        </p>
        <p className="text-sm text-muted mt-4">
          Questions in the meantime? Email{" "}
          <a href="mailto:upstage@upenn.edu" className="text-navy underline">
            upstage.upenn@gmail.com
          </a>
        </p>
        <button
          onClick={() => setFormState("idle")}
          className="mt-8 text-sm text-navy underline"
        >
          Sign up someone else
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
            autoComplete="name"
            className={INPUT_CLASS}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-navy">Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="you@upenn.edu"
            autoComplete="email"
            className={INPUT_CLASS}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-navy">
            Class Year <span className="text-muted font-normal">(optional)</span>
          </span>
          <input
            type="text"
            name="grad_year"
            placeholder="2029"
            inputMode="numeric"
            className={INPUT_CLASS}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-navy">
            Voice Part <span className="text-muted font-normal">(optional)</span>
          </span>
          {/* "Not sure" is a real option on purpose — requiring people to
              self-classify is exactly the kind of friction that stops a
              first-year from filling this in at all. */}
          <select
            name="voice_part"
            defaultValue=""
            className={`${INPUT_CLASS} appearance-none bg-white`}
          >
            <option value="">Select…</option>
            {VOICE_PARTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-navy">
          Anything else? <span className="text-muted font-normal">(optional)</span>
        </span>
        <textarea
          name="notes"
          rows={3}
          placeholder="Questions, scheduling conflicts, previous experience…"
          className={`${INPUT_CLASS} resize-none`}
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-gray-600">
        <input
          type="checkbox"
          name="subscribed"
          defaultChecked
          className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-navy"
        />
        <span>
          Email me about auditions and upcoming shows. You can unsubscribe any
          time.
        </span>
      </label>

      {formState === "error" && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={formState === "submitting"}
        className="w-full py-3.5 rounded-full bg-navy text-white font-semibold text-sm hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formState === "submitting" ? "Submitting…" : "Submit"}
      </button>

      <p className="text-xs text-center text-muted">
        No audition experience required! We&apos;ll only use your email to send
        audition details.
      </p>
    </form>
  );
}
