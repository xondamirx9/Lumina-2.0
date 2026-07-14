/* =========================================================
   Oscar Travel — Tour listing + search & filters
   ========================================================= */

function ListingPage({ go, route }) {
  const [q, setQ] = useState(route.q || "");
  const [cat, setCat] = useState(route.cat || "all");
  const [sort, setSort] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(7000);
  const [durations, setDurations] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [loading] = useState(false);
  const [contact, setContact] = useState({});
  const [allTours, setAllTours] = useState(TOURS);
  const ref = useReveal();
  const { t } = useI18n();

  useEffect(() => { setQ(route.q || ""); setCat(route.cat || "all"); }, [route.q, route.cat]);

  useEffect(() => {
    if (typeof SB !== "undefined" && SB.ok) {
      SB.tours.list().then((rows) => {
        if (rows && rows.length) setAllTours(mergeTours(rows));
      }).catch(() => {});
      SB.settings.load().then(all => setContact(all || {}));
    }
  }, []);

  const openContact = () => {
    if (contact.whatsapp) {
      window.open("https://wa.me/" + contact.whatsapp.replace(/\D/g, ""), "_blank");
    } else if (contact.contact_email) {
      window.open("mailto:" + contact.contact_email, "_blank");
    } else {
      window.open("mailto:hello@luminavoyages.com", "_blank");
    }
  };

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = allTours.filter((tr) => {
    const cats = tr.categories || (tr.category ? [tr.category] : []);
    if (cat !== "all" && !cats.includes(cat)) return false;
    if (q) {
      const tags = Array.isArray(tr.tags) ? tr.tags : (Array.isArray(tr.tags_json) ? tr.tags_json : []);
      const hay = (tr.title + " " + (tr.place || "") + " " + (tr.region || "") + " " + tags.join(" ")).toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    if (maxPrice < 7000 && tourPrice(tr) > maxPrice) return false;
    if (durations.length) { const band = tr.days <= 6 ? "short" : tr.days <= 8 ? "mid" : "long"; if (!durations.includes(band)) return false; }
    if (difficulties.length && !difficulties.includes(tr.difficulty)) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "price-lo") return tourPrice(a) - tourPrice(b);
    if (sort === "price-hi") return tourPrice(b) - tourPrice(a);
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "duration") return a.days - b.days;
    return b.reviews - a.reviews;
  });

  const activeFilters = (cat !== "all" ? 1 : 0) + durations.length + difficulties.length + (maxPrice < 7000 ? 1 : 0);
  const clearAll = () => { setCat("all"); setDurations([]); setDifficulties([]); setMaxPrice(7000); setQ(""); };

  return (
    <div ref={ref} style={{ paddingTop: 74 }}>
      <div style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--hairline)", paddingTop: 30 }}>
        <div className="wrap" style={{ paddingBottom: 26 }}>
          <div className="row gap-2" style={{ color: "var(--ink-3)", fontSize: "0.85rem", fontWeight: 600, marginBottom: 14 }}>
            <a href="#/" onClick={(e) => { e.preventDefault(); go({ view: "home" }); }} style={{ color: "var(--ocean)" }}>{t("detail_home")}</a>
            <Icon name="chevR" size={14} /> <span>{t("nav_journeys")}</span>
          </div>
          <h1 className="display" style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}>
            {cat === "all" ? t("listing_all") : t("cat_" + cat)}
          </h1>
          <div className="row" style={{ gap: 14, marginTop: 22, flexWrap: "wrap" }}>
            <label className="row gap-3" style={{ flex: "1 1 320px", background: "var(--surface)", borderRadius: "var(--r-pill)", padding: "12px 20px", boxShadow: "var(--sh-sm)" }}>
              <Icon name="search" size={20} style={{ color: "var(--ocean)" }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("listing_search_ph")}
                style={{ border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "0.98rem", fontWeight: 500, width: "100%", color: "var(--ink)" }} />
              {q && <button onClick={() => setQ("")} style={{ color: "var(--ink-3)", display: "grid" }}><Icon name="x" size={18} /></button>}
            </label>
          </div>
          <div className="row" style={{ gap: 9, marginTop: 14, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={"chip" + (cat === c.id ? " active" : "")} onClick={() => setCat(c.id)}>
                <Icon name={c.icon} size={15} /> {t("cat_" + c.id)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap listing-body" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 36, padding: "34px 28px 80px", alignItems: "start" }}>
        <aside className="filters-side" style={{ position: "sticky", top: 90 }}>
          <div className="card" style={{ padding: "22px", boxShadow: "var(--sh-sm)" }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
              <span className="row gap-2" style={{ fontWeight: 800, fontSize: "1.05rem" }}><Icon name="filter" size={18} /> {t("listing_filters")}</span>
              {activeFilters > 0 && <button onClick={clearAll} style={{ color: "var(--coral-deep)", fontWeight: 700, fontSize: "0.82rem" }}>{t("listing_clear")}</button>}
            </div>
            <FilterGroup title={t("listing_max_price")}>
              <input type="range" min="2000" max="7000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} style={{ width: "100%", accentColor: "var(--ocean)" }} />
              <div className="row" style={{ justifyContent: "space-between", fontSize: "0.84rem", color: "var(--ink-2)", fontWeight: 600, marginTop: 4 }}>
                <span>$2,000</span><span style={{ color: "var(--ocean)", fontWeight: 800 }}>{maxPrice >= 7000 ? "$7,000+" : fmtPrice(maxPrice)}</span>
              </div>
            </FilterGroup>
            <FilterGroup title={t("listing_length")}>
              {[["short", t("listing_short")], ["mid", t("listing_mid")], ["long", t("listing_long")]].map(([v, l]) => (
                <CheckRow key={v} checked={durations.includes(v)} onChange={() => toggle(durations, setDurations, v)} label={l} />
              ))}
            </FilterGroup>
            <FilterGroup title={t("listing_activity")} last>
              {["Easy", "Moderate", "Challenging"].map((d) => (
                <CheckRow key={d} checked={difficulties.includes(d)} onChange={() => toggle(difficulties, setDifficulties, d)} label={d} />
              ))}
            </FilterGroup>
          </div>
          <div className="card" style={{ padding: 20, marginTop: 16, background: "linear-gradient(160deg, var(--ocean-tint), var(--teal-soft))", boxShadow: "none" }}>
            <Icon name="phone" size={22} style={{ color: "var(--ocean-deep)" }} />
            <h4 style={{ margin: "8px 0 6px", fontSize: "1rem" }}>{t("listing_help_h")}</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 14 }}>{t("listing_help_p")}</p>
            <button className="btn btn-ocean btn-sm btn-block" onClick={openContact}>
              {contact.whatsapp ? <><Icon name="phone" size={15} /> WhatsApp</> : t("listing_expert")}
            </button>
          </div>
        </aside>

        <div>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>
              {loading ? t("listing_searching") : <><strong style={{ color: "var(--ink)" }}>{filtered.length}</strong> {filtered.length === 1 ? t("listing_journey") : t("listing_journeys")}{q && <> {t("listing_for")} "{q}"</>}</>}
            </span>
            <label className="row gap-2">
              <span style={{ fontSize: "0.86rem", color: "var(--ink-3)", fontWeight: 600 }}>{t("listing_sort")}</span>
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: "auto", padding: "9px 36px 9px 14px", fontSize: "0.88rem", fontWeight: 700 }}>
                <option value="popular">{t("listing_sort_popular")}</option>
                <option value="rating">{t("listing_sort_rating")}</option>
                <option value="price-lo">{t("listing_sort_price_lo")}</option>
                <option value="price-hi">{t("listing_sort_price_hi")}</option>
                <option value="duration">{t("listing_sort_duration")}</option>
              </select>
            </label>
          </div>
          {loading ? (
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {[0,1,2,3].map((i) => (
                <div key={i} className="card" style={{ boxShadow: "var(--sh-sm)" }}>
                  <div className="skel" style={{ height: 220 }} />
                  <div style={{ padding: 20 }}>
                    <div className="skel" style={{ height: 20, width: "70%", borderRadius: 6, marginBottom: 12 }} />
                    <div className="skel" style={{ height: 14, width: "100%", borderRadius: 6, marginBottom: 8 }} />
                    <div className="skel" style={{ height: 14, width: "60%", borderRadius: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", background: "var(--surface)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-sm)" }}>
              <span style={{ width: 70, height: 70, borderRadius: "50%", background: "var(--ocean-tint)", color: "var(--ocean)", display: "grid", placeItems: "center", margin: "0 auto 18px" }}><Icon name="search" size={30} /></span>
              <h3 style={{ fontSize: "1.4rem", marginBottom: 8 }}>{t("listing_no_h")}</h3>
              <p style={{ color: "var(--ink-2)", marginBottom: 22 }}>{t("listing_no_p")}</p>
              <button className="btn btn-ocean" onClick={clearAll}>{t("listing_reset")}</button>
            </div>
          ) : (
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {filtered.map((tr, i) => <TourCard key={tr.id} tour={tr} onOpen={(id) => go({ view: "tour", id })} delay={(i % 2) * 0.06} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children, last }) {
  return (
    <div style={{ paddingBottom: last ? 0 : 18, marginBottom: last ? 0 : 18, borderBottom: last ? "none" : "1px solid var(--hairline)" }}>
      <h4 style={{ fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 13 }}>{title}</h4>
      <div className="col gap-2">{children}</div>
    </div>
  );
}

function CheckRow({ checked, onChange, label }) {
  return (
    <button className="row gap-3" onClick={onChange} style={{ textAlign: "left", padding: "3px 0" }}>
      <span style={{ width: 21, height: 21, borderRadius: 6, flexShrink: 0, display: "grid", placeItems: "center", background: checked ? "var(--ocean)" : "var(--surface)", boxShadow: checked ? "none" : "inset 0 0 0 1.5px var(--hairline-2)", color: "white", transition: "all 0.25s" }}>
        {checked && <Icon name="check" size={14} strokeWidth={3} />}
      </span>
      <span style={{ fontWeight: 600, fontSize: "0.92rem", color: checked ? "var(--ink)" : "var(--ink-2)" }}>{label}</span>
    </button>
  );
}

Object.assign(window, { ListingPage });
