/* ================================================================
   Lumina Voyages — Admin Panel
   ================================================================ */

/* ── helpers ──────────────────────────────────────────────────── */
function AdminBadge({ status }) {
  const colors = {
    confirmed:  { bg: "var(--ocean-tint)",  color: "var(--ocean-deep)" },
    completed:  { bg: "var(--teal-soft)",   color: "oklch(0.38 0.07 200)" },
    cancelled:  { bg: "var(--coral-soft)",  color: "var(--coral-deep)" },
    pending:    { bg: "var(--sand)",        color: "oklch(0.46 0.06 78)" },
  };
  const s = colors[status] || colors.pending;
  return (
    <span style={{ ...s, fontSize: "0.76rem", fontWeight: 700, padding: "4px 10px", borderRadius: "var(--r-pill)", textTransform: "capitalize" }}>
      {status}
    </span>
  );
}

function AdminTable({ cols, rows, keyFn }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: "var(--r-md)", boxShadow: "var(--sh-sm)", border: "1px solid var(--hairline)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface)", fontSize: "0.88rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
            {cols.map(c => <th key={c} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)", whiteSpace: "nowrap" }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={keyFn ? keyFn(r) : i} style={{ borderBottom: "1px solid var(--hairline)", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={e => e.currentTarget.style.background = ""}>
              {r}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function td(content, style = {}) {
  return <td style={{ padding: "13px 16px", color: "var(--ink)", verticalAlign: "middle", ...style }}>{content}</td>;
}

function AdminStatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-sm)", padding: "20px 22px", border: "1px solid var(--hairline)" }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ width: 42, height: 42, borderRadius: "var(--r-sm)", background: color + " / 0.12", display: "grid", placeItems: "center", color }}>
          <Icon name={icon} size={20} />
        </span>
        <span style={{ fontSize: "0.76rem", color: "var(--ink-3)", fontWeight: 600 }}>{sub}</span>
      </div>
      <div style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{value}</div>
      <div style={{ fontSize: "0.84rem", color: "var(--ink-3)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

/* ── Tours tab ────────────────────────────────────────────────── */
function AdminTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | tour object
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      if (SB.ok) {
        const sbTours = await SB.tours.list();
        // merge with hardcoded TOURS to fill in any missing fields
        const merged = TOURS.map(t => {
          const sb = sbTours.find(s => s.id === t.id);
          return sb ? { ...t, ...sb, image_url: sb.image_url } : t;
        });
        // include any DB-only tours not in hardcoded list
        const extra = sbTours.filter(s => !TOURS.find(t => t.id === s.id));
        setTours([...merged, ...extra]);
      } else {
        setTours(TOURS);
      }
    } catch(e) { toast("Failed to load tours", "x"); }
    setLoading(false);
  };

  useState(() => { load(); }, []);
  useEffect(() => { load(); }, []);

  const openEdit = (tour) => setEditing({ ...tour });

  const handleSave = async () => {
    setSaving(true);
    try {
      await SB.tours.upsert({
        id: editing.id, title: editing.title, blurb: editing.blurb,
        region: editing.region, place: editing.place, days: Number(editing.days),
        price: Number(editing.price), old_price: editing.old_price ? Number(editing.old_price) : null,
        theme: editing.theme, image_url: editing.image_url || null,
        featured: !!editing.featured, popular: !!editing.popular,
        category: editing.category, difficulty: editing.difficulty,
        group_max: Number(editing.groupMax || editing.group_max),
        season: editing.season
      });
      toast("Tour saved!", "check");
      setEditing(null);
      load();
    } catch(e) { toast("Save failed: " + e.message, "x"); }
    setSaving(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await SB.storage.upload(file);
      setEditing(prev => ({ ...prev, image_url: url }));
      toast("Image uploaded!", "check");
    } catch(e) { toast("Upload failed: " + e.message, "x"); }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this tour? This cannot be undone.")) return;
    try {
      await SB.tours.delete(id);
      toast("Tour deleted", "check");
      load();
    } catch(e) { toast("Delete failed: " + e.message, "x"); }
  };

  const Field = ({ label, children }) => (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );

  if (loading) return <div style={{ textAlign: "center", padding: 48, color: "var(--ink-3)" }}>Loading tours…</div>;

  return (
    <div>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", marginBottom: 4 }}>{tours.length} tours</h2>
          <p style={{ color: "var(--ink-3)", fontSize: "0.85rem" }}>Edit title, price, images and visibility of each tour.</p>
        </div>
        {!SB.ok && <span className="badge badge-coral">Supabase not configured — changes won't be saved</span>}
      </div>

      <AdminTable
        cols={["Image", "Title & Region", "Price", "Category", "Featured", "Actions"]}
        rows={tours.map(tour => [
          td(<div style={{ width: 60, height: 45, borderRadius: 8, overflow: "hidden", background: "var(--ocean-tint)" }}>
            <img src={tour.image_url || (typeof PHOTOS !== "undefined" && PHOTOS[tour.theme]) || ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>),
          td(<div>
            <div style={{ fontWeight: 700 }}>{tour.title}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>{tour.region}</div>
          </div>),
          td(<div>
            <div style={{ fontWeight: 700 }}>{fmtPrice(tour.price)}</div>
            {tour.old_price && <div style={{ fontSize: "0.8rem", color: "var(--ink-3)", textDecoration: "line-through" }}>{fmtPrice(tour.old_price)}</div>}
          </div>),
          td(<span className="badge badge-ocean" style={{ textTransform: "capitalize" }}>{tour.category}</span>),
          td(<span style={{ fontSize: "1.2rem" }}>{tour.featured ? "✓" : "—"}</span>),
          td(<div className="row gap-2">
            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(tour)}>Edit</button>
            <button className="btn btn-sm" onClick={() => handleDelete(tour.id)}
              style={{ background: "var(--coral-soft)", color: "var(--coral-deep)" }}>Delete</button>
          </div>),
        ])}
      />

      {/* Edit modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", background: "oklch(0.1 0.02 235 / 0.7)", backdropFilter: "blur(4px)", overflowY: "auto" }}>
          <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-xl)", width: "100%", maxWidth: 720, padding: 36 }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 28 }}>
              <h3 style={{ fontSize: "1.2rem" }}>Edit Tour</h3>
              <button onClick={() => setEditing(null)} style={{ color: "var(--ink-3)" }}><Icon name="x" size={22} /></button>
            </div>

            {/* Image section */}
            <div style={{ marginBottom: 24, padding: 20, background: "var(--bg-2)", borderRadius: "var(--r-md)" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--ink-2)", display: "block", marginBottom: 12 }}>Tour Image</label>
              <div className="row gap-4" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ width: 160, height: 110, borderRadius: 10, overflow: "hidden", background: "var(--ocean-tint)", flexShrink: 0 }}>
                  <img src={editing.image_url || (typeof PHOTOS !== "undefined" && PHOTOS[editing.theme]) || ""} alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 200 }} className="col gap-3">
                  <div className="field">
                    <label>Paste image URL</label>
                    <input className="input" value={editing.image_url || ""} placeholder="https://..."
                      onChange={e => setEditing(p => ({ ...p, image_url: e.target.value }))} />
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--ink-3)", fontWeight: 600 }}>— or —</div>
                  <label className="btn btn-ghost btn-sm" style={{ cursor: "pointer", display: "inline-flex" }}>
                    {uploading ? "Uploading…" : <><Icon name="camera" size={16} /> Upload from computer</>}
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
                  </label>
                  {!SB.ok && <span style={{ fontSize: "0.78rem", color: "var(--coral-deep)" }}>Configure Supabase to enable uploads</span>}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div style={{ gridColumn: "span 2" }} className="field">
                <label>Title</label>
                <input className="input" value={editing.title || ""} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div style={{ gridColumn: "span 2" }} className="field">
                <label>Short description</label>
                <textarea className="input" rows={3} value={editing.blurb || ""} onChange={e => setEditing(p => ({ ...p, blurb: e.target.value }))} />
              </div>
              <Field label="Region"><input className="input" value={editing.region || ""} onChange={e => setEditing(p => ({ ...p, region: e.target.value }))} /></Field>
              <Field label="Place / City"><input className="input" value={editing.place || ""} onChange={e => setEditing(p => ({ ...p, place: e.target.value }))} /></Field>
              <Field label="Price (USD)"><input className="input" type="number" value={editing.price || ""} onChange={e => setEditing(p => ({ ...p, price: e.target.value }))} /></Field>
              <Field label="Original price (optional)"><input className="input" type="number" value={editing.old_price || ""} onChange={e => setEditing(p => ({ ...p, old_price: e.target.value }))} /></Field>
              <Field label="Duration (days)"><input className="input" type="number" value={editing.days || ""} onChange={e => setEditing(p => ({ ...p, days: e.target.value }))} /></Field>
              <Field label="Max group size"><input className="input" type="number" value={editing.groupMax || editing.group_max || ""} onChange={e => setEditing(p => ({ ...p, groupMax: e.target.value }))} /></Field>
              <Field label="Category">
                <select className="select" value={editing.category || ""} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="Difficulty">
                <select className="select" value={editing.difficulty || ""} onChange={e => setEditing(p => ({ ...p, difficulty: e.target.value }))}>
                  {["Easy", "Moderate", "Challenging", "Strenuous"].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
            </div>

            <div className="row gap-6" style={{ marginBottom: 28 }}>
              <label className="row gap-2" style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
                <input type="checkbox" checked={!!editing.featured} onChange={e => setEditing(p => ({ ...p, featured: e.target.checked }))} style={{ width: 18, height: 18 }} />
                Featured on homepage
              </label>
              <label className="row gap-2" style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
                <input type="checkbox" checked={!!editing.popular} onChange={e => setEditing(p => ({ ...p, popular: e.target.checked }))} style={{ width: 18, height: 18 }} />
                Mark as Popular
              </label>
            </div>

            <div className="row gap-3" style={{ justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : <><Icon name="check" size={18} /> Save changes</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Bookings tab ─────────────────────────────────────────────── */
function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        if (SB.ok) {
          setBookings(await SB.bookings.all());
        }
      } catch(e) { toast("Failed to load bookings", "x"); }
      setLoading(false);
    })();
  }, []);

  const setStatus = async (id, status) => {
    try {
      await SB.bookings.updateStatus(id, status);
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b));
      toast("Status updated", "check");
    } catch(e) { toast("Update failed", "x"); }
  };

  const total = bookings.reduce((s, b) => s + (Number(b.total) || 0), 0);
  const confirmed = bookings.filter(b => b.status === "confirmed").length;

  if (loading) return <div style={{ textAlign: "center", padding: 48, color: "var(--ink-3)" }}>Loading bookings…</div>;
  if (!SB.ok)  return <div style={{ textAlign: "center", padding: 48, color: "var(--ink-3)" }}>Configure Supabase to see bookings.</div>;

  return (
    <div>
      <div className="row gap-4" style={{ marginBottom: 28, flexWrap: "wrap" }}>
        <AdminStatCard icon="compass" label="Total bookings" value={bookings.length} sub="all time" color="var(--ocean)" />
        <AdminStatCard icon="check"   label="Confirmed"      value={confirmed}        sub="active"   color="var(--teal)" />
        <AdminStatCard icon="tag"     label="Total revenue"  value={fmtPrice(total)}  sub="all time" color="var(--coral)" />
      </div>

      {bookings.length === 0
        ? <div style={{ textAlign: "center", padding: 60, color: "var(--ink-3)" }}>No bookings yet.</div>
        : <AdminTable
            cols={["ID", "Guest", "Tour", "Date", "Guests", "Total", "Status", "Booked"]}
            rows={bookings.map(b => [
              td(<span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--ink-3)" }}>{b.id.slice(0,8)}</span>),
              td(<div>
                <div style={{ fontWeight: 600 }}>{b.profiles?.name || b.guest_name || "—"}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>{b.profiles?.email || b.guest_email || ""}</div>
              </div>),
              td(<div style={{ fontWeight: 600 }}>{b.tours?.title || b.tour_id || "—"}</div>),
              td(b.date || "—"),
              td(b.guests),
              td(<span style={{ fontWeight: 700 }}>{b.total ? fmtPrice(b.total) : "—"}</span>),
              td(<select value={b.status} onChange={e => setStatus(b.id, e.target.value)}
                style={{ border: "none", background: "transparent", fontWeight: 700, cursor: "pointer", color: "var(--ink)", fontFamily: "var(--font-sans)", fontSize: "0.85rem" }}>
                {["confirmed", "completed", "cancelled", "pending"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>),
              td(<span style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>{b.created_at ? new Date(b.created_at).toLocaleDateString() : "—"}</span>),
            ])}
          />
      }
    </div>
  );
}

/* ── Users tab ────────────────────────────────────────────────── */
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        if (SB.ok) setUsers(await SB.users.all());
      } catch(e) { toast("Failed to load users", "x"); }
      setLoading(false);
    })();
  }, []);

  const toggleAdmin = async (userId, current) => {
    try {
      await SB.users.setAdmin(userId, !current);
      setUsers(us => us.map(u => u.id === userId ? { ...u, is_admin: !current } : u));
      toast(!current ? "Admin granted" : "Admin removed", "check");
    } catch(e) { toast("Update failed", "x"); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 48, color: "var(--ink-3)" }}>Loading users…</div>;
  if (!SB.ok)  return <div style={{ textAlign: "center", padding: 48, color: "var(--ink-3)" }}>Configure Supabase to see users.</div>;

  return (
    <div>
      <div className="row" style={{ marginBottom: 22, gap: 12, flexWrap: "wrap" }}>
        <AdminStatCard icon="users" label="Registered users" value={users.length} sub="total" color="var(--ocean)" />
        <AdminStatCard icon="shield" label="Admins" value={users.filter(u => u.is_admin).length} sub="with access" color="var(--coral)" />
      </div>

      {users.length === 0
        ? <div style={{ textAlign: "center", padding: 60, color: "var(--ink-3)" }}>No users yet.</div>
        : <AdminTable
            cols={["User", "Email", "Joined", "Admin"]}
            rows={users.map(u => [
              td(<div className="row gap-3">
                <span style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--ocean-tint)", color: "var(--ocean-deep)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "1rem", flexShrink: 0 }}>
                  {(u.name || u.email || "?")[0].toUpperCase()}
                </span>
                <div>
                  <div style={{ fontWeight: 600 }}>{u.name || "—"}</div>
                  {u.is_admin && <span style={{ fontSize: "0.7rem", background: "var(--coral-soft)", color: "var(--coral-deep)", padding: "1px 7px", borderRadius: "var(--r-pill)", fontWeight: 700 }}>Admin</span>}
                </div>
              </div>),
              td(<span style={{ color: "var(--ink-2)" }}>{u.email}</span>),
              td(<span style={{ fontSize: "0.85rem", color: "var(--ink-3)" }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</span>),
              td(
                <button onClick={() => toggleAdmin(u.id, u.is_admin)}
                  style={{ padding: "5px 14px", borderRadius: "var(--r-pill)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", border: "none",
                    background: u.is_admin ? "var(--coral-soft)" : "var(--ocean-tint)",
                    color: u.is_admin ? "var(--coral-deep)" : "var(--ocean-deep)" }}>
                  {u.is_admin ? "Remove admin" : "Make admin"}
                </button>
              ),
            ])}
          />
      }
    </div>
  );
}

