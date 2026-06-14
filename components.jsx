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
  menu:     "M3 12h18M3 6h18M3 18h18",
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
        <span style={{ position: "absolute", left: 12, bottom: 11, fontFamily: "ui-monospace,'SF Mono',Menlo,monospace", fontSize: 10, letterSpacing: "0.03em", color: "white", background: "oklch(0.2 0.03 235 / 0.55)", backdropFilter: "blur(3px)", padding: "3px 8px", borderRadius: 6, zIndex: 3, pointerEvents: "none" }}>{label}</span>
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
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
    const observe = () => {
      ref.current.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    };
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(ref.current, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
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
      style={{ width: big ? 46 : 38, height: big ? 46 : 38, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--surface)", backdropFilter: "blur(8px)", boxShadow: "var(--sh-sm)", color: saved ? "var(--coral)" : "var(--ink-2)", transition: "transform 0.4s var(--spring), color 0.3s", transform: saved ? "scale(1.04)" : "scale(1)" }}>
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
        <Scenic theme={tour.theme} imageUrl={tour.image_url || null} label={tour.place} style={{ height: 230, transition: "transform 0.7s var(--ease-out)", transform: hover ? "scale(1.06)" : "scale(1)" }} />
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8 }}>
          {(tour.oldPrice || tour.old_price) && <span className="badge badge-coral">{t("save_badge")} {fmtPrice((tour.oldPrice || tour.old_price) - tour.price)}</span>}
          {tour.is_hot && !(tour.oldPrice || tour.old_price) && <span className="badge badge-coral">Filling fast</span>}
          {tour.popular && !tour.is_hot && !(tour.oldPrice || tour.old_price) && <span className="badge badge-glass">{t("card_popular")}</span>}
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
          <span className="row gap-2"><Icon name="users" size={15} /> {(tour.groupMax || tour.group_max || 12) <= 2 ? t("card_private") : t("card_max") + " " + (tour.groupMax || tour.group_max || 12)}</span>
          <span style={{ color: "var(--hairline-2)" }}>·</span>
          <span className="row gap-2"><Icon name="mountain" size={15} /> {tour.difficulty}</span>
          {tour.departure_dates && tour.departure_dates.length > 0 && <>
            <span style={{ color: "var(--hairline-2)" }}>·</span>
            <span className="row gap-2" style={{ color: "var(--ocean-deep)" }}><Icon name="calendar" size={15} style={{ color: "var(--ocean)" }} /> {tour.departure_dates[0]}</span>
          </>}
        </div>
        <div className="hr" style={{ marginBottom: 14 }} />
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.78rem", color: "var(--ink-3)" }}>{t("card_from")}</span>
            <div className="row gap-2" style={{ alignItems: "baseline" }}>
              <span style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{fmtPrice(tour.price)}</span>
              {(tour.oldPrice || tour.old_price) && <span style={{ color: "var(--ink-3)", textDecoration: "line-through", fontSize: "0.9rem" }}>{fmtPrice(tour.oldPrice || tour.old_price)}</span>}
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

const LOGO_URL       = "https://ekudvabndtdxlgubymgg.supabase.co/storage/v1/object/public/tour-images/tours/ChatGPT%20Image%20Jun%207,%202026,%2002_45_02%20AM.png";
const LOGO_WHITE_URL = "https://ekudvabndtdxlgubymgg.supabase.co/storage/v1/object/public/tour-images/tours/LogoWhite.png";

