/* ================================================================
   Oscar Travel — Admin Panel v2 (CRM Dashboard)
   ================================================================ */

/* ── Shared primitives ──────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, color = "var(--ocean)", onClick }) {
  return (
    <div onClick={onClick} style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: "20px 22px", border: "1px solid var(--hairline)", cursor: onClick ? "pointer" : "default", transition: "box-shadow 0.3s, transform 0.3s" }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = "var(--sh-md)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ width: 42, height: 42, borderRadius: "var(--r-sm)", background: color + "1a", display: "grid", placeItems: "center", color }}><Icon name={icon} size={20} /></span>
        {sub && <span style={{ fontSize: "0.74rem", color: "var(--ink-3)", fontWeight: 600, background: "var(--bg-2)", padding: "3px 8px", borderRadius: "var(--r-pill)" }}>{sub}</span>}
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)" }}>{value}</div>
      <div style={{ fontSize: "0.84rem", color: "var(--ink-3)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function ATable({ cols, rows, empty = "No data yet." }) {
  if (!rows.length) return (
    <div style={{ textAlign: "center", padding: "52px 20px", background: "var(--surface)", borderRadius: "var(--r-md)", color: "var(--ink-3)", border: "1px solid var(--hairline)" }}>{empty}</div>
  );
  return (
    <div style={{ overflowX: "auto", borderRadius: "var(--r-md)", border: "1px solid var(--hairline)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface)", fontSize: "0.88rem" }}>
        <thead>
          <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--hairline)" }}>
            {cols.map((c, i) => <th key={i} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 700, fontSize: "0.76rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-3)", whiteSpace: "nowrap" }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--hairline)" : "none", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={e => e.currentTarget.style.background = ""}>
              {row}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function TD({ children, style }) {
  return <td style={{ padding: "12px 16px", verticalAlign: "middle", color: "var(--ink)", ...style }}>{children}</td>;
}

function StatusBadge({ status }) {
  const map = {
    active:      { bg: "var(--ocean-tint)",  color: "var(--ocean-deep)",  label: "Active" },
    draft:       { bg: "var(--sand)",         color: "oklch(0.46 0.06 78)", label: "Draft" },
    hidden:      { bg: "var(--hairline)",     color: "var(--ink-3)",       label: "Hidden" },
    new:         { bg: "var(--coral-soft)",   color: "var(--coral-deep)",  label: "New" },
    contacted:   { bg: "var(--ocean-tint)",   color: "var(--ocean-deep)",  label: "Contacted" },
    in_progress: { bg: "var(--teal-soft)",    color: "oklch(0.38 0.07 200)", label: "In Progress" },
    closed:      { bg: "var(--surface-2)",    color: "var(--ink-3)",       label: "Closed" },
    confirmed:   { bg: "var(--ocean-tint)",   color: "var(--ocean-deep)",  label: "Confirmed" },
    completed:   { bg: "var(--teal-soft)",    color: "oklch(0.38 0.07 200)", label: "Completed" },
    cancelled:   { bg: "var(--coral-soft)",   color: "var(--coral-deep)",  label: "Cancelled" },
    pending:     { bg: "var(--sand)",         color: "oklch(0.46 0.06 78)", label: "Pending" },
  };
  const s = map[status] || map.draft;
  return <span style={{ background: s.bg, color: s.color, fontSize: "0.74rem", fontWeight: 700, padding: "4px 10px", borderRadius: "var(--r-pill)", textTransform: "capitalize", whiteSpace: "nowrap" }}>{s.label}</span>;
}

/* ── SVG Bar Chart ─────────────────────────────────────────────── */
function BarChart({ data, color = "var(--ocean)" }) {
  if (!data || !data.length) return (
    <div style={{ height: 120, display: "grid", placeItems: "center", color: "var(--ink-3)", fontSize: "0.85rem" }}>No booking data yet</div>
  );
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div title={`${d.label}: ${d.count} bookings`} style={{ width: "100%", background: color, borderRadius: "4px 4px 0 0", height: Math.max((d.count / max) * 100, d.count > 0 ? 8 : 2) + "%", transition: "height 0.8s var(--ease-out)", opacity: 0.85 }} />
          </div>
          <span style={{ fontSize: "0.7rem", color: "var(--ink-3)", fontWeight: 600 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Drag & drop image zone ────────────────────────────────────── */
function DropZone({ onFile, uploading, preview, label = "Drop image or click to upload" }) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef(null);
  const handle = (file) => { if (file && file.type.startsWith("image/")) onFile(file); };
  return (
    <div onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]); }}
      onClick={() => !uploading && ref.current?.click()}
      style={{ border: `2px dashed ${dragging ? "var(--ocean)" : "var(--hairline-2)"}`, borderRadius: "var(--r-md)", padding: preview ? "8px" : "28px 16px", textAlign: "center", cursor: uploading ? "wait" : "pointer", background: dragging ? "var(--ocean-tint)" : "var(--bg-2)", transition: "all 0.25s", position: "relative", overflow: "hidden" }}>
      {preview
        ? <img src={preview} alt="" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, display: "block" }} />
        : <div>
            <Icon name="camera" size={28} style={{ color: "var(--ink-3)", margin: "0 auto 8px", display: "block" }} />
            <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--ink-2)" }}>{uploading ? "Uploading…" : label}</div>
            <div style={{ fontSize: "0.76rem", color: "var(--ink-3)", marginTop: 3 }}>PNG, JPG, WEBP · max 10 MB</div>
          </div>
      }
      {preview && <div style={{ position: "absolute", inset: 0, background: "oklch(0 0 0 / 0)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s" }}
        onMouseEnter={e => e.currentTarget.style.background = "oklch(0 0 0 / 0.35)"}
        onMouseLeave={e => e.currentTarget.style.background = "oklch(0 0 0 / 0)"}>
        <span style={{ color: "white", fontWeight: 700, fontSize: "0.82rem", background: "oklch(0 0 0 / 0.5)", padding: "6px 12px", borderRadius: "var(--r-pill)" }}>Change image</span>
      </div>}
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handle(e.target.files[0])} />
    </div>
  );
}