/* ── Settings tab ─────────────────────────────────────────────── */
function AdminSettings() {
  const [form, setForm] = useState({
    hero_image_url: "", hero_heading: "", hero_sub: "",
    contact_email: "", whatsapp: "", instagram: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      if (SB.ok) {
        const all = await SB.settings.getAll();
        setForm(prev => ({ ...prev, ...all }));
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await Promise.all(Object.entries(form).map(([k, v]) => SB.settings.set(k, v)));
      toast("Settings saved!", "check");
    } catch(e) { toast("Save failed: " + e.message, "x"); }
    setSaving(false);
  };

  const SF = ({ label, id, placeholder, hint }) => (
    <div className="field">
      <label>{label}</label>
      <input className="input" placeholder={placeholder || ""} value={form[id] || ""}
        onChange={e => setForm(p => ({ ...p, [id]: e.target.value }))} />
      {hint && <span style={{ fontSize: "0.78rem", color: "var(--ink-3)" }}>{hint}</span>}
    </div>
  );

  if (loading) return <div style={{ textAlign: "center", padding: 48, color: "var(--ink-3)" }}>Loading settings…</div>;
  if (!SB.ok) return (
    <div style={{ background: "var(--coral-soft)", borderRadius: "var(--r-md)", padding: 28, color: "var(--coral-deep)" }}>
      <strong>Supabase not configured.</strong> Add your credentials to <code>supabase.jsx</code> to enable settings.
    </div>
  );

  return (
    <div style={{ maxWidth: 660 }}>
      <p style={{ color: "var(--ink-3)", marginBottom: 28, fontSize: "0.9rem" }}>
        These values override the default site content. Leave blank to use the built-in defaults.
      </p>

      <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-sm)", padding: 28, marginBottom: 20 }}>
        <h3 style={{ fontSize: "1rem", marginBottom: 20, color: "var(--ink-2)" }}>Homepage Hero</h3>
        <div className="col gap-4">
          <SF id="hero_image_url" label="Hero background image URL" placeholder="https://images.unsplash.com/..." hint="Paste any Unsplash or direct image URL" />
          <SF id="hero_heading"   label="Main heading (leave blank for default)" placeholder="Discover the World" />
          <SF id="hero_sub"       label="Subtitle" placeholder="Extraordinary journeys, beautifully planned." />
        </div>
      </div>

      <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-sm)", padding: 28, marginBottom: 28 }}>
        <h3 style={{ fontSize: "1rem", marginBottom: 20, color: "var(--ink-2)" }}>Contact & Social</h3>
        <div className="col gap-4">
          <SF id="contact_email" label="Contact email" placeholder="hello@luminavoyages.com" />
          <SF id="whatsapp"      label="WhatsApp number" placeholder="+1 234 567 8900" />
          <SF id="instagram"     label="Instagram handle" placeholder="@luminavoyages" />
        </div>
      </div>

      <button className="btn btn-primary btn-lg" onClick={save} disabled={saving}>
        {saving ? "Saving…" : <><Icon name="check" size={20} /> Save all settings</>}
      </button>
    </div>
  );
}