function Logo({ light, onClick, size = 110 }) {
  const { theme } = useI18n();
  const isDark = theme === "dark";
  const src = (light || isDark) ? LOGO_WHITE_URL : LOGO_URL;
  return (
    <a href="#/" onClick={(e) => { e.preventDefault(); onClick && onClick(); }} style={{ alignItems: "center", textDecoration: "none", display: "inline-flex" }}>
      <img src={src} alt="Lumina Voyages" style={{ height: size, width: "auto", objectFit: "contain" }} />
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

function MobileNavDrawer({ go, links, user, savedCount, onClose }) {
  const { t } = useI18n();
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div className="mobile-nav-overlay" onClick={onClose} />
      <div className="mobile-nav-panel">
        <div style={{ padding: "22px 22px 16px", borderBottom: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo onClick={() => { go({ view: "home" }); onClose(); }} />
          <button onClick={onClose} aria-label="Close menu" style={{ color: "var(--ink-2)", padding: 6 }}><Icon name="x" size={22} /></button>
        </div>
        <nav style={{ padding: "18px 16px", flex: 1 }}>
          {links.map((l, i) => (
            <button key={i} onClick={() => { go(l.to); onClose(); }}
              style={{ display: "flex", width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: "var(--r-sm)", fontWeight: 700, fontSize: "1rem", color: "var(--ink)", marginBottom: 4, transition: "background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>{l.label}</button>
          ))}
          <div style={{ height: 1, background: "var(--hairline)", margin: "10px 0 14px" }} />
          <button onClick={() => { go({ view: "account", tab: "saved" }); onClose(); }}
            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: "var(--r-sm)", fontWeight: 700, fontSize: "1rem", color: "var(--ink)", transition: "background 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <Icon name="heart" size={20} style={{ color: savedCount ? "var(--coral)" : "var(--ink-3)" }} />
            Saved trips {savedCount > 0 && <span style={{ background: "var(--coral)", color: "white", fontSize: "0.72rem", fontWeight: 800, minWidth: 20, height: 20, borderRadius: 10, display: "grid", placeItems: "center", padding: "0 5px" }}>{savedCount}</span>}
          </button>
          <button onClick={() => { go({ view: "account" }); onClose(); }}
            className="btn btn-primary btn-block" style={{ marginTop: 18, fontSize: "1rem" }}>
            <Icon name="user" size={18} /> {user ? (user.name || user.email || "").split(" ")[0] || t("nav_sign_in") : t("nav_sign_in")}
          </button>
        </nav>
      </div>
    </div>
  );
}

function Nav({ go, route, savedCount, user }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const onHome = route.view === "home";
  const { t } = useI18n();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Close mobile nav when route changes
  useEffect(() => { setMobileOpen(false); }, [route.view, route.id]);
  const solid = scrolled || !onHome;
  const links = [
    { label: t("nav_journeys"), to: { view: "listing" } },
    { label: t("nav_about"), to: { view: "home", hash: "why" } },
  ];
  return (
    <>
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
              aria-label={"Saved trips" + (savedCount ? ": " + savedCount : "")}
              style={{ position: "relative", color: solid ? "var(--ink-2)" : "white", fontWeight: 600, fontSize: "0.9rem", padding: "6px" }}>
              <Icon name="heart" size={20} fill={savedCount ? "current" : "none"} style={{ color: savedCount ? "var(--coral)" : "inherit" }} />
              {savedCount > 0 && <span style={{ position: "absolute", top: -2, right: -4, background: "var(--coral)", color: "white", fontSize: "0.62rem", fontWeight: 800, minWidth: 16, height: 16, borderRadius: 8, display: "grid", placeItems: "center", padding: "0 4px" }} aria-hidden="true">{savedCount}</span>}
            </button>
            <button className={"btn desk-nav " + (solid ? "btn-ghost" : "")} onClick={() => go({ view: "account" })}
              style={!solid ? { background: "oklch(1 0 0 / 0.16)", color: "white", backdropFilter: "blur(8px)" } : {}}>
              <Icon name="user" size={18} /> {user ? (user.name || user.email || "").split(" ")[0] || t("nav_sign_in") : t("nav_sign_in")}
            </button>
            {/* Hamburger — mobile only */}
            <button className="hamburger-btn" aria-label="Open menu" aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              style={{ color: solid ? "var(--ink-2)" : "white", background: solid ? "var(--surface-2)" : "oklch(1 0 0 / 0.14)", backdropFilter: "blur(8px)" }}>
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>
      </header>
      {mobileOpen && <MobileNavDrawer go={go} links={links} user={user} savedCount={savedCount} onClose={() => setMobileOpen(false)} />}
    </>
  );
}

function Footer({ go }) {
  const { t } = useI18n();
  const [cfg, setCfg] = useState({});

  useEffect(() => {
    if (typeof SB !== "undefined" && SB.ok) {
      SB.settings.getAll().then(all => setCfg(all || {})).catch(() => {});
    }
  }, []);

  const col2Items = cfg.footer_col2 ? cfg.footer_col2.split("\n").filter(Boolean) : ["Our story", "Travel guides", "Sustainability", "Careers", "Press"];
  const col3Items = cfg.footer_col3 ? cfg.footer_col3.split("\n").filter(Boolean) : ["Help centre", "Booking terms", "Travel insurance", "Contact us", "FAQ"];

  const cols = [
    { h: t("footer_journeys"), key: "f_j", items: [t("cat_luxury"), t("cat_adventure"), t("cat_group"), t("cat_cruise"), t("cat_cultural")] },
    { h: cfg.footer_col2_h || t("footer_company"), key: "f_c", items: col2Items },
    { h: cfg.footer_col3_h || t("footer_support"), key: "f_s", items: col3Items },
  ];

  return (
    <footer style={{ background: "var(--footer-bg)", color: "oklch(0.72 0.018 230)", marginTop: 0, borderTop: "1px solid oklch(1 0 0 / 0.06)" }}>
      <div className="wrap" style={{ padding: "72px 28px 40px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 48 }}>
          <div>
            <Logo light onClick={() => go({ view: "home" })} />
            <p style={{ marginTop: 18, maxWidth: 280, lineHeight: 1.6, color: "oklch(0.68 0.02 230)" }}>{cfg.footer_tagline || t("footer_tagline")}</p>
            <div className="row gap-3" style={{ marginTop: 22 }}>
              {[
                { ic: "globe",  href: cfg.instagram ? "https://instagram.com/" + cfg.instagram.replace("@","") : "#" },
                { ic: "mail",   href: cfg.contact_email ? "mailto:" + cfg.contact_email : "#" },
                { ic: "phone",  href: cfg.whatsapp ? "https://wa.me/" + cfg.whatsapp.replace(/\D/g,"") : "#" },
              ].map(({ ic, href }) => (
                <a key={ic} href={href} target="_blank" rel="noopener" style={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", background: "oklch(1 0 0 / 0.07)", color: "white" }}><Icon name={ic} size={18} /></a>
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
          <span>{cfg.footer_copy || t("footer_copy")}</span>
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

/* ---- Error Boundary ---- */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("Lumina error:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "60px 28px", textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
          <span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--coral-soft)", color: "var(--coral-deep)", display: "grid", placeItems: "center", margin: "0 auto 20px" }}>
            <Icon name="x" size={28} />
          </span>
          <h2 style={{ marginBottom: 10 }}>Something went wrong</h2>
          <p style={{ color: "var(--ink-2)", marginBottom: 24, lineHeight: 1.6 }}>We hit an unexpected error. Please refresh the page to continue.</p>
          <button className="btn btn-primary" onClick={() => { this.setState({ error: null }); window.location.reload(); }}>
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ---- Skeleton loading components ---- */
function SkeletonCard() {
  return (
    <div className="card" style={{ boxShadow: "var(--sh-sm)" }}>
      <div className="skel" style={{ height: 220 }} />
      <div style={{ padding: "18px 20px 20px" }}>
        <div className="skel" style={{ height: 14, width: "55%", borderRadius: 6, marginBottom: 10 }} />
        <div className="skel" style={{ height: 22, width: "85%", borderRadius: 6, marginBottom: 10 }} />
        <div className="skel" style={{ height: 14, width: "100%", borderRadius: 6, marginBottom: 6 }} />
        <div className="skel" style={{ height: 14, width: "70%", borderRadius: 6, marginBottom: 18 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="skel" style={{ height: 28, width: 90, borderRadius: 6 }} />
          <div className="skel" style={{ height: 34, width: 80, borderRadius: 20 }} />
        </div>
      </div>
    </div>
  );
}

function SkeletonText({ width = "100%", height = 16, style }) {
  return <div className="skel" style={{ height, width, borderRadius: 6, ...style }} />;
}

function CustomTripModal({ onClose }) {
  const user = Store.get().user;
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", destination: "", dates: "", budget: "", group: "2", msg: "" });
  const [loading, setLoading] = useState(false);
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.destination.trim()) { toast("Please fill in name, email and destination", "x"); return; }
    setLoading(true);
    try {
      if (typeof SB !== "undefined" && SB.ok) {
        await SB.inquiries.create({ name: form.name.trim(), email: form.email.trim(), message: `Destination: ${form.destination}\nDates: ${form.dates || "Flexible"}\nBudget pp: ${form.budget || "Not specified"}\nGroup size: ${form.group}\n\n${form.msg}`.trim() });
      }
      toast("Request sent! We'll be in touch within 24 hours.", "checkC");
      onClose();
    } catch (e) {
      toast("Couldn't send — please try again", "x");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, background: "oklch(0 0 0 / 0.52)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 20 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="card anim-scale-in" style={{ width: "100%", maxWidth: 530, padding: 32, boxShadow: "var(--sh-xl)", maxHeight: "90vh", overflowY: "auto" }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <h2 style={{ fontSize: "1.7rem", marginBottom: 4 }}>Plan my trip</h2>
            <p style={{ color: "var(--ink-2)", fontSize: "0.92rem" }}>Tell us where you dream of going — we'll craft the perfect journey.</p>
          </div>
          <button onClick={onClose} style={{ color: "var(--ink-3)", flexShrink: 0 }}><Icon name="x" size={22} /></button>
        </div>
        <div className="col gap-3">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="field"><label>Your name</label><input className="input" value={form.name} onChange={f("name")} placeholder="Jordan Rivera" /></div>
            <div className="field"><label>Email</label><input className="input" type="email" value={form.email} onChange={f("email")} placeholder="you@email.com" /></div>
          </div>
          <div className="field"><label>Dream destination</label><input className="input" value={form.destination} onChange={f("destination")} placeholder="e.g. Japan, Patagonia, Morocco…" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="field"><label>Travel dates</label><input className="input" value={form.dates} onChange={f("dates")} placeholder="e.g. Oct 2026" /></div>
            <div className="field"><label>Group size</label>
              <select className="select" value={form.group} onChange={f("group")}>
                {["1", "2", "3–4", "5–8", "9+"].map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="field"><label>Budget (per person)</label>
            <select className="select" value={form.budget} onChange={f("budget")}>
              <option value="">Prefer not to say</option>
              {["Under $2,000", "$2,000–$4,000", "$4,000–$6,000", "$6,000–$10,000", "$10,000+"].map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="field"><label>Anything else? (optional)</label>
            <textarea className="input" rows="3" value={form.msg} onChange={f("msg")} placeholder="Special interests, accessibility needs, celebration…" style={{ resize: "vertical" }} />
          </div>
          <button className="btn btn-ocean btn-lg" onClick={submit} disabled={loading} style={{ width: "100%" }}>
            {loading ? <><Icon name="clock" size={17} /> Sending…</> : <><Icon name="compass" size={17} /> Send my request</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function FloatContact() {
  const [cfg, setCfg] = useState({});
  const [showTrip, setShowTrip] = useState(false);

  useEffect(() => {
    if (typeof SB !== "undefined" && SB.ok) {
      SB.settings.getAll().then((all) => setCfg(all || {})).catch(() => {});
    }
  }, []);

  const waUrl = cfg.whatsapp ? "https://wa.me/" + cfg.whatsapp.replace(/\D/g, "") : null;
  const mailUrl = cfg.contact_email ? "mailto:" + cfg.contact_email : "mailto:hello@luminavoyages.com";

  return (
    <>
      <div style={{ position: "fixed", bottom: 28, right: 24, zIndex: 200, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
        <button onClick={() => setShowTrip(true)}
          style={{ background: "var(--ocean)", color: "white", borderRadius: "var(--r-pill)", padding: "13px 22px", display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: "0.9rem", boxShadow: "var(--sh-lg)", transition: "transform 0.25s, box-shadow 0.25s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--sh-xl)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--sh-lg)"; }}>
          <Icon name="compass" size={18} /> Plan my trip
        </button>
        <a href={waUrl || mailUrl} target="_blank" rel="noopener"
          title={waUrl ? "Chat on WhatsApp" : "Email us"}
          style={{ width: 56, height: 56, borderRadius: "50%", background: waUrl ? "#25D366" : "var(--ocean)", color: "white", display: "grid", placeItems: "center", boxShadow: "var(--sh-lg)", transition: "transform 0.25s, box-shadow 0.25s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.07)"; e.currentTarget.style.boxShadow = "var(--sh-xl)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--sh-lg)"; }}>
          <Icon name={waUrl ? "phone" : "mail"} size={24} />
        </a>
      </div>
      {showTrip && <CustomTripModal onClose={() => setShowTrip(false)} />}
    </>
  );
}

Object.assign(window, { Icon, Scenic, Stars, useReveal, ToastProvider, useToast, SaveButton, TourCard, Logo, Nav, Footer, ErrorBoundary, SkeletonCard, SkeletonText, FloatContact, CustomTripModal });
