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
  created_at timestamptz default now(),
  -- Client-generated per submission. Lets a retry collapse onto the original
  -- row instead of double-booking. Nullable so pre-existing rows stay valid.
  idempotency_key uuid
);

create unique index if not exists reservations_idempotency_key_uniq
  on reservations (idempotency_key);

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
-- NOTE: the default is deliberately 'member', NOT 'admin'. A new account must
-- never become an admin implicitly — promote it by hand.
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null default 'member' check (role in ('member','admin','super_admin')),
  name text
);

-- Auto-create a profile when a user signs up.
-- `set search_path` is required: auth runs as supabase_auth_admin, whose
-- search_path excludes public, so an unqualified `profiles` fails to resolve
-- and the resulting throw rolls back the entire user creation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
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

-- Reservations: NO public insert. The only way in is reserve_seats() below,
-- which is security definer and enforces capacity. A public insert policy here
-- would let anyone with the anon key (it ships to every browser) write rows
-- directly and skip every check.
drop policy if exists "reservations_public_insert" on reservations;
drop policy if exists "reservations_admin_read" on reservations;
drop policy if exists "reservations_admin_update" on reservations;
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

-- Profiles: a user can read their own row. That's all the app needs.
drop policy if exists "profiles_self_read" on profiles;
drop policy if exists "profiles_super_admin_read" on profiles;
drop policy if exists "profiles_super_admin_update" on profiles;
create policy "profiles_self_read" on profiles for select using (auth.uid() = id);
-- Deliberately no cross-user policies here. This site runs on a single shared
-- admin account, so reading your own row is all that's needed. A policy on
-- `profiles` that queries `profiles` is infinite recursion (42P17); role
-- changes are done from the Supabase dashboard instead.

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

-- ─── Reservation flow ─────────────────────────────────────────────────────────
-- The ONLY supported way to create a reservation.
--
-- Solves four problems that a client-side insert+update cannot:
--   1. idempotency  — a replayed submission returns the original row
--   2. lost updates — `for update` serialises concurrent bookings
--   3. stale counts — the increment happens in SQL, not from browser state
--   4. atomicity    — insert and increment share one transaction
--
-- security definer is what lets it update `shows` even though anonymous
-- visitors are blocked by shows_admin_update. set search_path is mandatory
-- alongside it, or the caller controls how unqualified names resolve.
create or replace function public.reserve_seats(
  p_show_id uuid,
  p_name text,
  p_email text,
  p_qty int,
  p_notes text,
  p_idempotency_key uuid
)
returns public.reservations
as $function$
declare
  v_show public.shows;
  v_reservation public.reservations;
begin
  -- Already processed this submission? Hand back the original.
  select * into v_reservation from public.reservations
    where idempotency_key = p_idempotency_key;
  if found then return v_reservation; end if;

  -- Lock the show row; concurrent callers queue here.
  select * into v_show from public.shows where id = p_show_id for update;
  if not found then raise exception 'show not found'; end if;
  if not v_show.tickets_open then raise exception 'tickets are not open'; end if;

  -- Capacity check against the live value, still holding the lock.
  if v_show.tickets_sold + p_qty > v_show.total_seats then
    raise exception 'only % seats remaining',
      v_show.total_seats - v_show.tickets_sold;
  end if;

  insert into public.reservations
    (show_id, name, email, qty, notes, status, idempotency_key)
  values
    (p_show_id, p_name, p_email, p_qty, p_notes, 'pending', p_idempotency_key)
  returning * into v_reservation;

  update public.shows set tickets_sold = tickets_sold + p_qty
    where id = p_show_id;

  return v_reservation;

-- Two identical requests can both miss the lookup above; the unique index
-- catches the loser, and we return the winner's row rather than erroring.
exception when unique_violation then
  select * into v_reservation from public.reservations
    where idempotency_key = p_idempotency_key;
  return v_reservation;
end;
$function$
language plpgsql
security definer
set search_path = public;

grant execute on function public.reserve_seats to anon, authenticated;
