import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  member_count: "XX",
  show_count: "XX+",
  about_description:
    "Upstage A Cappella is the University of Pennsylvania's premier co-ed a cappella group. We've been bringing vocal harmony to stages across campus and beyond — blending contemporary pop, R&B, and original arrangements performed entirely with the human voice. We audition each semester and welcome singers of all backgrounds.",
  hero_tagline: "All voice. All heart. No instruments needed.",
  contact_email: "upstage@upenn.edu",
  venmo_handle: "@upstage-acappella",
  instagram_url: "",
  youtube_url: "",
  tiktok_url: "",
  spotify_url: "",
};

// cache() deduplicates this across all server components in a single render
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = await createClient();
  if (!supabase) return DEFAULT_SETTINGS;
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  return (data as SiteSettings | null) ?? DEFAULT_SETTINGS;
});
