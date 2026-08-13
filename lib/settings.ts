import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

/**
 * Fallbacks used when Supabase is unreachable or the row is missing.
 *
 * These mirror the copy that was previously hardcoded into the pages, so a
 * database outage degrades to the site as it reads today rather than to blanks.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  hero_tagline: "",
  about_description:
    "Upstage A Cappella is the University of Pennsylvania's premier musical co-ed a cappella group. We perform original arrangements from musicals, shows, and movies. We audition each semester and welcome singers of all voices and backgrounds.",

  current_show_heading: "Spring Show 2026:",
  current_show_title: "Bet On It!",
  current_show_description:
    "This semester, we performed songs from The Greatest Showman, Phantom of the Opera, The Hunger Games, and more.\n\nListen to an arrangement of ours here, or check out more on our YouTube channel!",
  featured_video_id: "56sSdRaITE8",

  auditions_heading: "Join us!",
  auditions_description:
    "We hold auditions at the start of every semester. No experience with a cappella required, just bring a song you love! Drop us your email for further information on the process!",
  auditions_page_intro:
    "We host auditions at the beginning of each semester. Leave your email below and we'll send you all of the details when the time comes!",
  auditions_what_to_expect:
    "The audition process is nothing to stress about! Just prepare a 30 second to 1 minute snippet of a song you'd like to perform for us (doesn't have to be Upstage related!). We'll also run a few pitch matching exercises and some warmups.\n\nCallbacks happen less than a week after the initial audition. Stay tuned with ACK (A Cappella Council) for more information on callbacks and the overall process.",

  contact_email: "upstage.upenn@gmail.com",
  venmo_handle: "@upstage-acappella",
  instagram_url: "https://instagram.com/upstageacappella",
  youtube_url: "https://www.youtube.com/@UpstageACappellaUPenn",
  tiktok_url: "",
  spotify_url: "",
};

/**
 * Splits a settings textarea into paragraphs on blank lines.
 *
 * Admins type into a plain textarea, so this is the only formatting control
 * they get — and it's the one they'll reach for by instinct. Returning an array
 * (rather than injecting HTML) keeps anything typed here inert as markup.
 */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// cache() deduplicates this across all server components in a single render
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = await createClient();
  if (!supabase) return DEFAULT_SETTINGS;
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  // Column-level merge, not `?? DEFAULT_SETTINGS`: right after a migration the
  // row exists but new columns are null, and a whole-object fallback would be
  // skipped, blanking those sections instead of falling back per field.
  const row = data as Partial<SiteSettings> | null;
  if (!row) return DEFAULT_SETTINGS;

  const merged = { ...DEFAULT_SETTINGS };
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
    const value = row[key];
    // null/undefined only. An empty string is a deliberate choice — clearing
    // the TikTok URL has to actually clear it, not resurrect the default.
    if (value !== null && value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (merged as any)[key] = value;
    }
  }
  return merged;
});