/* ── Tags input ────────────────────────────────────────────────── */
function TagsInput({ value = [], onChange }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setInput("");
  };
  return (
    <div style={{ border: "1px solid var(--hairline-2)", borderRadius: "var(--r-sm)", padding: "8px 10px", background: "var(--surface)", minHeight: 46 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: value.length ? 8 : 0 }}>
        {value.map(t => (
          <span key={t} style={{ background: "var(--ocean-tint)", color: "var(--ocean-deep)", padding: "3px 10px", borderRadius: "var(--r-pill)", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            {t}
            <button onClick={() => onChange(value.filter(x => x !== t))} style={{ color: "var(--ocean-deep)", lineHeight: 1, fontSize: "1rem" }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder="Add tag, press Enter" style={{ border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "0.9rem", flex: 1, color: "var(--ink)", minWidth: 100 }} />
        <button onClick={add} style={{ color: "var(--ocean)", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0 }}>+ Add</button>
      </div>
    </div>
  );
}

/* ── List input (included/excluded) ───────────────────────────── */
function ListInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState("");
  const add = () => { const v = input.trim(); if (v) { onChange([...value, v]); setInput(""); } };
  return (
    <div style={{ border: "1px solid var(--hairline-2)", borderRadius: "var(--r-sm)", background: "var(--surface)" }}>
      {value.map((item, i) => (
        <div key={i} className="row gap-2" style={{ padding: "8px 12px", borderBottom: "1px solid var(--hairline)" }}>
          <span style={{ flex: 1, fontSize: "0.88rem" }}>{item}</span>
          <button onClick={() => onChange(value.filter((_, j) => j !== i))} style={{ color: "var(--ink-3)", flexShrink: 0 }}><Icon name="x" size={14} /></button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 0, padding: "6px 8px" }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder} style={{ border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "0.88rem", flex: 1, color: "var(--ink)", padding: "4px 6px" }} />
        <button onClick={add} style={{ color: "var(--ocean)", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0 }}>+ Add</button>
      </div>
    </div>
  );
}

/* ── Itinerary editor (day-by-day plan) ───────────────────────── */
function ItineraryInput({ value = [], onChange }) {
  const update = (i, k, v) => onChange(value.map((d, j) => j === i ? { ...d, [k]: v } : d));
  const remove = (i) => onChange(value.filter((_, j) => j !== i).map((d, j) => ({ ...d, d: "Day " + (j + 1) })));
  const add = () => onChange([...value, { d: "Day " + (value.length + 1), t: "", x: "" }]);
  return (
    <div className="col gap-3">
      {value.map((day, i) => (
        <div key={i} style={{ border: "1px solid var(--hairline-2)", borderRadius: "var(--r-sm)", padding: 14, background: "var(--bg-2)" }}>
          <div className="row gap-3" style={{ marginBottom: 10 }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--ocean-tint)", color: "var(--ocean-deep)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "0.78rem", flexShrink: 0 }}>{i + 1}</span>
            <input className="input" value={day.t} onChange={e => update(i, "t", e.target.value)} placeholder="Day title, e.g. Arrive in Santorini" style={{ flex: 1, padding: "9px 12px" }} />
            <button onClick={() => remove(i)} style={{ color: "var(--coral-deep)", flexShrink: 0 }} title="Remove day"><Icon name="trash" size={16} /></button>
          </div>
          <textarea className="input" rows={2} value={day.x} onChange={e => update(i, "x", e.target.value)} placeholder="What happens this day…" style={{ resize: "vertical", fontSize: "0.86rem" }} />
        </div>
      ))}
      <button className="btn btn-ghost btn-sm" onClick={add} style={{ alignSelf: "flex-start" }}><Icon name="plus" size={15} /> Add day</button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════════ */
function AdminDashboard({ setTab }) {
  const [stats, setStats] = useState(null);
  const [inquiryStats, setInquiryStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!SB.ok) { setLoading(false); return; }
    const safe = (p, fallback) => Promise.race([
      p,
      new Promise(res => setTimeout(() => res(fallback), 7000))
    ]).catch(() => fallback);

    Promise.all([
      safe(SB.tours.stats(), null),
      safe(SB.inquiries.counts(), null),
      safe(SB.inquiries.all().then(d => d.slice(0, 5)), []),
      safe(SB.bookings.monthlyCounts(), []),
    ]).then(([ts, is, ri, mc]) => {
      if (!ts && !is) { setErr("Database error — run the RLS fix SQL in Supabase SQL Editor (see setup guide)."); }
      setStats(ts); setInquiryStats(is); setRecentInquiries(ri || []); setChart(mc || []);
    }).catch(() => setErr("Failed to load — check your Supabase connection."))
      .finally(() => setLoading(false));
  }, []);

  if (!SB.ok) return (
    <div style={{ background: "var(--coral-soft)", color: "var(--coral-deep)", borderRadius: "var(--r-md)", padding: 28, fontWeight: 600 }}>
      <Icon name="shield" size={20} style={{ display: "inline", marginRight: 8 }} />
      Supabase not configured. Add your credentials to <code>supabase.jsx</code>.
    </div>
  );

  if (err) return (
    <div style={{ background: "var(--coral-soft)", color: "var(--coral-deep)", borderRadius: "var(--r-md)", padding: 28 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}><Icon name="shield" size={18} style={{ display: "inline", marginRight: 8 }} />Database Error</div>
      <p style={{ marginBottom: 16, lineHeight: 1.6 }}>{err}</p>
      <details style={{ fontSize: "0.85rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>How to fix</summary>
        <pre style={{ marginTop: 12, padding: 14, background: "oklch(0 0 0 / 0.06)", borderRadius: 8, overflowX: "auto", lineHeight: 1.5, fontSize: "0.8rem" }}>{`-- Run this in Supabase SQL Editor:
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false);
$$;

DROP POLICY IF EXISTS "admin read profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin read all profiles" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "admin tours" ON public.tours;
CREATE POLICY "admin tours" ON public.tours FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "admin all bookings" ON public.bookings;
CREATE POLICY "admin all bookings" ON public.bookings FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "admin settings" ON public.site_settings;
CREATE POLICY "admin settings" ON public.site_settings FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin manages inquiries" ON public.inquiries;
CREATE POLICY "Admin manages inquiries" ON public.inquiries FOR ALL USING (public.is_admin());`}</pre>
      </details>
    </div>
  );

  if (loading) return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {[...Array(6)].map((_, i) => <div key={i} className="skel" style={{ height: 100, borderRadius: "var(--r-md)" }} />)}
    </div>
  );

  const chartBookings = chart.reduce((s, m) => s + (m.count || 0), 0);
  const chartRevenue  = chart.reduce((s, m) => s + (m.revenue || 0), 0);

  return (
    <div className="col gap-6">
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        <StatCard icon="compass"  label="Total tours"       value={stats?.total || 0}          color="var(--ocean)"      onClick={() => setTab("tours")} />
        <StatCard icon="checkC"   label="Active"            value={stats?.active || 0}          color="var(--teal)"       sub="published" />
        <StatCard icon="minus"    label="Draft"             value={stats?.draft || 0}           color="var(--gold)"       sub="unpublished" />
        <StatCard icon="x"        label="Hidden"            value={stats?.hidden || 0}          color="var(--ink-3)"      sub="not visible" />
        <StatCard icon="mail"     label="Total inquiries"   value={inquiryStats?.total || 0}    color="var(--coral)"      onClick={() => setTab("inquiries")} />
        <StatCard icon="sparkle"  label="New inquiries"     value={inquiryStats?.new || 0}      color="var(--coral-deep)" sub="unread" onClick={() => setTab("inquiries")} />
        <StatCard icon="calendar" label="Bookings (6 mo)"   value={chartBookings}               color="var(--ocean-bright)" onClick={() => setTab("bookings")} />
        <StatCard icon="tag"      label="Revenue (6 mo)"    value={"$" + chartRevenue.toLocaleString()} color="var(--teal)" onClick={() => setTab("bookings")} />
      </div>

      {/* Chart + Recent inquiries */}
      <div className="admin-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, border: "1px solid var(--hairline)" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, color: "var(--ink-2)" }}>Monthly Bookings</h3>
          <BarChart data={chart} />
          {!chart.length && <p style={{ color: "var(--ink-3)", fontSize: "0.84rem", marginTop: 8, textAlign: "center" }}>Bookings will appear here once created</p>}
        </div>
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, border: "1px solid var(--hairline)" }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink-2)" }}>Recent Inquiries</h3>
            <button onClick={() => setTab("inquiries")} style={{ fontSize: "0.8rem", color: "var(--ocean)", fontWeight: 700 }}>View all →</button>
          </div>
          {!recentInquiries.length
            ? <div style={{ textAlign: "center", padding: "24px 0", color: "var(--ink-3)", fontSize: "0.85rem" }}>No inquiries yet</div>
            : <div className="col gap-3">
                {recentInquiries.map(inq => (
                  <div key={inq.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid var(--hairline)" }}>
                    <span style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--ocean-tint)", color: "var(--ocean-deep)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "0.95rem", flexShrink: 0 }}>{(inq.name || "?")[0].toUpperCase()}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row" style={{ justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>{inq.name}</span>
                        <StatusBadge status={inq.status} />
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--ink-3)", marginTop: 2 }}>{inq.tour_title || "General inquiry"}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--ink-2)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inq.message}</div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Top tours */}
      {stats?.topViewed?.length > 0 && (
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, border: "1px solid var(--hairline)" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink-2)", marginBottom: 18 }}>Most Viewed Tours</h3>
          <div className="col gap-0">
            {stats.topViewed.map((tour, i) => (
              <div key={tour.id} className="row gap-4" style={{ padding: "12px 0", borderBottom: i < stats.topViewed.length - 1 ? "1px solid var(--hairline)" : "none", alignItems: "center" }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: i === 0 ? "var(--ocean)" : "var(--surface-2)", color: i === 0 ? "white" : "var(--ink-3)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "0.8rem", flexShrink: 0 }}>{i + 1}</span>
                <div style={{ width: 44, height: 34, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "var(--ocean-tint)" }}>
                  <img src={tour.image_url || (typeof PHOTOS !== "undefined" && PHOTOS[tour.theme]) || ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tour.title}</div>
                </div>
                <div style={{ fontWeight: 800, color: "var(--ocean)", fontSize: "0.9rem", flexShrink: 0 }}>{tour.view_count || 0} <span style={{ fontWeight: 400, color: "var(--ink-3)", fontSize: "0.78rem" }}>views</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TourField({ label, hint, children }) {
  return (
    <div className="field">
      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--ink-2)" }}>{label}</label>
      {children}
      {hint && <span style={{ fontSize: "0.74rem", color: "var(--ink-3)" }}>{hint}</span>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TOUR MANAGEMENT
══════════════════════════════════════════════════════════════════ */
function TourEditModal({ tour, onClose, onSaved }) {
  const isNew = !tour?.id;
  const toast = useToast();

  const blank = { id: "tour-" + Date.now(), title: "", blurb: "", full_description: "", country: "", city: "", region: "", place: "", days: 7, price: "", discount_price: "", old_price: "", category: "luxury", theme: "ocean", difficulty: "Moderate", group_max: 12, group_min: 1, season: "year-round", image_url: "", gallery_urls: [], departure_dates: [], tags_json: [], included_json: [], excluded_json: [], highlights: [], itinerary: [], featured: false, popular: false, is_hot: false, status: "active", rating: 5.0, reviews: 0 };

  const [form, setForm] = useState(tour ? { ...blank, ...tour, tags_json: tour.tags_json || (tour.tags ? tour.tags : []), included_json: tour.included_json || (tour.included ? tour.included : []), excluded_json: tour.excluded_json || (tour.notIncluded ? tour.notIncluded : []), highlights: tour.highlights || [], itinerary: tour.itinerary || [] } : blank);
  const [uploading, setUploading] = useState(false);
  const [galUploading, setGalUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dateInput, setDateInput] = useState("");

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));
  const setE = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const uploadMain = async (file) => {
    setUploading(true);
    try { const url = await SB.storage.upload(file); set("image_url")(url); toast("Image uploaded!", "check"); }
    catch(e) {
      const msg = e.message && e.message.includes("Bucket not found")
        ? 'Storage bucket missing. Go to Supabase → Storage → New bucket → name it "tour-images" (public).'
        : "Upload failed: " + e.message;
      toast(msg, "x");
    }
    setUploading(false);
  };

  const uploadGallery = async (file) => {
    setGalUploading(true);
    try {
      const url = await SB.storage.upload(file);
      setForm(p => ({ ...p, gallery_urls: [...(p.gallery_urls || []), url] }));
      toast("Added to gallery!", "check");
    } catch(e) {
      const msg = e.message && e.message.includes("Bucket not found")
        ? 'Storage bucket missing. Create "tour-images" public bucket in Supabase → Storage.'
        : "Upload failed: " + e.message;
      toast(msg, "x");
    }
    setGalUploading(false);
  };

  const removeGallery = (url) => setForm(p => ({ ...p, gallery_urls: p.gallery_urls.filter(u => u !== url) }));
  const addDate = () => { const v = dateInput.trim(); if (v) { setForm(p => ({ ...p, departure_dates: [...(p.departure_dates || []), v] })); setDateInput(""); } };

  const save = async (status = form.status) => {
    if (!form.title.trim()) { toast("Title is required", "x"); return; }
    setSaving(true);
    const payload = {
      id: form.id, title: form.title, blurb: form.blurb,
      full_description: form.full_description,
      country: form.country, city: form.city,
      region: form.region || form.country || form.city || "",
      place: form.city && form.country ? `${form.city}, ${form.country}` : (form.place || ""),
      days: Number(form.days) || 7,
      price: Number(form.price) || 0,
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      old_price: form.old_price ? Number(form.old_price) : null,
      category: form.category || "luxury",
      difficulty: form.difficulty || "Moderate",
      group_max: Number(form.group_max) || 12,
      season: form.season || "year-round",
      theme: form.theme || "ocean",
      image_url: form.image_url || null,
      gallery_urls: form.gallery_urls || [],
      departure_dates: form.departure_dates || [],
      tags_json: form.tags_json || [],
      included_json: form.included_json || [],
      excluded_json: form.excluded_json || [],
      highlights: form.highlights || [],
      itinerary: (form.itinerary || []).filter(d => d.t || d.x),
      featured: !!form.featured, popular: !!form.popular, is_hot: !!form.is_hot,
      rating: Number(form.rating) || 5.0,
      reviews: Number(form.reviews) || 0,
      status,
    };
    try {
      try {
        await SB.tours.upsert(payload);
      } catch (e) {
        // DBs that haven't run SCHEMA_V3.sql yet don't have these columns
        if (/column|schema cache/i.test(e.message || "")) {
          const { highlights, itinerary, ...rest } = payload;
          await SB.tours.upsert(rest);
          toast("Saved — run SCHEMA_V3.sql in Supabase to enable highlights & itinerary", "check");
          onSaved();
          setSaving(false);
          return;
        }
        throw e;
      }
      toast(isNew ? "Tour created!" : "Tour saved!", "check");
      onSaved();
    } catch(e) { toast("Save failed: " + e.message, "x"); }
    setSaving(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "var(--bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: "1px solid var(--hairline)", background: "var(--surface)", flexShrink: 0 }}>
        <div className="row gap-4">
          <button onClick={onClose} className="row gap-2" style={{ color: "var(--ink-3)", fontWeight: 600, fontSize: "0.9rem" }}><Icon name="arrowL" size={18} /> Back</button>
          <div style={{ width: 1, height: 20, background: "var(--hairline)" }} />
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{isNew ? "New Tour" : "Edit: " + form.title}</h2>
        </div>
        <div className="row gap-3">
          <select value={form.status} onChange={setE("status")} className="select" style={{ width: "auto", padding: "8px 32px 8px 12px" }}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="hidden">Hidden</option>
          </select>
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-ghost" onClick={() => save("draft")} disabled={saving}>Save as Draft</button>
          <button className="btn btn-primary" onClick={() => save("active")} disabled={saving}>
            {saving ? "Saving…" : <><Icon name="check" size={18} /> Publish</>}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 28px 60px" }}>
        <div className="tour-edit-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, maxWidth: 1100, margin: "0 auto" }}>
          {/* Left column */}
          <div className="col gap-5">
            {/* Basic info */}
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, border: "1px solid var(--hairline)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink-3)", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Basic Information</h3>
              <div className="col gap-4">
                <TourField label="Tour title *"><input className="input" value={form.title} onChange={setE("title")} placeholder="e.g. Santorini Private Yacht Experience" /></TourField>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <TourField label="Country"><input className="input" value={form.country} onChange={setE("country")} placeholder="Greece" /></TourField>
                  <TourField label="City"><input className="input" value={form.city} onChange={setE("city")} placeholder="Santorini" /></TourField>
                  <TourField label="Duration (days)"><input className="input" type="number" value={form.days} onChange={setE("days")} min={1} /></TourField>
                  <TourField label="Category">
                    <select className="select" value={form.category} onChange={setE("category")}>
                      {(typeof CATEGORIES !== "undefined" ? CATEGORIES.filter(c => c.id !== "all") : []).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </TourField>
                  <TourField label="Difficulty">
                    <select className="select" value={form.difficulty} onChange={setE("difficulty")}>
                      {["Easy","Moderate","Challenging","Strenuous"].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </TourField>
                  <TourField label="Max group size"><input className="input" type="number" value={form.group_max} onChange={setE("group_max")} min={1} /></TourField>
                  <TourField label="Theme" hint="Controls card image style">
                    <select className="select" value={form.theme || "ocean"} onChange={setE("theme")}>
                      {["ocean","santorini","maldives","safari","alps","tokyo","desert","jungle","city","sunset","arctic","petra","machu","amazon","bali","venice","amalfi","cappadocia","norway","iceland"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                    </select>
                  </TourField>
                  <TourField label="Best season">
                    <select className="select" value={form.season || "year-round"} onChange={setE("season")}>
                      {["year-round","spring","summer","autumn","winter","spring-autumn","summer-autumn"].map(s => <option key={s} value={s}>{s.replace(/-/g," ")}</option>)}
                    </select>
                  </TourField>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, border: "1px solid var(--hairline)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink-3)", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Pricing</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <TourField label="Price (USD) *" hint="Per person"><input className="input" type="number" value={form.price} onChange={setE("price")} placeholder="3490" /></TourField>
                <TourField label="Discount price" hint="Shows as current price"><input className="input" type="number" value={form.discount_price} onChange={setE("discount_price")} placeholder="Optional" /></TourField>
                <TourField label="Original price" hint="Shows crossed out"><input className="input" type="number" value={form.old_price} onChange={setE("old_price")} placeholder="Optional" /></TourField>
              </div>
            </div>

            {/* Description */}
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, border: "1px solid var(--hairline)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink-3)", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Description</h3>
              <div className="col gap-4">
                <TourField label="Short description" hint="Shown on listing cards (1-2 sentences)"><textarea className="input" rows={2} value={form.blurb} onChange={setE("blurb")} placeholder="A captivating one-liner for cards and previews" style={{ resize: "vertical" }} /></TourField>
                <TourField label="Full description" hint="Shown on the tour detail page"><textarea className="input" rows={6} value={form.full_description} onChange={setE("full_description")} placeholder="Full tour details, atmosphere, unique selling points…" style={{ resize: "vertical" }} /></TourField>
              </div>
            </div>

            {/* Highlights */}
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, border: "1px solid var(--hairline)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink-3)", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Trip Highlights</h3>
              <ListInput value={form.highlights || []} onChange={set("highlights")} placeholder="e.g. Sail the caldera at golden hour" />
            </div>

            {/* Itinerary */}
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, border: "1px solid var(--hairline)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink-3)", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Day-by-day Itinerary</h3>
              <ItineraryInput value={form.itinerary || []} onChange={set("itinerary")} />
            </div>

            {/* Departure dates */}
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, border: "1px solid var(--hairline)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink-3)", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Departure Dates</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {(form.departure_dates || []).map(d => (
                  <span key={d} style={{ background: "var(--ocean-tint)", color: "var(--ocean-deep)", padding: "4px 12px", borderRadius: "var(--r-pill)", fontSize: "0.82rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="calendar" size={13} /> {d}
                    <button onClick={() => setForm(p => ({ ...p, departure_dates: p.departure_dates.filter(x => x !== d) }))} style={{ color: "var(--ocean-deep)", lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="input" value={dateInput} onChange={e => setDateInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addDate()} placeholder="e.g. 14 Jun 2026" style={{ flex: 1 }} />
                <button className="btn btn-ghost btn-sm" onClick={addDate}><Icon name="plus" size={16} /> Add</button>
              </div>
            </div>

            {/* Tags */}
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, border: "1px solid var(--hairline)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink-3)", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Tags</h3>
              <TagsInput value={form.tags_json || []} onChange={set("tags_json")} />
            </div>

            {/* Included / Excluded */}
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, border: "1px solid var(--hairline)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink-3)", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>What's Included / Excluded</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <TourField label="Included services">
                  <ListInput value={form.included_json || []} onChange={set("included_json")} placeholder="e.g. Private transfers" />
                </TourField>
                <TourField label="Excluded services">
                  <ListInput value={form.excluded_json || []} onChange={set("excluded_json")} placeholder="e.g. International flights" />
                </TourField>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="col gap-5">
            {/* Badges */}
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 20, border: "1px solid var(--hairline)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink-3)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Badges</h3>
              {[
                ["featured", "Featured", "Show on homepage featured section"],
                ["popular", "Popular", "Show Popular badge on card"],
                ["is_hot", "Hot Offer", "Show Hot Offer badge"],
              ].map(([k, label, hint]) => (
                <label key={k} className="row gap-3" style={{ cursor: "pointer", marginBottom: 12, alignItems: "flex-start" }}>
                  <input type="checkbox" checked={!!form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.checked }))} style={{ marginTop: 2, width: 16, height: 16, accentColor: "var(--ocean)" }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{label}</div>
                    <div style={{ fontSize: "0.76rem", color: "var(--ink-3)" }}>{hint}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Main image */}
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 20, border: "1px solid var(--hairline)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink-3)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>Main Image</h3>
              <DropZone onFile={uploadMain} uploading={uploading} preview={form.image_url} />
              <div style={{ marginTop: 8 }}>
                <label style={{ fontSize: "0.76rem", color: "var(--ink-3)", display: "block", marginBottom: 4 }}>Or paste image URL:</label>
                <input className="input" value={form.image_url || ""} onChange={setE("image_url")} style={{ fontSize: "0.8rem" }} placeholder="https://images.unsplash.com/..." />
              </div>
            </div>

            {/* Gallery */}
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 20, border: "1px solid var(--hairline)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink-3)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>Gallery Images</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                {(form.gallery_urls || []).map((url, i) => (
                  <div key={i} style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
                    <img src={url} alt="" style={{ width: "100%", height: 80, objectFit: "cover", display: "block" }} />
                    <button onClick={() => removeGallery(url)} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "oklch(0 0 0 / 0.6)", color: "white", display: "grid", placeItems: "center" }}><Icon name="x" size={12} /></button>
                  </div>
                ))}
              </div>
              <DropZone onFile={uploadGallery} uploading={galUploading} label="Drop to add gallery image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      if (SB.ok) {
        const sbTours = await SB.tours.list();
        setTours(mergeTours(sbTours, { publicOnly: false }).map(t => ({ status: "active", view_count: 0, ...t })));
      } else {
        setTours((typeof TOURS !== "undefined" ? TOURS : []).map(t => ({ ...t, status: "active", view_count: 0 })));
      }
    } catch(e) { toast("Failed to load tours: " + e.message, "x"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = filterStatus === "all" ? tours : tours.filter(t => (t.status || "active") === filterStatus);

  const deleteTour = async (id) => {
    const isBuiltIn = typeof TOURS !== "undefined" && TOURS.some(t => t.id === id);
    if (isBuiltIn) {
      /* Built-in tours live in the code bundle — a DB delete would just make
         them reappear. Hide them instead so they vanish from the site. */
      if (!confirm("This is a built-in tour, so it can't be permanently deleted — but it will be hidden everywhere on the site. Continue?")) return;
      const t = tours.find(x => x.id === id) || {};
      try {
        await SB.tours.upsert({
          id, title: t.title, blurb: t.blurb || "", region: t.region || "", place: t.place || "",
          days: t.days || 7, price: t.price || 0, old_price: t.old_price ?? t.oldPrice ?? null,
          rating: t.rating || 5, reviews: t.reviews || 0, theme: t.theme || "ocean",
          featured: !!t.featured, popular: !!t.popular,
          category: t.category || (t.categories && t.categories[0]) || "luxury",
          difficulty: t.difficulty || "Moderate", group_max: t.group_max || t.groupMax || 12,
          season: t.season || "year-round", status: "hidden",
        });
        toast("Tour hidden from the site", "check"); load();
      } catch(e) { toast("Failed: " + e.message, "x"); }
      return;
    }
    if (!confirm("Delete this tour? This cannot be undone.")) return;
    try { await SB.tours.delete(id); toast("Deleted", "check"); load(); }
    catch(e) { toast("Delete failed", "x"); }
  };

  const openEdit = (tour) => { setEditing(tour); setShowModal(true); };
  const openNew  = () => { setEditing(null); setShowModal(true); };
  const onSaved  = () => { setShowModal(false); load(); };

  const tabs = [["all","All"], ["active","Active"], ["draft","Draft"], ["hidden","Hidden"]];

  if (showModal) return <TourEditModal tour={editing} onClose={() => setShowModal(false)} onSaved={onSaved} />;

  return (
    <div>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div className="row gap-2">
          {tabs.map(([v, l]) => (
            <button key={v} onClick={() => setFilterStatus(v)} className="btn btn-sm" style={{ background: filterStatus === v ? "var(--ink)" : "var(--surface)", color: filterStatus === v ? "white" : "var(--ink-2)", border: "1px solid var(--hairline)" }}>{l}</button>
          ))}
        </div>
        <button className="btn btn-primary btn-sm" onClick={openNew}><Icon name="plus" size={16} /> New Tour</button>
      </div>

      {!SB.ok && <div style={{ background: "var(--sand)", color: "oklch(0.46 0.06 78)", padding: "10px 16px", borderRadius: "var(--r-sm)", marginBottom: 16, fontSize: "0.85rem", fontWeight: 600 }}>Supabase not configured — changes won't persist</div>}

      {loading
        ? <div style={{ textAlign: "center", padding: 48, color: "var(--ink-3)" }}>Loading tours…</div>
        : <ATable
            cols={["", "Tour", "Status", "Price", "Views", "Badges", "Actions"]}
            empty="No tours found."
            rows={filtered.map(tour => [
              <TD><div style={{ width: 56, height: 42, borderRadius: 6, overflow: "hidden", background: "var(--ocean-tint)" }}><img src={tour.image_url || (typeof PHOTOS !== "undefined" && PHOTOS[tour.theme]) || ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div></TD>,
              <TD><div style={{ fontWeight: 700, maxWidth: 220 }}>{tour.title}</div><div style={{ fontSize: "0.78rem", color: "var(--ink-3)" }}>{tour.place || `${tour.city || ""}${tour.country ? ", " + tour.country : ""}`}</div></TD>,
              <TD><StatusBadge status={tour.status || "active"} /></TD>,
              <TD><div style={{ fontWeight: 700 }}>{fmtPrice(tourPrice(tour))}</div>{tourOldPrice(tour) && <div style={{ fontSize: "0.76rem", color: "var(--ink-3)", textDecoration: "line-through" }}>{fmtPrice(tourOldPrice(tour))}</div>}</TD>,
              <TD><span style={{ fontWeight: 700, color: "var(--ocean)" }}>{tour.view_count || 0}</span></TD>,
              <TD><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{tour.featured && <span style={{ fontSize: "0.68rem", background: "var(--ocean-tint)", color: "var(--ocean-deep)", padding: "2px 7px", borderRadius: "var(--r-pill)", fontWeight: 700 }}>Featured</span>}{tour.popular && <span style={{ fontSize: "0.68rem", background: "var(--coral-soft)", color: "var(--coral-deep)", padding: "2px 7px", borderRadius: "var(--r-pill)", fontWeight: 700 }}>Popular</span>}{tour.is_hot && <span style={{ fontSize: "0.68rem", background: "var(--sand)", color: "oklch(0.46 0.06 78)", padding: "2px 7px", borderRadius: "var(--r-pill)", fontWeight: 700 }}>Hot</span>}</div></TD>,
              <TD><div className="row gap-2"><button className="btn btn-ghost btn-sm" onClick={() => openEdit(tour)}>Edit</button><button className="btn btn-sm" onClick={() => deleteTour(tour.id)} style={{ background: "var(--coral-soft)", color: "var(--coral-deep)" }}>{(typeof TOURS !== "undefined" && TOURS.some(t => t.id === tour.id)) ? "Hide" : "Delete"}</button></div></TD>,
            ])}
          />
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   INQUIRIES
══════════════════════════════════════════════════════════════════ */
function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (!SB.ok) { setLoading(false); return; }
    SB.inquiries.all().then(setInquiries).catch(() => toast("Failed to load", "x")).finally(() => setLoading(false));
  }, []);

  const setStatus = async (id, status) => {
    try {
      await SB.inquiries.updateStatus(id, status);
      setInquiries(is => is.map(i => i.id === id ? { ...i, status } : i));
      if (selected?.id === id) setSelected(s => ({ ...s, status }));
      toast("Status updated", "check");
    } catch(e) { toast("Update failed", "x"); }
  };

  const statuses = ["all","new","contacted","in_progress","closed"];
  const filtered = filter === "all" ? inquiries : inquiries.filter(i => i.status === filter);

  if (!SB.ok) return <div style={{ textAlign: "center", padding: 60, color: "var(--ink-3)" }}>Configure Supabase to see inquiries.</div>;
  if (loading)  return <div style={{ textAlign: "center", padding: 48, color: "var(--ink-3)" }}>Loading inquiries…</div>;

  return (
    <div className="admin-inq-grid" style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20 }}>
      <div>
        <div className="row gap-2" style={{ marginBottom: 18, flexWrap: "wrap" }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} className="btn btn-sm" style={{ background: filter === s ? "var(--ink)" : "var(--surface)", color: filter === s ? "white" : "var(--ink-2)", border: "1px solid var(--hairline)", textTransform: "capitalize" }}>
              {s === "all" ? "All" : s.replace("_", " ")} {s !== "all" && `(${inquiries.filter(i => i.status === s).length})`}
            </button>
          ))}
        </div>
        <ATable
          cols={["Name", "Contact", "Tour", "Message", "Date", "Status", ""]}
          empty="No inquiries yet — they'll appear here when visitors submit the inquiry form."
          rows={filtered.map(inq => [
            <TD><div style={{ fontWeight: 700 }}>{inq.name}</div></TD>,
            <TD><div style={{ fontSize: "0.84rem" }}>{inq.email}</div>{inq.phone && <div style={{ fontSize: "0.78rem", color: "var(--ink-3)" }}>{inq.phone}</div>}</TD>,
            <TD><div style={{ fontSize: "0.84rem", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inq.tour_title || "General"}</div></TD>,
            <TD><div style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.84rem", color: "var(--ink-2)" }}>{inq.message}</div></TD>,
            <TD><span style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>{inq.created_at ? new Date(inq.created_at).toLocaleDateString() : "—"}</span></TD>,
            <TD><select value={inq.status} onChange={e => setStatus(inq.id, e.target.value)} style={{ border: "none", background: "transparent", fontWeight: 700, cursor: "pointer", color: "var(--ink)", fontFamily: "var(--font-sans)", fontSize: "0.82rem" }}>{["new","contacted","in_progress","closed"].map(s => <option key={s} value={s}>{s.replace("_"," ")}</option>)}</select></TD>,
            <TD><button onClick={() => setSelected(selected?.id === inq.id ? null : inq)} style={{ fontSize: "0.8rem", color: "var(--ocean)", fontWeight: 700 }}>{selected?.id === inq.id ? "Close" : "View"}</button></TD>,
          ])}
        />
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, border: "1px solid var(--hairline)", height: "fit-content", position: "sticky", top: 20 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>Inquiry detail</h3>
            <button onClick={() => setSelected(null)} style={{ color: "var(--ink-3)" }}><Icon name="x" size={18} /></button>
          </div>
          <div className="col gap-3">
            <div><div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Name</div><div style={{ fontWeight: 700, marginTop: 2 }}>{selected.name}</div></div>
            <div><div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</div><a href={"mailto:" + selected.email} style={{ color: "var(--ocean)", marginTop: 2, display: "block" }}>{selected.email}</a></div>
            {selected.phone && <div><div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Phone</div><a href={"tel:" + selected.phone} style={{ color: "var(--ocean)", marginTop: 2, display: "block" }}>{selected.phone}</a></div>}
            {selected.tour_title && <div><div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Tour</div><div style={{ marginTop: 2 }}>{selected.tour_title}</div></div>}
            <div><div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Message</div><div style={{ marginTop: 6, padding: 14, background: "var(--bg-2)", borderRadius: "var(--r-sm)", fontSize: "0.9rem", lineHeight: 1.6, color: "var(--ink-2)" }}>{selected.message}</div></div>
            <div><div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Status</div>
              <div className="row gap-2" style={{ flexWrap: "wrap" }}>
                {["new","contacted","in_progress","closed"].map(s => (
                  <button key={s} onClick={() => setStatus(selected.id, s)} className="btn btn-sm" style={{ background: selected.status === s ? "var(--ink)" : "var(--surface)", color: selected.status === s ? "white" : "var(--ink-2)", border: "1px solid var(--hairline)", textTransform: "capitalize", fontSize: "0.76rem" }}>{s.replace("_"," ")}</button>
                ))}
              </div>
            </div>
            <a href={"mailto:" + selected.email + "?subject=Re: " + (selected.tour_title || "Your inquiry") + " — Oscar Travel"} className="btn btn-primary btn-sm btn-block" style={{ marginTop: 8 }}><Icon name="mail" size={16} /> Reply by email</a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   BOOKINGS
══════════════════════════════════════════════════════════════════ */
function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!SB.ok) { setLoading(false); return; }
    SB.bookings.all().then(setBookings).catch(() => toast("Failed to load", "x")).finally(() => setLoading(false));
  }, []);

  const setStatus = async (id, status) => {
    try { await SB.bookings.updateStatus(id, status); setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b)); toast("Updated", "check"); }
    catch(e) { toast("Failed", "x"); }
  };

  /* Cancelled bookings shouldn't count toward revenue */
  const total = bookings.reduce((s, b) => s + (b.status === "cancelled" ? 0 : Number(b.total) || 0), 0);

  if (!SB.ok) return <div style={{ textAlign: "center", padding: 60, color: "var(--ink-3)" }}>Configure Supabase to see bookings.</div>;
  if (loading) return <div style={{ textAlign: "center", padding: 48, color: "var(--ink-3)" }}>Loading bookings…</div>;

  return (
    <div>
      <div className="admin-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard icon="compass"  label="Total bookings" value={bookings.length}    color="var(--ocean)" />
        <StatCard icon="checkC"   label="Confirmed"      value={bookings.filter(b => b.status === "confirmed").length} color="var(--teal)" />
        <StatCard icon="tag"      label="Total revenue"  value={"$" + total.toLocaleString()}  color="var(--coral)" />
      </div>
      <ATable
        cols={["ID", "Guest", "Tour", "Date", "Guests", "Total", "Status", "Booked on"]}
        empty="No bookings yet."
        rows={bookings.map(b => [
          <TD><span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "var(--ink-3)" }}>{b.id?.slice(0,8)}</span></TD>,
          <TD><div style={{ fontWeight: 600 }}>{b.profiles?.name || b.guest_name || "—"}</div><div style={{ fontSize: "0.78rem", color: "var(--ink-3)" }}>{b.profiles?.email || b.guest_email}</div></TD>,
          <TD><div style={{ fontWeight: 600, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.tours?.title || b.tour_id || "—"}</div></TD>,
          <TD><span style={{ fontSize: "0.85rem" }}>{b.date || "—"}</span></TD>,
          <TD>{b.guests}</TD>,
          <TD><span style={{ fontWeight: 700 }}>{b.total ? "$" + Number(b.total).toLocaleString() : "—"}</span></TD>,
          <TD><select value={b.status} onChange={e => setStatus(b.id, e.target.value)} style={{ border: "none", background: "transparent", fontWeight: 700, cursor: "pointer", color: "var(--ink)", fontFamily: "var(--font-sans)", fontSize: "0.82rem" }}>{["confirmed","completed","cancelled","pending"].map(s => <option key={s}>{s}</option>)}</select></TD>,
          <TD><span style={{ fontSize: "0.78rem", color: "var(--ink-3)" }}>{b.created_at ? new Date(b.created_at).toLocaleDateString() : "—"}</span></TD>,
        ])}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   USERS
══════════════════════════════════════════════════════════════════ */
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!SB.ok) { setLoading(false); return; }
    SB.users.all().then(setUsers).catch(() => toast("Failed to load", "x")).finally(() => setLoading(false));
  }, []);

  const toggleAdmin = async (id, cur) => {
    try { await SB.users.setAdmin(id, !cur); setUsers(us => us.map(u => u.id === id ? { ...u, is_admin: !cur } : u)); toast(!cur ? "Admin granted" : "Admin removed", "check"); }
    catch(e) { toast("Failed", "x"); }
  };

  if (!SB.ok) return <div style={{ textAlign: "center", padding: 60, color: "var(--ink-3)" }}>Configure Supabase to see users.</div>;
  if (loading) return <div style={{ textAlign: "center", padding: 48, color: "var(--ink-3)" }}>Loading users…</div>;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <StatCard icon="users"  label="Registered users" value={users.length} color="var(--ocean)" />
        <StatCard icon="shield" label="Admins"            value={users.filter(u => u.is_admin).length} color="var(--coral)" />
      </div>
      <ATable
        cols={["User", "Email", "Joined", "Role", "Action"]}
        empty="No users yet."
        rows={users.map(u => [
          <TD><div className="row gap-3"><span style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--ocean-tint)", color: "var(--ocean-deep)", display: "grid", placeItems: "center", fontWeight: 800, flexShrink: 0 }}>{(u.name || u.email || "?")[0].toUpperCase()}</span><span style={{ fontWeight: 700 }}>{u.name || "—"}</span></div></TD>,
          <TD><span style={{ color: "var(--ink-2)" }}>{u.email}</span></TD>,
          <TD><span style={{ fontSize: "0.82rem", color: "var(--ink-3)" }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</span></TD>,
          <TD>{u.is_admin ? <StatusBadge status="active" /> : <span style={{ fontSize: "0.82rem", color: "var(--ink-3)" }}>User</span>}</TD>,
          <TD><button onClick={() => toggleAdmin(u.id, u.is_admin)} className="btn btn-sm" style={{ background: u.is_admin ? "var(--coral-soft)" : "var(--ocean-tint)", color: u.is_admin ? "var(--coral-deep)" : "var(--ocean-deep)" }}>{u.is_admin ? "Remove admin" : "Make admin"}</button></TD>,
        ])}
      />
    </div>
  );
}

function SettingsField({ id, label, placeholder, hint, form, setForm, textarea }) {
  const El = textarea ? "textarea" : "input";
  return (
    <div className="field">
      <label>{label}</label>
      <El className="input" placeholder={placeholder || ""} value={form[id] || ""} rows={textarea ? 3 : undefined}
        onChange={e => setForm(p => ({ ...p, [id]: e.target.value }))}
        style={textarea ? { resize: "vertical" } : undefined} />
      {hint && <span style={{ fontSize: "0.76rem", color: "var(--ink-3)" }}>{hint}</span>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════════════════════ */
function AdminSettings() {
  const [form, setForm] = useState({ hero_image_url: "", hero_heading: "", hero_sub: "", contact_email: "", whatsapp: "", instagram: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!SB.ok) { setLoading(false); return; }
    SB.settings.getAll().then(all => setForm(p => ({ ...p, ...all }))).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try { await Promise.all(Object.entries(form).map(([k, v]) => SB.settings.set(k, v))); toast("Settings saved!", "check"); }
    catch(e) { toast("Save failed: " + e.message, "x"); }
    setSaving(false);
  };

  if (!SB.ok) return <div style={{ background: "var(--coral-soft)", color: "var(--coral-deep)", borderRadius: "var(--r-md)", padding: 28, fontWeight: 600 }}>Configure Supabase to enable settings.</div>;
  if (loading) return <div style={{ textAlign: "center", padding: 48, color: "var(--ink-3)" }}>Loading settings…</div>;

  /* NOTE: fields render SettingsField directly (not through a locally-defined
     wrapper component) — a wrapper redefined on every render remounts the
     input and loses focus after each keystroke. */
  const sf = (props) => <SettingsField {...props} form={form} setForm={setForm} />;

  return (
    <div style={{ maxWidth: 720 }}>
      <p style={{ color: "var(--ink-3)", marginBottom: 28, fontSize: "0.9rem" }}>These override built-in defaults. Leave blank to use defaults.</p>
      <div className="col gap-4">
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 28, border: "1px solid var(--hairline)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: 8, color: "var(--ink-2)" }}>Announcement Bar</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--ink-3)", marginBottom: 18 }}>Shown as a slim banner at the very top of every page. Leave empty to hide.</p>
          {sf({ id: "announcement", label: "Announcement text", placeholder: "🌴 Summer sale — save up to $500 on Mediterranean journeys!" })}
        </div>
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 28, border: "1px solid var(--hairline)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: 20, color: "var(--ink-2)" }}>Homepage Hero</h3>
          <div className="col gap-4">
            {sf({ id: "hero_image_url", label: "Hero background image URL", placeholder: "https://images.unsplash.com/...", hint: "Overrides the hero video when set" })}
            {sf({ id: "hero_heading", label: "Main heading", placeholder: "Discover the World" })}
            {sf({ id: "hero_sub", label: "Subtitle", placeholder: "Extraordinary journeys, beautifully planned." })}
          </div>
        </div>
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 28, border: "1px solid var(--hairline)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: 20, color: "var(--ink-2)" }}>Footer</h3>
          <div className="col gap-4">
            {sf({ id: "footer_tagline", label: "Footer tagline", placeholder: "Curated journeys to the world's most beautiful places…", textarea: true })}
            {sf({ id: "footer_col2_h", label: "Column 2 heading", placeholder: "Company" })}
            {sf({ id: "footer_col2", label: "Column 2 links (one per line)", placeholder: "Our story\nTravel guides\nSustainability\nCareers\nPress", textarea: true, hint: "One link label per line" })}
            {sf({ id: "footer_col3_h", label: "Column 3 heading", placeholder: "Support" })}
            {sf({ id: "footer_col3", label: "Column 3 links (one per line)", placeholder: "Help centre\nBooking terms\nTravel insurance\nContact us\nFAQ", textarea: true, hint: "One link label per line" })}
            {sf({ id: "footer_copy", label: "Copyright text", placeholder: "© 2026 Oscar Travel. Crafted for the curious." })}
          </div>
        </div>
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 28, border: "1px solid var(--hairline)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: 20, color: "var(--ink-2)" }}>Contact & Social</h3>
          <div className="col gap-4">
            {sf({ id: "contact_email", label: "Contact email", placeholder: "hello@luminavoyages.com" })}
            {sf({ id: "whatsapp", label: "WhatsApp", placeholder: "+998 77 608 68 98", hint: "Default is +998 77 608 68 98 — set a value here to override" })}
            {sf({ id: "instagram", label: "Instagram", placeholder: "@oscartravel" })}
          </div>
        </div>
        <button className="btn btn-primary btn-lg" onClick={save} disabled={saving}>{saving ? "Saving…" : <><Icon name="check" size={20} /> Save all settings</>}</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN AdminPage
══════════════════════════════════════════════════════════════════ */
function AdminPage({ go, store }) {
  const [tab, setTab] = useState("dashboard");
  const [authWaiting, setAuthWaiting] = useState(!store?.user && SB.ok);
  const user = store?.user;

  useEffect(() => {
    if (user) { setAuthWaiting(false); return; }
    if (!SB.ok) { setAuthWaiting(false); return; }
    const t = setTimeout(() => setAuthWaiting(false), 2500);
    return () => clearTimeout(t);
  }, [user]);

  if (authWaiting) return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)" }}>
      <div style={{ textAlign: "center" }}>
        <div className="boot-mark" style={{ margin: "0 auto 18px" }} />
        <p style={{ color: "var(--ink-3)", fontWeight: 600 }}>Checking session…</p>
      </div>
    </div>
  );

  if (!user || !user.isAdmin) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)", paddingTop: 74 }}>
        <div style={{ textAlign: "center", padding: "48px 32px", maxWidth: 420 }}>
          <span style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--coral-soft)", display: "grid", placeItems: "center", margin: "0 auto 24px", color: "var(--coral-deep)" }}><Icon name="shield" size={34} /></span>
          <h2 style={{ marginBottom: 12 }}>Admin access required</h2>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 28 }}>{user ? "Your account does not have admin privileges." : "Please sign in with an admin account."}</p>
          <div className="row gap-3" style={{ justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={() => go({ view: "account" })}>{user ? "My account" : "Sign in"}</button>
            <button className="btn btn-ghost" onClick={() => go({ view: "home" })}>Back to site</button>
          </div>
        </div>
      </div>
    );
  }

  const sideLinks = [
    { id: "dashboard", label: "Dashboard",  icon: "globe",    desc: "Overview & stats" },
    { id: "tours",     label: "Tours",       icon: "compass",  desc: "Manage listings" },
    { id: "inquiries", label: "Inquiries",   icon: "mail",     desc: "Contact requests" },
    { id: "bookings",  label: "Bookings",    icon: "calendar", desc: "All bookings" },
    { id: "users",     label: "Users",       icon: "users",    desc: "Accounts & roles" },
    { id: "settings",  label: "Settings",    icon: "shield",   desc: "Site content" },
  ];

  const tabLabels = { dashboard: "Dashboard", tours: "Tour Management", inquiries: "Inquiries", bookings: "Bookings", users: "Users", settings: "Site Settings" };

  return (
    <div className="admin-shell" style={{ display: "flex", minHeight: "100vh", background: "var(--bg-2)" }}>
        {/* Sidebar */}
        <aside className="admin-side" style={{ width: 230, background: "var(--footer-bg)", color: "white", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid oklch(1 0 0 / 0.07)" }}>
            <Logo light onClick={() => go({ view: "home" })} />
            <div style={{ marginTop: 7, fontSize: "0.66rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(0.48 0.02 230)", fontWeight: 700 }}>Admin Panel</div>
          </div>
          <nav className="admin-nav" style={{ flex: 1, padding: "10px 10px", overflow: "auto" }}>
            {sideLinks.map(l => (
              <button key={l.id} onClick={() => setTab(l.id)} className="row gap-3" style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--r-sm)", marginBottom: 2, fontWeight: 600, fontSize: "0.88rem", textAlign: "left", color: tab === l.id ? "white" : "oklch(0.60 0.016 228)", background: tab === l.id ? "oklch(1 0 0 / 0.11)" : "transparent", transition: "all 0.18s", border: tab === l.id ? "1px solid oklch(1 0 0 / 0.09)" : "1px solid transparent" }}>
                <Icon name={l.icon} size={17} />
                <div>
                  <div style={{ lineHeight: 1.2 }}>{l.label}</div>
                  <div style={{ fontSize: "0.68rem", color: "oklch(0.48 0.016 228)", fontWeight: 400 }}>{l.desc}</div>
                </div>
              </button>
            ))}
          </nav>
          <div style={{ padding: "14px 16px 18px", borderTop: "1px solid oklch(1 0 0 / 0.07)" }}>
            <div style={{ fontSize: "0.8rem", color: "oklch(0.65 0.018 230)", marginBottom: 8, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name || user.email || "Admin"}</div>
            <div className="row gap-2">
              <button onClick={() => go({ view: "home" })} className="btn btn-sm" style={{ background: "oklch(1 0 0 / 0.07)", color: "oklch(0.65 0.018 230)", fontSize: "0.76rem", padding: "5px 10px" }}><Icon name="arrowL" size={13} /> Site</button>
              <button onClick={async () => { if (SB.ok) await SB.auth.signOut(); Store.signOut(); go({ view: "home" }); }} className="btn btn-sm" style={{ background: "oklch(1 0 0 / 0.07)", color: "var(--coral)", fontSize: "0.76rem", padding: "5px 10px" }}>Sign out</button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "18px 28px", borderBottom: "1px solid var(--hairline)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 800 }}>{tabLabels[tab]}</h1>
            {!SB.ok && <span style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--coral-soft)", color: "var(--coral-deep)", padding: "6px 14px", borderRadius: "var(--r-pill)", fontSize: "0.8rem", fontWeight: 700 }}><Icon name="shield" size={14} /> Supabase not configured</span>}
          </div>
          <div style={{ padding: "28px 28px 80px", flex: 1 }}>
            {tab === "dashboard" && <AdminDashboard setTab={setTab} />}
            {tab === "tours"     && <AdminTours />}
            {tab === "inquiries" && <AdminInquiries />}
            {tab === "bookings"  && <AdminBookings />}
            {tab === "users"     && <AdminUsers />}
            {tab === "settings"  && <AdminSettings />}
          </div>
        </main>
      </div>
  );
}

Object.assign(window, { AdminPage });
