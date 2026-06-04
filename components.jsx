/* =========================================================
   Lumina Voyages — Shared components & helpers
   ========================================================= */
const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

const I = {
  search:   "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
  heart:    "M12 21s-7.5-4.6-10-9.5C.4 8.3 2 5 5.2 5c2 0 3.2 1.1 3.8 2.3C9.6 6.1 10.8 5 12.8 5 16 5 17.6 8.3 16 11.5 13.5 16.4 12 21 12 21z",
  star:     "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z",
  map:      "M9 3L3 5v16l6-2 6 2 6-2V3l-6 2-6-2zM9 3v16M15 5v16",
  pin:      "M12 21s7-5.7 7-11a7 7 0 10-14 0c0 5.3 7 11 7 11zM12 13a3 3 0 100-6 3 3 0 000 6z",
  calendar: "M7 3v3M17 3v3M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z",
  clock:    "M12 22a10 10 0 100-20 10 10 0 000 20zM12 7v5l3 2",
  users:    "M16 19v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM22 19v-2a4 4 0 00-3-3.9M16 2.1a4 4 0 010 7.8",
  user:     "M20 21v-2a5 5 0 00-5-5H9a5 5 0 00-5 5v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  arrow:    "M5 12h14M13 6l6 6-6 6",
  arrowL:   "M19 12H5M11 18l-6-6 6-6",
  chevD:    "M6 9l6 6 6-6",
  chevR:    "M9 6l6 6-6 6",
  check:    "M20 6L9 17l-5-5",
  checkC:   "M12 22a10 10 0 100-20 10 10 0 000 20zM8 12l3 3 5-6",
  x:        "M18 6L6 18M6 6l12 12",
  plus:     "M12 5v14M5 12h14",
  minus:    "M5 12h14",
  globe:    "M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a15 15 0 010 20a15 15 0 010-20z",
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  sparkle:  "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  compass:  "M12 22a10 10 0 100-20 10 10 0 000 20zM16 8l-2 6-6 2 2-6 6-2z",
  mountain: "M3 20h18L14 7l-3.5 6-2-3z",
  diamond:  "M6 3h12l4 6-10 12L2 9z",
  building: "M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16M9 7h2M9 11h2M9 15h2M16 21v-9h4v9",
  ship:     "M3 14l1.5 6h15L21 14M3 14l9-3 9 3M12 11V4M9 6h6M5 14V9l7-2.5L19 9v5",
  landmark: "M3 21h18M4 10h16M5 21V10M19 21V10M9 21V10M15 21V10M12 3l7 4H5z",
  phone:    "M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.8 2z",
  mail:     "M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 7l-10 6L2 7",
  leaf:     "M11 20A7 7 0 014 13c0-6 7-10 16-10 0 9-4 16-9 17zM4 21c2-4 6-7 10-8",
  award:    "M12 15a6 6 0 100-12 6 6 0 000 12zM8.2 13.3L7 22l5-3 5 3-1.2-8.7",
  camera:   "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h3l2-3h8l2 3h3a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z",
  wifi:     "M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M12 19.5h.01",
  utensils: "M3 3v7a2 2 0 002 2h0V3M7 3v18M14 8a4 4 0 008 0c0-3-2-5-4-5s-4 2-4 5zM18 13v8",
  bed:      "M2 18v-6a2 2 0 012-2h16a2 2 0 012 2v6M2 14h20M6 10V7a1 1 0 011-1h4a1 1 0 011 1v3",
  plane:    "M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z",
  filter:   "M3 5h18M6 12h12M10 19h4",
  lock:     "M5 11h14a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1zM8 11V7a4 4 0 018 0v4",
  tag:      "M20.6 13.4L13 21l-9-9V4h8l8.6 8.6a1.4 1.4 0 010 2zM7.5 7.5h.01",
  trash:    "M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
  quote:    "M7 7H4a1 1 0 00-1 1v4a1 1 0 001 1h2v3a1 1 0 001 1 1 1 0 001-1V8a1 1 0 00-1-1zm10 0h-3a1 1 0 00-1 1v4a1 1 0 001 1h2v3a1 1 0 002 0V8a1 1 0 00-1-1z",
  sun:      "M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z",
  moon:     "M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z",
};

