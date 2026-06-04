-- ================================================================
--  Lumina Voyages — Supabase Schema
--  Paste this entire file into Supabase > SQL Editor > Run
-- ================================================================

-- ── Profiles (one row per registered user) ──────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  name        text,
  email       text,
  avatar_url  text,
  phone       text,
  is_admin    boolean default false,
  created_at  timestamptz default now()
);

-- ── Tours ────────────────────────────────────────────────────────
create table public.tours (
  id          text primary key,
  title       text not null,
  blurb       text,
  region      text,
  place       text,
  days        int,
  price       numeric,
  old_price   numeric,
  rating      numeric default 4.8,
  reviews     int default 0,
  theme       text,
  image_url   text,
  featured    boolean default false,
  popular     boolean default false,
  category    text,
  difficulty  text,
  group_max   int,
  season      text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Bookings ─────────────────────────────────────────────────────
create table public.bookings (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete set null,
  tour_id     text references public.tours on delete set null,
  guest_name  text,
  guest_email text,
  guest_phone text,
  date        text,
  guests      int default 1,
  total       numeric,
  status      text default 'confirmed',
  notes       text,
  created_at  timestamptz default now()
);

-- ── Site settings (key/value for editable content) ───────────────
create table public.site_settings (
  key         text primary key,
  value       text,
  updated_at  timestamptz default now()
);

-- Insert default settings
insert into public.site_settings (key, value) values
  ('hero_image_url', ''),
  ('hero_heading',   ''),
  ('hero_sub',       ''),
  ('contact_email',  ''),
  ('whatsapp',       ''),
  ('instagram',      '');

-- ================================================================
--  Row Level Security
-- ================================================================
alter table public.profiles     enable row level security;
alter table public.tours        enable row level security;
alter table public.bookings     enable row level security;
alter table public.site_settings enable row level security;

-- profiles: users read/update own; admins read all
create policy "own profile"         on profiles for select using (auth.uid() = id);
create policy "own profile update"  on profiles for update using (auth.uid() = id);
create policy "admin read profiles" on profiles for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
);

-- tours: everyone reads; only admins write
create policy "public tours"   on tours for select using (true);
create policy "admin tours"    on tours for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
);

-- bookings: users see own; admins see all
create policy "own bookings"       on bookings for select using (auth.uid() = user_id);
create policy "create bookings"    on bookings for insert with check (auth.uid() = user_id);
create policy "cancel bookings"    on bookings for update using (auth.uid() = user_id);
create policy "admin all bookings" on bookings for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
);

-- site_settings: public read; admin write
create policy "public settings" on site_settings for select using (true);
create policy "admin settings"  on site_settings for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
);

-- ================================================================
--  Auto-create profile on sign up
-- ================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
