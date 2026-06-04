-- ================================================================
--  Lumina Voyages — Schema V2 Migration
--  Run this in Supabase SQL Editor (safe to run multiple times)
-- ================================================================

-- ── Extend tours table ───────────────────────────────────────────
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS status          text    DEFAULT 'active';
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS country         text;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS city            text;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS full_description text;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS gallery_urls    jsonb   DEFAULT '[]';
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS departure_dates jsonb   DEFAULT '[]';
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS tags_json       jsonb   DEFAULT '[]';
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS included_json   jsonb   DEFAULT '[]';
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS excluded_json   jsonb   DEFAULT '[]';
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS is_hot          boolean DEFAULT false;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS view_count      int     DEFAULT 0;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS discount_price  numeric;

-- ── Inquiries table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inquiries (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,
  tour_id     text REFERENCES public.tours(id) ON DELETE SET NULL,
  tour_title  text,
  message     text,
  status      text DEFAULT 'new',
  created_at  timestamptz DEFAULT now()
);

-- ── RLS for inquiries ────────────────────────────────────────────
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit inquiry"
  ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manages inquiries" ON public.inquiries;
CREATE POLICY "Admin manages inquiries"
  ON public.inquiries FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  ));

-- ── Fix: admin can read ALL profiles ─────────────────────────────
DROP POLICY IF EXISTS "admin read profiles"      ON public.profiles;
DROP POLICY IF EXISTS "admin read all profiles"  ON public.profiles;
CREATE POLICY "admin read all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- ── Function to increment tour view count safely ─────────────────
CREATE OR REPLACE FUNCTION public.increment_tour_view(tour_id text)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.tours SET view_count = view_count + 1 WHERE id = tour_id;
$$;