function Icon({ name, size = 20, fill = "none", style, strokeWidth = 1.9, className }) {
  const d = I[name] || "";
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24"
      fill={fill === "current" ? "currentColor" : "none"}
      stroke={fill === "current" ? "none" : "currentColor"}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {d.split("M").filter(Boolean).map((seg, i) => <path key={i} d={"M" + seg} />)}
    </svg>
  );
}

const PHOTOS = {
  santorini: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=80",
  maldives:  "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80",
  kyoto:     "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=80",
  patagonia: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1400&q=80",
  amalfi:    "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?auto=format&fit=crop&w=1400&q=80",
  marrakech: "https://images.unsplash.com/photo-1597212720283-6a3e99b6c02f?auto=format&fit=crop&w=1400&q=80",
  iceland:   "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=1400&q=80",
  safari:    "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1400&q=80",
  norway:    "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1400&q=80",
  bali:      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80",
  peru:      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1400&q=80",
  dubai:     "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
  ocean:     "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1400&q=80",
  sunset:    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
};

function Scenic({ theme, imageUrl, label, className = "", style, children, rounded }) {
  const src = imageUrl || PHOTOS[theme] || PHOTOS.ocean;
  return (
    <div className={"scenic-wrap " + className} data-label={label}
      style={{ position: "relative", overflow: "hidden", borderRadius: rounded, ...style }}>
      <img src={src} alt={label || theme} loading="lazy" className="ph-img"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      {label && (
        <span style={{ position: "absolute", left: 12, bottom: 11, fontFamily: "ui-monospace,'SF Mono',Menlo,monospace", fontSize: 10, letterSpacing: "0.03em", color: "oklch(1 0 0 / 0.92)", background: "oklch(0.2 0.03 235 / 0.42)", backdropFilter: "blur(3px)", padding: "3px 8px", borderRadius: 6, zIndex: 3, pointerEvents: "none" }}>{label}</span>
      )}
      {children}
    </div>
  );
}

function Stars({ value, size = 15 }) {
  const full = Math.round(value);
  return (
    <span className="stars" aria-label={value + " out of 5"}>
      {[1,2,3,4,5].map((n) => (
        <Icon key={n} name="star" size={size} fill={n <= full ? "current" : "none"}
          style={{ color: n <= full ? "var(--gold)" : "var(--hairline-2)" }} strokeWidth={1.6} />
      ))}
    </span>
  );
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current ? ref.current.querySelectorAll(".reveal") : [];
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return ref;
}

const ToastCtx = createContext(() => {});
function useToast() { return useContext(ToastCtx); }
function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null);
  const [show, setShow] = useState(false);
  const timer = useRef(null);
  const fire = useCallback((m, icon = "check") => {
    setMsg({ m, icon }); setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2600);
  }, []);
  return (
    <ToastCtx.Provider value={fire}>
      {children}
      <div className={"toast" + (show ? " show" : "")}>
        {msg && <><Icon name={msg.icon} size={18} /> {msg.m}</>}
      </div>
    </ToastCtx.Provider>
  );
}

function SaveButton({ tourId, big }) {
  const [saved, setSaved] = useState(Store.isSaved(tourId));
  const toast = useToast();
  const { t } = useI18n();
  const onClick = (e) => {
    e.stopPropagation(); e.preventDefault();
    const now = Store.toggleSaved(tourId);
    setSaved(now);
    toast(now ? t("save_msg") : t("unsave_msg"), now ? "heart" : "check");
  };
  return (
    <button className="save-btn" onClick={onClick} aria-label="Save trip"
      style={{ width: big ? 46 : 38, height: big ? 46 : 38, borderRadius: "50%", display: "grid", placeItems: "center", background: "oklch(1 0 0 / 0.9)", backdropFilter: "blur(8px)", boxShadow: "var(--sh-sm)", color: saved ? "var(--coral)" : "var(--ink-2)", transition: "transform 0.4s var(--spring), color 0.3s", transform: saved ? "scale(1.04)" : "scale(1)" }}>
      <Icon name="heart" size={big ? 22 : 18} fill={saved ? "current" : "none"} strokeWidth={2} />
    </button>
  );
}