/* ── Main AdminPage ────────────────────────────────────────────── */
function AdminPage({ go, store }) {
  const [tab, setTab] = useState("tours");
  const user = store?.user;

  if (!user || !user.isAdmin) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)", paddingTop: 74 }}>
        <div style={{ textAlign: "center", padding: "48px 32px", maxWidth: 420 }}>
          <span style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--coral-soft)", display: "grid", placeItems: "center", margin: "0 auto 24px", color: "var(--coral-deep)" }}>
            <Icon name="shield" size={34} />
          </span>
          <h2 style={{ marginBottom: 12 }}>Admin access required</h2>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 28 }}>
            {user ? "Your account does not have admin privileges." : "Please sign in to access the admin panel."}
          </p>
          <div className="row gap-3" style={{ justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={() => go({ view: "account" })}>
              {user ? "Go to account" : "Sign in"}
            </button>
            <button className="btn btn-ghost" onClick={() => go({ view: "home" })}>Back to site</button>
          </div>
        </div>
      </div>
    );
  }

  const sideLinks = [
    { id: "tours",    label: "Tours",    icon: "compass",  desc: "Manage listings" },
    { id: "bookings", label: "Bookings", icon: "calendar", desc: "View & update" },
    { id: "users",    label: "Users",    icon: "users",    desc: "Accounts & roles" },
    { id: "settings", label: "Settings", icon: "shield",   desc: "Site content" },
  ];

  return (
    <ToastProvider>
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-2)" }}>
        {/* Sidebar */}
        <aside style={{ width: 230, background: "var(--footer-bg)", color: "white", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          <div style={{ padding: "26px 20px 20px", borderBottom: "1px solid oklch(1 0 0 / 0.07)" }}>
            <Logo light onClick={() => go({ view: "home" })} />
            <div style={{ marginTop: 8, fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(0.5 0.02 230)", fontWeight: 700 }}>Admin Panel</div>
          </div>
          <nav style={{ flex: 1, padding: "14px 12px" }}>
            {sideLinks.map(l => (
              <button key={l.id} onClick={() => setTab(l.id)} className="row gap-3" style={{ width: "100%", padding: "12px 14px", borderRadius: "var(--r-sm)", marginBottom: 3, fontWeight: 600, fontSize: "0.9rem", textAlign: "left", color: tab === l.id ? "white" : "oklch(0.65 0.018 228)", background: tab === l.id ? "oklch(1 0 0 / 0.11)" : "transparent", transition: "all 0.2s", border: tab === l.id ? "1px solid oklch(1 0 0 / 0.1)" : "1px solid transparent" }}>
                <Icon name={l.icon} size={18} />
                <div>
                  <div>{l.label}</div>
                  <div style={{ fontSize: "0.72rem", color: "oklch(0.52 0.016 228)", fontWeight: 500 }}>{l.desc}</div>
                </div>
              </button>
            ))}
          </nav>
          <div style={{ padding: "16px 16px 20px", borderTop: "1px solid oklch(1 0 0 / 0.07)" }}>
            <div style={{ fontSize: "0.82rem", color: "oklch(0.72 0.018 230)", marginBottom: 10, fontWeight: 600 }}>
              {user.name}
            </div>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              <button onClick={() => go({ view: "home" })} className="btn btn-sm" style={{ background: "oklch(1 0 0 / 0.07)", color: "oklch(0.72 0.018 230)", fontSize: "0.78rem", padding: "6px 12px" }}>
                <Icon name="arrowL" size={14} /> Site
              </button>
              <button onClick={async () => { if (SB.ok) await SB.auth.signOut(); Store.signOut(); go({ view: "home" }); }}
                className="btn btn-sm" style={{ background: "oklch(1 0 0 / 0.07)", color: "var(--coral)", fontSize: "0.78rem", padding: "6px 12px" }}>
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflow: "auto" }}>
          {/* Topbar */}
          <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--hairline)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>
              {sideLinks.find(l => l.id === tab)?.label}
            </h1>
            {!SB.ok && (
              <div className="row gap-2" style={{ background: "var(--coral-soft)", color: "var(--coral-deep)", padding: "8px 16px", borderRadius: "var(--r-pill)", fontSize: "0.82rem", fontWeight: 700 }}>
                <Icon name="shield" size={16} /> Supabase not configured — read-only mode
              </div>
            )}
          </div>
          <div style={{ padding: "32px 32px 80px" }}>
            {tab === "tours"    && <AdminTours />}
            {tab === "bookings" && <AdminBookings />}
            {tab === "users"    && <AdminUsers />}
            {tab === "settings" && <AdminSettings />}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}

Object.assign(window, { AdminPage });
