/* ================================================================
   Lumina Voyages — Supabase client & API (v2)
   Fill in SUPABASE_URL and SUPABASE_ANON_KEY, then run SCHEMA_V2.sql
   ================================================================ */

const SUPABASE_URL      = "https://ekudvabndtdxlgubymgg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdWR2YWJuZHRkeGxndWJ5bWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTU0MDIsImV4cCI6MjA5NjE3MTQwMn0.QBclhu2BRNPjJZcRjWJYE_2dYFHgnJi7AiQzQzomuuY";

const _ok = SUPABASE_URL !== "YOUR_SUPABASE_URL" && typeof window.supabase !== "undefined";
const _sb  = _ok
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null;

const SB = {
  ok: _ok,
  client: _sb,

  /* ── AUTH ──────────────────────────────────────────────────── */
  auth: {
    async signUp(email, password, name) {
      const { data, error } = await _sb.auth.signUp({ email, password, options: { data: { name } } });
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
    async session() { const { data } = await _sb.auth.getSession(); return data?.session ?? null; },
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

  /* ── TOURS ────────────────────────────────────────────────── */
  tours: {
    async list(status = null) {
      let q = _sb.from("tours").select("*").order("created_at", { ascending: false });
      if (status) q = q.eq("status", status);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    async get(id) {
      const { data, error } = await _sb.from("tours").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
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
        category: t.categories?.[0] || t.category || "luxury",
        difficulty: t.difficulty, group_max: t.groupMax,
        season: t.season, status: "active", view_count: 0,
        country: t.place?.split(",")[1]?.trim() || "",
        city: t.place?.split(",")[0]?.trim() || "",
        tags_json: t.tags || [],
        included_json: t.included || [],
        excluded_json: t.notIncluded || [],
      }));
      await _sb.from("tours").insert(rows);
    },
    async imageOverrides() {
      const { data } = await _sb.from("tours").select("id, image_url").not("image_url", "is", null);
      const map = {};
      (data || []).forEach(r => { if (r.image_url) map[r.id] = r.image_url; });
      return map;
    },
    async trackView(id) {
      await _sb.rpc("increment_tour_view", { tour_id: id }).catch(() => {});
    },
    async stats() {
      const { data } = await _sb.from("tours").select("status, view_count, title, id, image_url, theme");
      const all = data || [];
      return {
        total: all.length,
        active: all.filter(t => t.status === "active").length,
        draft: all.filter(t => t.status === "draft").length,
        hidden: all.filter(t => t.status === "hidden").length,
        topViewed: [...all].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5),
      };
    }
  },

  /* ── BOOKINGS ─────────────────────────────────────────────── */
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
    },
    async monthlyCounts() {
      const { data } = await _sb.from("bookings").select("created_at, total").order("created_at");
      const months = {};
      const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      (data || []).forEach(b => {
        const d = new Date(b.created_at);
        const key = d.getFullYear() + "-" + d.getMonth();
        if (!months[key]) months[key] = { label: labels[d.getMonth()], count: 0, revenue: 0 };
        months[key].count++;
        months[key].revenue += Number(b.total) || 0;
      });
      return Object.values(months).slice(-6);
    }
  },

  /* ── INQUIRIES ────────────────────────────────────────────── */
  inquiries: {
    async create(inquiry) {
      const { data, error } = await _sb.from("inquiries").insert(inquiry).select().single();
      if (error) throw error;
      return data;
    },
    async all() {
      const { data, error } = await _sb.from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async updateStatus(id, status) {
      const { error } = await _sb.from("inquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    async counts() {
      const { data } = await _sb.from("inquiries").select("status");
      const all = data || [];
      return {
        total: all.length,
        new: all.filter(i => i.status === "new").length,
        contacted: all.filter(i => i.status === "contacted").length,
        in_progress: all.filter(i => i.status === "in_progress").length,
        closed: all.filter(i => i.status === "closed").length,
      };
    }
  },

  /* ── USERS ────────────────────────────────────────────────── */
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

  /* ── STORAGE ──────────────────────────────────────────────── */
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

  /* ── SETTINGS ─────────────────────────────────────────────── */
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

const _imgOverrides = {};
if (_ok) {
  SB.tours.imageOverrides().then(map => Object.assign(_imgOverrides, map)).catch(() => {});
}
function getTourImageOverride(id) { return _imgOverrides[id] || null; }

Object.assign(window, { SB, getTourImageOverride });
