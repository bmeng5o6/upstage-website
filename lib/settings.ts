import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  member_count: "13",
  show_count: "20+",
  about_description:
    "Upstage A Cappella is the University of Pennsylvania's premier musical co-ed a cappella group. We perform original arrangements from musicals, shows, and movies. We audition each semester and welcome singers of all voices and backgrounds.",
  hero_tagline: "",
  contact_email: "upstage.upenn@gmail.com",
  venmo_handle: "@upstage-acappella",
  instagram_url: "https://instagram.com/upstageacappella",
  youtube_url: "https://www.youtube.com/@UpstageACappellaUPenn",
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
