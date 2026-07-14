-- ================================================================
--  Lumina Voyages — Schema V4 Migration (security hardening)
--  Run this in Supabase SQL Editor (safe to run multiple times).
--  Fixes the Security Advisor warnings that are safe to fix:
--    • "Function Search Path Mutable" ×3 — pin search_path
--    • "Public Can Execute SECURITY DEFINER Function" for the
--      signup trigger — clients never need to call it directly
--  The remaining warnings are by design (see comments at the end).
-- ================================================================

-- ── Pin search_path on all SECURITY DEFINER functions ────────────
-- Without a fixed search_path, a malicious role could shadow tables
-- the function references. Pinning it removes that attack vector.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false);
$$;

CREATE OR REPLACE FUNCTION public.increment_tour_view(tour_id text)
RETURNS void LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.tours SET view_count = view_count + 1 WHERE id = tour_id;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- ── Lock down the signup trigger function ────────────────────────
-- It only ever runs as the auth trigger; browser clients must not be
-- able to call it via RPC.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Keep the functions the site legitimately calls from the browser:
GRANT EXECUTE ON FUNCTION public.increment_tour_view(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ================================================================
--  Warnings that are INTENTIONAL for this site (safe to ignore):
--
--  • "RLS Policy Always True" on public.inquiries INSERT —
--    the contact/inquiry form is submitted by anonymous visitors,
--    so public insert is the whole point. Visitors still cannot
--    read, edit or delete inquiries.
--
--  • "Public Bucket Allows Listing" on tour-images —
--    the bucket only holds public tour photos that are shown on the
--    site anyway; being able to list them exposes nothing sensitive.
--
--  • "Public Can Execute SECURITY DEFINER Function" for is_admin()
--    and increment_tour_view() — both are required by the site:
--    is_admin() is evaluated inside RLS policies for every visitor
--    (it just returns false for non-admins), and the view counter is
--    called by anonymous visitors when they open a tour page. Neither
--    exposes or modifies anything sensitive.
-- ================================================================
