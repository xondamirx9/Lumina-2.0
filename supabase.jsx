/* ================================================================
   Lumina Voyages — Supabase client & API layer

   SETUP (3 steps):
   1. Go to https://supabase.com → New project
   2. SQL Editor → paste SCHEMA.sql → Run
   3. Replace the two values below with your project's URL and anon key
      (find them in Project Settings → API)
   ================================================================ */

const SUPABASE_URL      = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const _ok = SUPABASE_URL !== "YOUR_SUPABASE_URL" && typeof window.supabase !== "undefined";
const _sb  = _ok
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null;

const SB = {
  ok: _ok,
  client: _sb,

  /* ───── AUTH ──────────────────────────────────────────────────── */
  auth: {
    async signUp(email, password, name) {
      const { data, error } = await _sb.auth.signUp({
        email, password, options: { data: { name } }
      });
      if (error) throw error;
      return data;
    },
    async signIn(email, password) {
      const { data, error } = await _sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    async signOut() { await _sb.auth.signOut(); },
    async resetPassword(email) {
      const { error } = await _sb.auth.resetPasswordForEmail(email, {
        redirectTo: location.origin + location.pathname + "#/reset-password"
      });
      if (error) throw error;
    },
    async updatePassword(password) {
      const { error } = await _sb.auth.updateUser({ password });
      if (error) throw error;
    },
    async session() {
      const { data } = await _sb.auth.getSession();
      return data?.session ?? null;
    },
    async profile(userId) {
      const { data } = await _sb.from("profiles").select("*").eq("id", userId).single();
      return data;
    },
    async updateProfile(userId, updates) {
      const { error } = await _sb.from("profiles").update(updates).eq("id", userId);
      if (error) throw error;
    },
    onChange(cb) {
      const { data } = _sb.auth.onAuthStateChange(cb);
      return () => data.subscription?.unsubscribe();
    }
  },

  /* ───── TOURS ─────────────────────────────────────────────────── */
  tours: {
    async list() {
      const { data, error } = await _sb.from("tours").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async upsert(tour) {
      const payload = { ...tour, updated_at: new Date().toISOString() };
      const { data, error } = await _sb.from("tours").upsert(payload, { onConflict: "id" }).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id) {
      const { error } = await _sb.from("tours").delete().eq("id", id);
      if (error) throw error;
    },
    async seed(tours) {
      const { count } = await _sb.from("tours").select("*", { count: "exact", head: true });
      if ((count || 0) > 0) return;
      const rows = tours.map(t => ({
        id: t.id, title: t.title, blurb: t.blurb, region: t.region, place: t.place,
        days: t.days, price: t.price, old_price: t.oldPrice || null,
        rating: t.rating, reviews: t.reviews, theme: t.theme,
        featured: !!t.featured, popular: !!t.popular,
        category: t.category, difficulty: t.difficulty,
        group_max: t.groupMax, season: t.season
      }));
      await _sb.from("tours").insert(rows);
    },
    async imageOverrides() {
      const { data } = await _sb.from("tours").select("id, image_url").not("image_url", "is", null);
      const map = {};
      (data || []).forEach(r => { if (r.image_url) map[r.id] = r.image_url; });
      return map;
    }
  },

  /* ───── BOOKINGS ──────────────────────────────────────────────── */
  bookings: {
    async create(booking) {
      const { data, error } = await _sb.from("bookings").insert(booking).select().single();
      if (error) throw error;
      return data;
    },
    async mine() {
      const { data, error } = await _sb.from("bookings")
        .select("*, tours(id, title, theme, region, days)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async all() {
      const { data, error } = await _sb.from("bookings")
        .select("*, tours(title, theme), profiles(name, email)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async updateStatus(id, status) {
      const { error } = await _sb.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
    }
  },

  /* ───── USERS (admin) ─────────────────────────────────────────── */
  users: {
    async all() {
      const { data, error } = await _sb.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async setAdmin(id, is_admin) {
      const { error } = await _sb.from("profiles").update({ is_admin }).eq("id", id);
      if (error) throw error;
    }
  },

  /* ───── STORAGE ───────────────────────────────────────────────── */
  storage: {
    async upload(file, bucket = "tour-images") {
      const ext = file.name.split(".").pop().toLowerCase();
      const path = `tours/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await _sb.storage.from(bucket).upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = _sb.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    }
  },

  /* ───── SETTINGS ──────────────────────────────────────────────── */
  settings: {
    _cache: {},
    async getAll() {
      const { data } = await _sb.from("site_settings").select("*");
      this._cache = Object.fromEntries((data || []).map(r => [r.key, r.value]));
      return this._cache;
    },
    async set(key, value) {
      await _sb.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
      this._cache[key] = value;
    },
    get(key, fallback = "") { return this._cache[key] ?? fallback; }
  }
};

/* global image overrides — populated on boot if SB configured */
const _imgOverrides = {};
if (_ok) {
  SB.tours.imageOverrides().then(map => Object.assign(_imgOverrides, map)).catch(() => {});
}
function getTourImageOverride(id) { return _imgOverrides[id] || null; }

Object.assign(window, { SB, getTourImageOverride });
