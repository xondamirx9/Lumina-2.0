-- ================================================================
--  Lumina Voyages — Schema V3 Migration
--  Run this in Supabase SQL Editor (safe to run multiple times).
--  Adds admin-editable highlights & itinerary, the announcement
--  setting, and hardens RLS policies with a non-recursive
--  is_admin() helper.
-- ================================================================

-- ── Admin-editable tour content ──────────────────────────────────
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS highlights jsonb DEFAULT '[]';
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS itinerary  jsonb DEFAULT '[]';

-- ── Site-wide announcement bar (managed from admin Settings) ─────
INSERT INTO public.site_settings (key, value) VALUES ('announcement', '')
ON CONFLICT (key) DO NOTHING;

-- ── Non-recursive admin check ────────────────────────────────────
-- The old policies queried profiles from within a profiles policy,
-- which recurses under RLS. SECURITY DEFINER breaks the cycle.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false);
$$;

DROP POLICY IF EXISTS "admin read profiles"     ON public.profiles;
DROP POLICY IF EXISTS "admin read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "own profile"             ON public.profiles;
DROP POLICY IF EXISTS "profiles_select"         ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Admins may promote/demote other users
DROP POLICY IF EXISTS "admin update profiles" ON public.profiles;
CREATE POLICY "admin update profiles" ON public.profiles FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin tours" ON public.tours;
CREATE POLICY "admin tours" ON public.tours FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "admin all bookings" ON public.bookings;
CREATE POLICY "admin all bookings" ON public.bookings FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "admin settings" ON public.site_settings;
CREATE POLICY "admin settings" ON public.site_settings FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manages inquiries" ON public.inquiries;
CREATE POLICY "Admin manages inquiries" ON public.inquiries FOR ALL USING (public.is_admin());
