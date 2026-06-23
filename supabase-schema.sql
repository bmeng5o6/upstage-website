-- Upstage A Cappella — Supabase Schema
-- Run this in the Supabase dashboard: SQL Editor → New query → paste → Run

-- Shows
create table if not exists shows (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date date not null,
  time text not null,
  venue text not null,
  description text,
  price_cents integer,
  total_seats integer not null default 100,
  tickets_sold integer not null default 0,
  tickets_open boolean not null default false,
  created_at timestamptz default now()
);

-- Ticket reservations
create table if not exists reservations (
  id uuid default gen_random_uuid() primary key,
  show_id uuid references shows(id) on delete cascade not null,
  name text not null,
  email text not null,
  qty integer not null default 1 check (qty >= 1 and qty <= 8),
  notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz default now()
);

-- Members
create table if not exists members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  part text not null,
  year text,
  major text,
  bio text,
  photo_url text,
  display_order integer default 0,
  created_at timestamptz default now()
);

-- Videos
create table if not exists videos (
  id uuid default gen_random_uuid() primary key,
  youtube_id text not null,
  title text not null,
  show_name text,
  year integer,
  display_order integer default 0
);

-- Profiles (one row per auth user, stores role)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null default 'admin' check (role in ('admin','super_admin')),
  name text
);

-- Auto-create a profile when a user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table shows enable row level security;
alter table reservations enable row level security;
alter table members enable row level security;
alter table videos enable row level security;
alter table profiles enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role in ('admin', 'super_admin')
  );
$$;

-- Shows: public read, admin write
drop policy if exists "shows_public_read" on shows;
drop policy if exists "shows_admin_insert" on shows;
drop policy if exists "shows_admin_update" on shows;
drop policy if exists "shows_admin_delete" on shows;
create policy "shows_public_read" on shows for select using (true);
create policy "shows_admin_insert" on shows for insert with check (is_admin());
create policy "shows_admin_update" on shows for update using (is_admin());
create policy "shows_admin_delete" on shows for delete using (is_admin());

-- Reservations: anyone can insert, admin can read/update
drop policy if exists "reservations_public_insert" on reservations;
drop policy if exists "reservations_admin_read" on reservations;
drop policy if exists "reservations_admin_update" on reservations;
create policy "reservations_public_insert" on reservations for insert with check (true);
create policy "reservations_admin_read" on reservations for select using (is_admin());
create policy "reservations_admin_update" on reservations for update using (is_admin());

-- Members: public read, admin write
drop policy if exists "members_public_read" on members;
drop policy if exists "members_admin_insert" on members;
drop policy if exists "members_admin_update" on members;
drop policy if exists "members_admin_delete" on members;
create policy "members_public_read" on members for select using (true);
create policy "members_admin_insert" on members for insert with check (is_admin());
create policy "members_admin_update" on members for update using (is_admin());
create policy "members_admin_delete" on members for delete using (is_admin());

-- Videos: public read, admin write
drop policy if exists "videos_public_read" on videos;
drop policy if exists "videos_admin_insert" on videos;
drop policy if exists "videos_admin_update" on videos;
drop policy if exists "videos_admin_delete" on videos;
create policy "videos_public_read" on videos for select using (true);
create policy "videos_admin_insert" on videos for insert with check (is_admin());
create policy "videos_admin_update" on videos for update using (is_admin());
create policy "videos_admin_delete" on videos for delete using (is_admin());

-- Profiles: user can read own row; super_admin can read all
drop policy if exists "profiles_self_read" on profiles;
drop policy if exists "profiles_super_admin_read" on profiles;
drop policy if exists "profiles_super_admin_update" on profiles;
create policy "profiles_self_read" on profiles for select using (auth.uid() = id);
create policy "profiles_super_admin_read" on profiles for select
  using (exists (select 1 from profiles where id = auth.uid() and role = 'super_admin'));
create policy "profiles_super_admin_update" on profiles for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'super_admin'));

-- ─── Site Settings ───────────────────────────────────────────────────────────
create table if not exists site_settings (
  id integer primary key default 1,
  member_count text not null default 'XX',
  show_count text not null default 'XX+',
  about_description text not null default 'Upstage A Cappella is the University of Pennsylvania''s premier co-ed a cappella group. We''ve been bringing vocal harmony to stages across campus and beyond — blending contemporary pop, R&B, and original arrangements performed entirely with the human voice.',
  hero_tagline text not null default 'All voice. All heart. No instruments needed.',
  contact_email text not null default 'upstage@upenn.edu',
  venmo_handle text not null default '@upstage-acappella',
  instagram_url text not null default '',
  youtube_url text not null default '',
  tiktok_url text not null default '',
  spotify_url text not null default '',
  constraint site_settings_single_row check (id = 1)
);

-- Insert the default row (safe to re-run)
insert into site_settings (id) values (1) on conflict (id) do nothing;

alter table site_settings enable row level security;
drop policy if exists "settings_public_read" on site_settings;
drop policy if exists "settings_admin_update" on site_settings;
create policy "settings_public_read" on site_settings for select using (true);
create policy "settings_admin_update" on site_settings for update using (is_admin());

-- ─── Enable Realtime ──────────────────────────────────────────────────────────
-- After running this SQL, also go to:
-- Supabase dashboard → Database → Replication → enable "shows" table

-- ─── Sample data (optional, delete before going live) ─────────────────────────
insert into shows (title, date, time, venue, description, price_cents, total_seats, tickets_open)
values
  ('Fall Showcase 2025', '2025-09-27', '7:00 PM', 'Irvine Auditorium, University of Pennsylvania',
   'Our flagship fall concert. New arrangements, surprise guests, good vibes.', 800, 150, true),
  ('Fall Showcase 2025', '2025-09-27', '9:30 PM', 'Irvine Auditorium, University of Pennsylvania',
   'Our flagship fall concert. New arrangements, surprise guests, good vibes.', 800, 150, true),
  ('Winter Concert 2025', '2025-12-06', '8:00 PM', 'TBD',
   'End the semester with us. Holiday vibes, new songs, great crowd.', null, 200, false);
