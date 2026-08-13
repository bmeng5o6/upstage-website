"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";

const INPUT = "rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition w-full";

function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-widest text-navy">
        {label}
      </span>
      {hint && <span className="text-xs text-muted -mt-1">{hint}</span>}
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
      <h2 className="font-semibold text-navy text-base border-b border-gray-100 pb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const [form, setForm] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const supabase = createClient();

  function set(key: keyof SiteSettings, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setErrorMsg("");
  }

  async function handleSave() {
    setSaving(true);
    setErrorMsg("");

    // The row always exists (seeded by the schema), so update it directly.
    // upsert would need an INSERT policy on site_settings, which there isn't.
    const { id: _id, ...fields } = form;
    const { error } = await supabase
      .from("site_settings")
      .update(fields)
      .eq("id", 1);

    setSaving(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Hero — first thing on the homepage, so it comes first here too. The
          panel is ordered to match a top-to-bottom walk of the public site. */}
      <Section title="Homepage: Hero">
        <Field label="Tagline" hint="The one-liner over the hero video">
          <input
            value={form.hero_tagline}
            onChange={(e) => set("hero_tagline", e.target.value)}
            className={INPUT}
          />
        </Field>
      </Section>

      {/* About */}
      <Section title="Homepage: About">
        <Field label="About Description" hint="The paragraph beside the group photo">
          <textarea
            value={form.about_description}
            onChange={(e) => set("about_description", e.target.value)}
            rows={5}
            className={INPUT + " resize-none"}
          />
        </Field>
      </Section>

      {/* Current show — the section that changes every semester. */}
      <Section title="Homepage: Current Show">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Heading">
            <input
              value={form.current_show_heading}
              onChange={(e) => set("current_show_heading", e.target.value)}
              placeholder="Spring Show 2026:"
              className={INPUT}
            />
          </Field>
          <Field label="Show Title">
            <input
              value={form.current_show_title}
              onChange={(e) => set("current_show_title", e.target.value)}
              placeholder="Bet On It!"
              className={INPUT}
            />
          </Field>
        </div>
        <Field
          label="Description"
          hint="Leave a blank line between paragraphs to split them"
        >
          <textarea
            value={form.current_show_description}
            onChange={(e) => set("current_show_description", e.target.value)}
            rows={6}
            className={INPUT + " resize-none"}
          />
        </Field>
        <Field
          label="Featured Video"
          hint="YouTube ID only: the part after v=, not the whole URL"
        >
          <input
            value={form.featured_video_id}
            onChange={(e) => set("featured_video_id", e.target.value)}
            placeholder="56sSdRaITE8"
            className={INPUT}
          />
        </Field>
        {form.featured_video_id && (
          <p className="text-xs text-muted -mt-2">
            Preview:{" "}
            <a
              href={`https://www.youtube.com/watch?v=${form.featured_video_id}`}
              target="_blank"
              rel="noreferrer"
              className="text-navy underline"
            >
              youtube.com/watch?v={form.featured_video_id}
            </a>
          </p>
        )}
      </Section>

      {/* Auditions — homepage CTA plus the /auditions page body. */}
      <Section title="Auditions">
        <Field label="Homepage Heading">
          <input
            value={form.auditions_heading}
            onChange={(e) => set("auditions_heading", e.target.value)}
            placeholder="Join us!"
            className={INPUT}
          />
        </Field>
        <Field
          label="Homepage Blurb"
          hint="The paragraph above the “Audition Info” button"
        >
          <textarea
            value={form.auditions_description}
            onChange={(e) => set("auditions_description", e.target.value)}
            rows={4}
            className={INPUT + " resize-none"}
          />
        </Field>
        <Field
          label="Auditions Page: Intro"
          hint="Under “Interested in joining us?” on auditions page"
        >
          <textarea
            value={form.auditions_page_intro}
            onChange={(e) => set("auditions_page_intro", e.target.value)}
            rows={4}
            className={INPUT + " resize-none"}
          />
        </Field>
        <Field
          label="Auditions Page: What to Expect"
          hint="Blank line between paragraphs"
        >
          <textarea
            value={form.auditions_what_to_expect}
            onChange={(e) => set("auditions_what_to_expect", e.target.value)}
            rows={7}
            className={INPUT + " resize-none"}
          />
        </Field>
      </Section>

      {/* Contact */}
      <Section title="Contact & Payment">
        <Field label="Contact Email" hint="Linked in the footer">
          <input
            type="email"
            value={form.contact_email}
            onChange={(e) => set("contact_email", e.target.value)}
            placeholder="upstage.upenn@gmail.com"
            className={INPUT}
          />
        </Field>
        <Field
          label="Venmo Handle"
          hint="Shown on the tickets page and under the reservation form"
        >
          <input
            value={form.venmo_handle}
            onChange={(e) => set("venmo_handle", e.target.value)}
            placeholder="@upstage-acappella"
            className={INPUT}
          />
        </Field>
      </Section>

      {/* Social */}
      <Section title="Social Media">
        <Field label="Instagram URL" hint="Full URL, e.g. https://instagram.com/upstageacappella">
          <input
            value={form.instagram_url}
            onChange={(e) => set("instagram_url", e.target.value)}
            placeholder="https://instagram.com/upstageacappella"
            className={INPUT}
          />
        </Field>
        <Field label="YouTube URL">
          <input
            value={form.youtube_url}
            onChange={(e) => set("youtube_url", e.target.value)}
            placeholder="https://www.youtube.com/@UpstageACappellaUPenn"
            className={INPUT}
          />
        </Field>
        <Field label="TikTok URL">
          <input
            value={form.tiktok_url}
            onChange={(e) => set("tiktok_url", e.target.value)}
            placeholder="https://tiktok.com/@upstageacappella"
            className={INPUT}
          />
        </Field>
        <Field label="Spotify URL">
          <input
            value={form.spotify_url}
            onChange={(e) => set("spotify_url", e.target.value)}
            placeholder="https://open.spotify.com/artist/..."
            className={INPUT}
          />
        </Field>
      </Section>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-full bg-navy text-white font-semibold text-sm hover:bg-navy-light transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">
            Saved! Changes are live on the site
          </span>
        )}
        {errorMsg && (
          <span className="text-sm text-red-600 font-medium">
            Couldn&apos;t save: {errorMsg}
          </span>
        )}
      </div>
    </div>
  );
}
