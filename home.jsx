/* =========================================================
   Oscar Travel — Homepage
   ========================================================= */

/* Scroll progress bar */
function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setW(((el.scrollTop || document.body.scrollTop) / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="scroll-progress" style={{ width: w + "%" }} />;
}

/* Animated counter that counts up when it enters view */
function AnimatedCounter({ target, duration = 1400 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        /* Animate only the leading number; keep the rest verbatim so
           values like "24/7" don't get mangled into "247/" */
        const m = String(target).match(/^([\d.]+)([\s\S]*)$/);
        const isFloat = !!m && m[1].includes(".");
        const end = m ? parseFloat(m[1]) : 0;
        const suffix = m ? m[2] : String(target);
        const startTime = performance.now();
        const tick = (now) => {
          const t = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          const cur = isFloat ? (ease * end).toFixed(1) : Math.round(ease * end);
          setVal(cur + suffix);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target, duration]);
  return <span ref={ref} className="stat-number">{val || "0"}</span>;
}

/* Floating particles for hero */
const PARTICLES = [
  { w: 6, h: 6, top: "18%", left: "12%", dur: 7, delay: 0, op: 0.5 },
  { w: 4, h: 4, top: "35%", left: "88%", dur: 9, delay: 2, op: 0.4 },
  { w: 8, h: 8, top: "65%", left: "8%",  dur: 11, delay: 1, op: 0.3 },
  { w: 5, h: 5, top: "22%", left: "72%", dur: 8,  delay: 3, op: 0.45 },
  { w: 3, h: 3, top: "78%", left: "55%", dur: 6,  delay: 0.5, op: 0.35 },
  { w: 7, h: 7, top: "50%", left: "93%", dur: 10, delay: 4, op: 0.4 },
];

function HeroSearch({ go }) {
  const [where, setWhere] = useState("");
  const [cat, setCat] = useState("all");
  const [when, setWhen] = useState("anytime");
  const { t } = useI18n();
  const submit = () => go({ view: "listing", q: where, cat });
  const whenOpts = [["anytime","summer","autumn","winter","spring"].map(k => ({ k, label: t(k) }))][0];
  return (
    <div className="hero-search anim-fade-up" style={{ background: "var(--search-bg)", backdropFilter: "blur(20px)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-xl)", padding: 10, display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr auto", gap: 6, maxWidth: 880, margin: "0 auto", animationDelay: "0.3s" }}>
      <label className="hs-field" style={hsField}>
        <Icon name="pin" size={20} style={{ color: "var(--ocean)" }} />
        <span style={hsCol}>
          <span style={hsLabel}>{t("hero_where")}</span>
          <input value={where} onChange={(e) => setWhere(e.target.value)} placeholder={t("hero_search_ph")} style={hsInput} />
        </span>
      </label>
      <label className="hs-field" style={hsField}>
        <Icon name="compass" size={20} style={{ color: "var(--ocean)" }} />
        <span style={hsCol}>
          <span style={hsLabel}>{t("hero_journey_type")}</span>
          <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ ...hsInput, cursor: "pointer", appearance: "none" }}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{t("cat_" + c.id)}</option>)}
          </select>
        </span>
      </label>
      <label className="hs-field" style={{ ...hsField, borderRight: "none" }}>
        <Icon name="calendar" size={20} style={{ color: "var(--ocean)" }} />
        <span style={hsCol}>
          <span style={hsLabel}>{t("hero_when")}</span>
          <select value={when} onChange={(e) => setWhen(e.target.value)} style={{ ...hsInput, cursor: "pointer", appearance: "none" }}>
            {whenOpts.map(({ k, label }) => <option key={k} value={k}>{label}</option>)}
          </select>
        </span>
      </label>
      <button className="btn btn-primary btn-lg" onClick={submit} style={{ borderRadius: "var(--r-md)" }}>
        <Icon name="search" size={20} /> <span className="search-label">{t("hero_search")}</span>
      </button>
    </div>
  );
}
const hsField = { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRight: "1px solid var(--hairline)", borderRadius: "var(--r-md)" };
const hsCol = { display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 };
const hsLabel = { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" };
const hsInput = { border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "0.98rem", fontWeight: 600, color: "var(--ink)", width: "100%", padding: 0 };

function Hero({ go }) {
  const [p, setP] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const { t } = useI18n();
  const cfg = useSiteSettings();
  useEffect(() => {
    const onScroll = () => setP(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const stats = [
    { label: t("hero_reviews"), target: "4.9★", raw: "4.9★" },
    { label: t("hero_countries"), target: "60+", raw: "60+" },
    { label: t("hero_tailor"), target: "100%", raw: "100%" },
    { label: t("hero_support"), target: "24/7", raw: "24/7" },
  ];
  const heroImg = (cfg.hero_image_url || "").trim();
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", paddingTop: 90, backgroundColor: "oklch(0.14 0.012 70)" }}>
      {/* Background media + parallax — admin-set image overrides the video */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${p * 0.25}px) scale(1.05)`, zIndex: 0 }}>
        {heroImg
          ? <img src={heroImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 50%" }} />
          : /* No poster: it flashed an unrelated photo for the first seconds.
               The video fades in from the dark ocean background instead. */
            <video autoPlay muted loop playsInline
              onCanPlay={() => setVideoReady(true)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 50%", opacity: videoReady ? 1 : 0, transition: "opacity 1.1s var(--ease)" }}>
              <source src="https://ekudvabndtdxlgubymgg.supabase.co/storage/v1/object/public/tour-images/hero/loop_seamless.mp4" type="video/mp4" />
            </video>}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, oklch(0.15 0.05 235 / 0.75) 0%, oklch(0.18 0.05 235 / 0.5) 40%, oklch(0.1 0.03 235 / 0.15) 68%, var(--bg) 100%)" }} />
      </div>

      {/* Floating particles */}
      {PARTICLES.map((px, i) => (
        <div key={i} className="hero-particle" style={{
          width: px.w, height: px.h, top: px.top, left: px.left, opacity: px.op,
          background: i % 2 === 0 ? "var(--teal)" : "var(--coral)",
          animationDuration: px.dur + "s", animationDelay: px.delay + "s",
        }} />
      ))}

      {/* Content */}
      <div className="wrap" style={{ position: "relative", zIndex: 2, textAlign: "center", paddingBottom: 30 }}>
        <span className="anim-fade-up row gap-2 glass" style={{ display: "inline-flex", animationDelay: "0.05s", color: "white", padding: "8px 18px", borderRadius: "var(--r-pill)", fontSize: "0.82rem", fontWeight: 600, marginBottom: 26 }}>
          <Icon name="sparkle" size={16} /> {t("hero_badge")}
        </span>
        <h1 className="display anim-fade-up" style={{ fontSize: "clamp(3rem, 8vw, 6.6rem)", color: "white", animationDelay: "0.12s", textShadow: "0 2px 40px oklch(0.2 0.05 235 / 0.4)" }}>
          {(cfg.hero_heading || "").trim()
            ? cfg.hero_heading
            : <>{t("hero_h1a")}<br /><span className="serif-italic" style={{ color: "var(--sand)" }}>{t("hero_h1b")}</span></>}
        </h1>
        <p className="anim-fade-up" style={{ color: "oklch(1 0 0 / 0.94)", fontSize: "clamp(1.05rem, 2vw, 1.3rem)", maxWidth: 600, margin: "22px auto 40px", animationDelay: "0.2s", lineHeight: 1.5, textShadow: "0 1px 20px oklch(0.2 0.05 235 / 0.4)" }}>
          {(cfg.hero_sub || "").trim() || t("hero_sub")}
        </p>
        <HeroSearch go={go} />
        <button className="btn glass anim-fade-up quiz-cta" onClick={() => setShowQuiz(true)}
          style={{ marginTop: 20, color: "white", animationDelay: "0.38s", fontWeight: 700 }}>
          <Icon name="sparkle" size={17} /> {t("quiz_cta")}
        </button>

        {/* Animated stats */}
        <div className="anim-fade-up row" style={{ justifyContent: "center", gap: 40, marginTop: 44, animationDelay: "0.45s", flexWrap: "wrap" }}>
          {stats.map(({ label, raw }, i) => (
            <div key={i} className="stat-item" style={{ textAlign: "center", color: "white" }}>
              <div style={{ fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                <AnimatedCounter target={raw} />
              </div>
              <div style={{ fontSize: "0.82rem", color: "oklch(1 0 0 / 0.8)", fontWeight: 500, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint" style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 3, display: p > 80 ? "none" : "flex" }}>
        <div className="scroll-hint-line" />
        <span>scroll</span>
      </div>
      {showQuiz && <JourneyFinder go={go} onClose={() => setShowQuiz(false)} />}
    </section>
  );
}

function CategoryStrip({ go }) {
  const { t } = useI18n();
  const cats = CATEGORIES.filter((c) => c.id !== "all");
  return (
    <section className="wrap" style={{ padding: "70px 28px 20px" }}>
      <div className="cat-strip stagger" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
        {cats.map((c, i) => (
          <button key={c.id} className="reveal cat-card" onClick={() => go({ view: "listing", cat: c.id })}
            style={{ transitionDelay: i * 0.07 + "s", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "26px 12px", background: "var(--surface)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-sm)", transition: "transform 0.45s var(--spring), box-shadow 0.45s, background 0.3s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px) scale(1.03)"; e.currentTarget.style.boxShadow = "var(--sh-lg)"; e.currentTarget.style.background = "var(--ocean-tint)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--sh-sm)"; e.currentTarget.style.background = "var(--surface)"; }}>
            <span className="why-icon" style={{ width: 54, height: 54, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--ocean-tint)", color: "var(--ocean-deep)", transition: "transform 0.4s var(--spring), background 0.3s, box-shadow 0.4s" }}><Icon name={c.icon} size={24} /></span>
            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t("cat_" + c.id)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function FeaturedTours({ go }) {
  const { t } = useI18n();
  const [tours, setTours] = useState(() => TOURS.filter((tr) => tr.featured).slice(0, 6));

  useEffect(() => {
    if (typeof SB !== "undefined" && SB.ok) {
      SB.tours.list().then((rows) => {
        if (rows && rows.length) {
          setTours(mergeTours(rows).filter(t => t.featured).slice(0, 6));
        }
      }).catch(() => {});
    }
  }, []);

  return (
    <section className="wrap" style={{ padding: "60px 28px" }}>
      <div className="row reveal" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="eyebrow eyebrow-line">{t("featured_eyebrow")}</span>
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", marginTop: 12 }}>{t("featured_h2a")}<br /><span className="serif-italic" style={{ color: "var(--ocean)" }}>{t("featured_h2b")}</span></h2>
        </div>
        <button className="btn btn-ghost btn-shimmer" onClick={() => go({ view: "listing" })}>{t("featured_browse")} <Icon name="arrow" size={18} /></button>
      </div>
      {!tours ? (
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
          {[0,1,2].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
          {tours.map((tr, i) => <TourCard key={tr.id} tour={tr} onOpen={(id) => go({ view: "tour", id })} delay={(i % 3) * 0.08} />)}
        </div>
      )}
    </section>
  );
}

function DestinationShowcase({ go }) {
  const { t } = useI18n();
  const tiles = [
    { ...DESTINATIONS[0], span: "tall" }, { ...DESTINATIONS[3] }, { ...DESTINATIONS[1] },
    { ...DESTINATIONS[2] }, { ...DESTINATIONS[4] }, { ...DESTINATIONS[5], span: "wide" },
  ];
  return (
    <section style={{ background: "var(--bg-2)", padding: "90px 0" }}>
      <div className="wrap">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 46 }}>
          <span className="eyebrow">{t("dest_eyebrow")}</span>
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", marginTop: 12 }}>{t("dest_h2")}</h2>
        </div>
        <div className="dest-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "200px", gap: 16 }}>
          {tiles.map((d, i) => (
            <button key={d.name + i} className="reveal dest-tile" onClick={() => go({ view: "listing", q: d.name })}
              style={{ transitionDelay: (i * 0.08) + "s", position: "relative", borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--sh-md)", gridColumn: d.span === "wide" ? "span 2" : "span 1", gridRow: d.span === "tall" ? "span 2" : "span 1", cursor: "pointer" }}
              onMouseEnter={(e) => { const img = e.currentTarget.querySelector(".ph-img"); if (img) img.style.transform = "scale(1.1)"; }}
              onMouseLeave={(e) => { const img = e.currentTarget.querySelector(".ph-img"); if (img) img.style.transform = "scale(1)"; }}>
              <Scenic theme={d.theme} label={""} style={{ position: "absolute", inset: 0, transition: "transform 0.8s var(--ease-out)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, oklch(0.2 0.04 235 / 0.6) 100%)" }} />
              <div style={{ position: "absolute", left: 20, bottom: 18, textAlign: "left", color: "white" }}>
                <div className="display" style={{ fontSize: "1.9rem" }}>{d.name}</div>
                <div style={{ fontSize: "0.82rem", color: "oklch(1 0 0 / 0.85)", fontWeight: 600 }}>{d.count} {t("dest_journeys")}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyLumina() {
  const { t } = useI18n();
  const items = [
    { icon: "map",    h: t("why_i1h"), x: t("why_i1x") },
    { icon: "shield", h: t("why_i2h"), x: t("why_i2x") },
    { icon: "leaf",   h: t("why_i3h"), x: t("why_i3x") },
    { icon: "award",  h: t("why_i4h"), x: t("why_i4x") },
  ];
  return (
    <section id="why" className="wrap" style={{ padding: "90px 28px", scrollMarginTop: 80 }}>
      <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div className="reveal reveal-left">
          <span className="eyebrow eyebrow-line">{t("why_eyebrow")}</span>
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)", margin: "14px 0 20px" }}>{t("why_h2a")}<br /><span className="serif-italic" style={{ color: "var(--coral)" }}>{t("why_h2b")}</span></h2>
          <p style={{ color: "var(--ink-2)", fontSize: "1.08rem", lineHeight: 1.65, maxWidth: 460, marginBottom: 30 }}>{t("why_body")}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {items.map((it) => (
              <div key={it.h} className="row gap-3" style={{ alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: "var(--r-sm)", display: "grid", placeItems: "center", background: "var(--ocean-tint)", color: "var(--ocean-deep)" }}><Icon name={it.icon} size={22} /></span>
                <div><h4 style={{ fontSize: "1rem", marginBottom: 4 }}>{it.h}</h4><p style={{ fontSize: "0.88rem", color: "var(--ink-2)", lineHeight: 1.5 }}>{it.x}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal reveal-right reveal-d2" style={{ position: "relative", height: 540 }}>
          <Scenic theme="maldives" label="overwater villa · maldives" rounded="var(--r-lg)" style={{ position: "absolute", top: 0, right: 0, width: "78%", height: 340, boxShadow: "var(--sh-lg)" }} />
          <Scenic theme="kyoto" label="kyoto · temple dawn" rounded="var(--r-lg)" style={{ position: "absolute", bottom: 0, left: 0, width: "60%", height: 280, boxShadow: "var(--sh-xl)", border: "6px solid var(--bg)" }} />
          <div style={{ position: "absolute", bottom: 40, right: 10, background: "var(--surface)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-lg)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--coral-soft)", color: "var(--coral-deep)", display: "grid", placeItems: "center" }}><Icon name="award" size={24} /></span>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{t("why_award")}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>{t("why_award_years")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    { text: "The most thoughtfully designed trip we've ever taken. Every day felt like the highlight until the next one arrived.", name: "Elena & Marco", trip: "Cyclades by Private Sail", theme: "santorini" },
    { text: "I travelled solo and never once felt alone — the group and guides became friends for life.", name: "Tom H.", trip: "Patagonia: Towers of Paine", theme: "patagonia" },
    { text: "From the seaplane to the sandbank dinner, it was flawless. Worth every moment of the planning conversations.", name: "Dr. Amara N.", trip: "Great Migration Safari", theme: "safari" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const tmr = setInterval(() => setI((x) => (x + 1) % quotes.length), 6000);
    return () => clearInterval(tmr);
  }, []);
  return (
    <section style={{ background: "linear-gradient(160deg, var(--ocean-deep), var(--ocean))", padding: "100px 0", color: "white", position: "relative", overflow: "hidden" }}>
      <div className="blob" style={{ width: 380, height: 380, background: "var(--teal)", top: -100, right: -60 }} />
      <div className="blob" style={{ width: 320, height: 320, background: "var(--coral)", bottom: -120, left: -40, opacity: 0.3 }} />
      <div className="wrap" style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 860 }}>
        <Icon name="quote" size={48} fill="current" style={{ color: "oklch(1 0 0 / 0.3)", margin: "0 auto 10px" }} />
        <div style={{ minHeight: 200 }}>
          {quotes.map((q, qi) => (
            <div key={qi} style={{ display: qi === i ? "block" : "none", animation: "fadeUp 0.7s var(--ease-out)" }}>
              <p className="display" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.7rem)", lineHeight: 1.25, fontStyle: "italic" }}>"{q.text}"</p>
              <div className="row" style={{ justifyContent: "center", gap: 14, marginTop: 30 }}>
                <Scenic theme={q.theme} label="" style={{ width: 52, height: 52, borderRadius: "50%" }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{q.name}</div>
                  <div style={{ fontSize: "0.85rem", color: "oklch(1 0 0 / 0.75)" }}>{q.trip}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row" style={{ justifyContent: "center", gap: 9, marginTop: 30 }}>
          {quotes.map((_, qi) => (
            <button key={qi} onClick={() => setI(qi)} style={{ width: qi === i ? 28 : 9, height: 9, borderRadius: 9, background: qi === i ? "white" : "oklch(1 0 0 / 0.4)", transition: "all 0.4s var(--ease)" }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABand({ go }) {
  const { t } = useI18n();
  return (
    <section className="wrap" style={{ padding: "90px 28px" }}>
      <div className="reveal reveal-scale" style={{ position: "relative", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--sh-xl)" }}>
        <Scenic theme="amalfi" label="amalfi coast" style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, oklch(0.25 0.05 235 / 0.85) 0%, oklch(0.3 0.06 235 / 0.4) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "clamp(40px, 6vw, 80px)", maxWidth: 620, color: "white" }}>
          <span className="eyebrow" style={{ color: "var(--sand)" }}>{t("cta_eyebrow")}</span>
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", margin: "12px 0 16px" }}>{t("cta_h2")}</h2>
          <p style={{ fontSize: "1.1rem", color: "oklch(1 0 0 / 0.9)", lineHeight: 1.6, marginBottom: 32 }}>{t("cta_body")}</p>
          <div className="row gap-3" style={{ flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg btn-shimmer" onClick={() => go({ view: "listing" })}>{t("cta_explore")} <Icon name="arrow" size={20} /></button>
            <button className="btn btn-lg" onClick={() => go({ view: "listing" })} style={{ background: "oklch(1 0 0 / 0.16)", color: "white", backdropFilter: "blur(8px)" }}><Icon name="phone" size={18} /> {t("cta_talk")}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage({ go }) {
  const ref = useReveal();
  return (
    <div ref={ref}>
      <ScrollProgress />
      <Hero go={go} />
      <CategoryStrip go={go} />
      <FeaturedTours go={go} />
      <DestinationShowcase go={go} />
      <WhyLumina />
      <Testimonials />
      <CTABand go={go} />
    </div>
  );
}

Object.assign(window, { HomePage });
