export type Show = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string | null;
  price_cents: number | null;
  total_seats: number;
  tickets_sold: number;
  tickets_open: boolean;
  created_at: string;
};

export type Reservation = {
  id: string;
  show_id: string;
  name: string;
  email: string;
  qty: number;
  notes: string | null;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
};

export type InterestSignup = {
  id: string;
  name: string;
  email: string;
  grad_year: string | null;
  voice_part: string | null;
  notes: string | null;
  subscribed: boolean;
  /** Null until pushed to an email provider; nothing sets it yet. */
  synced_at: string | null;
  created_at: string;
};

export type Member = {
  id: string;
  name: string;
  part: string;
  year: string | null;
  major: string | null;
  bio: string | null;
  photo_url: string | null;
  display_order: number;
  created_at: string;
};

export type Video = {
  id: string;
  youtube_id: string;
  title: string;
  show_name: string | null;
  year: number | null;
  display_order: number;
};

export type SiteSettings = {
  id: number;
  member_count: string;
  show_count: string;
  about_description: string;
  hero_tagline: string;
  contact_email: string;
  venmo_handle: string;
  instagram_url: string;
  youtube_url: string;
  tiktok_url: string;
  spotify_url: string;
};

export type Profile = {
  id: string;
  role: "admin" | "super_admin";
  name: string | null;
};

export type Database = {
  public: {
    Tables: {
      shows: { Row: Show; Insert: Omit<Show, "id" | "created_at">; Update: Partial<Omit<Show, "id" | "created_at">> };
      reservations: { Row: Reservation; Insert: Omit<Reservation, "id" | "created_at">; Update: Partial<Omit<Reservation, "id" | "created_at">> };
      interest_signups: { Row: InterestSignup; Insert: Omit<InterestSignup, "id" | "created_at">; Update: Partial<Omit<InterestSignup, "id" | "created_at">> };
      members: { Row: Member; Insert: Omit<Member, "id" | "created_at">; Update: Partial<Omit<Member, "id" | "created_at">> };
      videos: { Row: Video; Insert: Omit<Video, "id">; Update: Partial<Omit<Video, "id">> };
      profiles: { Row: Profile; Insert: Profile; Update: Partial<Profile> };
    };
  };
};