function TourCard({ tour, onOpen, delay = 0 }) {
  const [hover, setHover] = useState(false);
  const { t } = useI18n();
  return (
    <a href={"#/tour/" + tour.id} onClick={(e) => { e.preventDefault(); onOpen(tour.id); }}
      className="card reveal" style={{ transitionDelay: delay + "s", cursor: "pointer", display: "block" }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <Scenic theme={tour.theme} label={tour.place} style={{ height: 230, transition: "transform 0.7s var(--ease-out)", transform: hover ? "scale(1.06)" : "scale(1)" }} />
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8 }}>
          {tour.oldPrice && <span className="badge badge-coral">{t("save_badge")} {fmtPrice(tour.oldPrice - tour.price)}</span>}
          {tour.popular && !tour.oldPrice && <span className="badge badge-glass">{t("card_popular")}</span>}
        </div>
        <div style={{ position: "absolute", top: 12, right: 12 }}><SaveButton tourId={tour.id} /></div>
      </div>
      <div style={{ padding: "18px 20px 20px" }}>
        <div className="row" style={{ justifyContent: "space-between", gap: 10 }}>
          <span className="row gap-2" style={{ color: "var(--ink-3)", fontSize: "0.82rem", fontWeight: 600 }}><Icon name="pin" size={15} /> {tour.region}</span>
          <span className="row gap-2" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
            <Icon name="star" size={14} fill="current" style={{ color: "var(--gold)" }} /> {tour.rating}
            <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>({tour.reviews})</span>
          </span>
        </div>
        <h3 style={{ fontSize: "1.28rem", margin: "10px 0 8px", letterSpacing: "-0.02em" }}>{tour.title}</h3>
        <p style={{ color: "var(--ink-2)", fontSize: "0.92rem", lineHeight: 1.5, minHeight: 42 }}>{tour.blurb}</p>
        <div className="row gap-3" style={{ margin: "14px 0 16px", color: "var(--ink-2)", fontSize: "0.84rem", fontWeight: 600, flexWrap: "wrap" }}>
          <span className="row gap-2"><Icon name="clock" size={15} /> {tour.days} {t("card_days")}</span>
          <span style={{ color: "var(--hairline-2)" }}>·</span>
          <span className="row gap-2"><Icon name="users" size={15} /> {tour.groupMax <= 2 ? t("card_private") : t("card_max") + " " + tour.groupMax}</span>
          <span style={{ color: "var(--hairline-2)" }}>·</span>
          <span className="row gap-2"><Icon name="mountain" size={15} /> {tour.difficulty}</span>
        </div>
        <div className="hr" style={{ marginBottom: 14 }} />
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.78rem", color: "var(--ink-3)" }}>{t("card_from")}</span>
            <div className="row gap-2" style={{ alignItems: "baseline" }}>
              <span style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{fmtPrice(tour.price)}</span>
              {tour.oldPrice && <span style={{ color: "var(--ink-3)", textDecoration: "line-through", fontSize: "0.9rem" }}>{fmtPrice(tour.oldPrice)}</span>}
              <span style={{ color: "var(--ink-3)", fontSize: "0.8rem" }}>{t("card_person")}</span>
            </div>
          </div>
          <span className="btn btn-soft btn-sm" style={{ transition: "all 0.4s", background: hover ? "var(--ocean)" : "var(--ocean-tint)", color: hover ? "white" : "var(--ocean-deep)" }}>
            {t("card_view")} <Icon name="arrow" size={16} />
          </span>
        </div>
      </div>
    </a>
  );
}

