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
      {/* About Section */}
      <Section title="About Section">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Member Count">
            <input
              value={form.member_count}
              onChange={(e) => set("member_count", e.target.value)}
              placeholder="24"
              className={INPUT}
            />
          </Field>
          <Field label="Show Count">
            <input
              value={form.show_count}
              onChange={(e) => set("show_count", e.target.value)}
              placeholder="30+"
              className={INPUT}
            />
          </Field>
        </div>
        <Field label="About Description" hint="Shown in the About section on the homepage">
          <textarea
            value={form.about_description}
            onChange={(e) => set("about_description", e.target.value)}
            rows={4}
            className={INPUT + " resize-none"}
          />
        </Field>
      </Section>

      {/* Hero */}
      <Section title="Hero Section">
        <Field label="Tagline" hint="The one-liner shown on the front page">
          <input
            value={form.hero_tagline}
            onChange={(e) => set("hero_tagline", e.target.value)}
            placeholder=""
            className={INPUT}
          />
        </Field>
      </Section>

      {/* Contact */}
      <Section title="Contact & Payment">
        <Field label="Contact Email">
          <input
            type="email"
            value={form.contact_email}
            onChange={(e) => set("contact_email", e.target.value)}
            placeholder="upstage.upenn@gmail.com"
            className={INPUT}
          />
        </Field>
        <Field label="Venmo Handle" hint="Shown on the tickets page">
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
            ✓ Saved — changes are live on the site
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