function Logo({ light, onClick }) {
  return (
    <a href="#/" onClick={(e) => { e.preventDefault(); onClick && onClick(); }} className="row gap-3" style={{ alignItems: "center" }}>
      <span style={{ position: "relative", width: 34, height: 34, display: "grid", placeItems: "center" }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(135deg, var(--ocean-bright), var(--teal))" }} />
        <span style={{ position: "absolute", width: 11, height: 11, borderRadius: "50%", background: light ? "white" : "var(--bg)", top: 6, right: 6 }} />
        <Icon name="compass" size={19} style={{ position: "relative", color: "white" }} strokeWidth={2} />
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span className="display" style={{ fontSize: "1.5rem", color: light ? "white" : "var(--ink)" }}>Lumina</span>
        <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.34em", textTransform: "uppercase", color: light ? "oklch(1 0 0 / 0.7)" : "var(--ocean)", marginTop: 2 }}>Voyages</span>
      </span>
    </a>
  );
}

/* ---------- Language + Theme controls ---------- */
function LangThemeBar({ solid }) {
  const { lang, setLang, theme, setTheme, t } = useI18n();
  const isDark = theme === "dark";
  const col = solid ? "var(--ink-2)" : "oklch(1 0 0 / 0.88)";
  return (
    <div className="row gap-2">
      {/* theme toggle */}
      <button onClick={() => setTheme(isDark ? "light" : "dark")}
        title={isDark ? t("theme_light") : t("theme_dark")}
        style={{ width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", color: col, background: solid ? "var(--surface-2)" : "oklch(1 0 0 / 0.14)", backdropFilter: "blur(8px)", transition: "all 0.3s" }}>
        <Icon name={isDark ? "sun" : "moon"} size={17} />
      </button>
      {/* language selector */}
      <div style={{ position: "relative" }}>
        <select value={lang} onChange={(e) => setLang(e.target.value)}
          style={{ appearance: "none", border: "none", outline: "none", background: solid ? "var(--surface-2)" : "oklch(1 0 0 / 0.14)", backdropFilter: "blur(8px)", color: col, fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.82rem", padding: "7px 26px 7px 10px", borderRadius: "var(--r-pill)", cursor: "pointer", transition: "all 0.3s", letterSpacing: "0.04em" }}>
          <option value="en">EN</option>
          <option value="ru">RU</option>
          <option value="uz">UZ</option>
        </select>
        <Icon name="chevD" size={13} style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", color: col, pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function Nav({ go, route, savedCount, user }) {
  const [scrolled, setScrolled] = useState(false);
  const onHome = route.view === "home";
  const { t } = useI18n();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const solid = scrolled || !onHome;
  const links = [
    { label: t("nav_destinations"), to: { view: "listing" } },
    { label: t("nav_journeys"), to: { view: "listing" } },
    { label: t("nav_about"), to: { view: "home", hash: "why" } },
  ];
  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "all 0.5s var(--ease)", background: solid ? "var(--nav-bg)" : "transparent", backdropFilter: solid ? "blur(18px) saturate(1.5)" : "none", boxShadow: solid ? "0 1px 0 var(--hairline)" : "none" }}>
      <div className="wrap row" style={{ justifyContent: "space-between", height: 74 }}>
        <Logo light={!solid} onClick={() => go({ view: "home" })} />
        <nav className="row gap-8 desk-nav">
          {links.map((l, i) => (
            <a key={i} href="#" onClick={(e) => { e.preventDefault(); go(l.to); }}
              style={{ fontWeight: 600, fontSize: "0.94rem", color: solid ? "var(--ink-2)" : "oklch(1 0 0 / 0.92)", transition: "color 0.3s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = solid ? "var(--ocean)" : "white"}
              onMouseLeave={(e) => e.currentTarget.style.color = solid ? "var(--ink-2)" : "oklch(1 0 0 / 0.92)"}>{l.label}</a>
          ))}
        </nav>
        <div className="row gap-3">
          <LangThemeBar solid={solid} />
          <button className="row gap-2" onClick={() => go({ view: "account", tab: "saved" })}
            style={{ position: "relative", color: solid ? "var(--ink-2)" : "white", fontWeight: 600, fontSize: "0.9rem", padding: "6px" }}>
            <Icon name="heart" size={20} fill={savedCount ? "current" : "none"} style={{ color: savedCount ? "var(--coral)" : "inherit" }} />
            {savedCount > 0 && <span style={{ position: "absolute", top: -2, right: -4, background: "var(--coral)", color: "white", fontSize: "0.62rem", fontWeight: 800, minWidth: 16, height: 16, borderRadius: 8, display: "grid", placeItems: "center", padding: "0 4px" }}>{savedCount}</span>}
          </button>
          <button className={"btn " + (solid ? "btn-ghost" : "")} onClick={() => go({ view: "account" })}
            style={!solid ? { background: "oklch(1 0 0 / 0.16)", color: "white", backdropFilter: "blur(8px)" } : {}}>
            <Icon name="user" size={18} /> {user ? user.name.split(" ")[0] : t("nav_sign_in")}
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer({ go }) {
  const { t } = useI18n();
  const cols = [
    { h: t("footer_journeys"), key: "f_j", items: [t("cat_luxury"), t("cat_adventure"), t("cat_group"), t("cat_cruise"), t("cat_cultural")] },
    { h: t("footer_company") || "Company", key: "f_c", items: ["Our story", "Travel guides", "Sustainability", "Careers", "Press"] },
    { h: t("footer_support") || "Support", key: "f_s", items: ["Help centre", "Booking terms", "Travel insurance", "Contact us", "FAQ"] },
  ];
  return (
    <footer style={{ background: "var(--footer-bg)", color: "oklch(0.72 0.018 230)", marginTop: 0, borderTop: "1px solid oklch(1 0 0 / 0.06)" }}>
      <div className="wrap" style={{ padding: "72px 28px 40px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 48 }}>
          <div>
            <Logo light onClick={() => go({ view: "home" })} />
            <p style={{ marginTop: 18, maxWidth: 280, lineHeight: 1.6, color: "oklch(0.68 0.02 230)" }}>{t("footer_tagline")}</p>
            <div className="row gap-3" style={{ marginTop: 22 }}>
              {["globe", "mail", "phone"].map((ic) => (
                <span key={ic} style={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", background: "oklch(1 0 0 / 0.07)", color: "white" }}><Icon name={ic} size={18} /></span>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.key} className="col gap-3">
              <h4 style={{ fontSize: "0.78rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--teal)", marginBottom: 6 }}>{c.h}</h4>
              {c.items.map((it) => (
                <a key={it} href="#" onClick={(e) => { e.preventDefault(); go({ view: "listing" }); }}
                  style={{ color: "oklch(0.82 0.02 230)", fontSize: "0.92rem", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "white"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "oklch(0.82 0.02 230)"}>{it}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="hr" style={{ background: "oklch(1 0 0 / 0.1)", margin: "44px 0 24px" }} />
        <div className="row footer-bottom" style={{ justifyContent: "space-between", fontSize: "0.84rem", color: "oklch(0.7 0.02 230)" }}>
          <span>{t("footer_copy")}</span>
          <div className="row gap-6">
            <a href="#" onClick={(e) => e.preventDefault()}>{t("footer_privacy")}</a>
            <a href="#" onClick={(e) => e.preventDefault()}>{t("footer_terms")}</a>
            <a href="#" onClick={(e) => e.preventDefault()}>{t("footer_cookies")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Icon, Scenic, Stars, useReveal, ToastProvider, useToast, SaveButton, TourCard, Logo, Nav, Footer });
