/* =========================================================
   Lumina Voyages — Shared components & helpers
   ========================================================= */
const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

/* ---------- Icons (simple line set) ---------- */
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

/* ---------- Scenic placeholder (stands in for real photography) ---------- */
function Scenic({ theme, label, className = "", style, children, rounded }) {
  return (
    <div className={"ph th-" + theme + " " + className} data-label={label} style={{ borderRadius: rounded, ...style }}>
      <div className="ph-grain" />
      {children}
    </div>
  );
}

/* ---------- Star rating ---------- */
function Stars({ value, size = 15 }) {
  const full = Math.round(value);
  return (
    <span className="stars" aria-label={value + " out of 5"}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" size={size} fill={n <= full ? "current" : "none"}
          style={{ color: n <= full ? "var(--gold)" : "var(--hairline-2)" }} strokeWidth={1.6} />
      ))}
    </span>
  );
}

/* ---------- Reveal on scroll ---------- */
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

/* ---------- Toast ---------- */
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

/* ---------- Wishlist heart button ---------- */
function SaveButton({ tourId, big }) {
  const [saved, setSaved] = useState(Store.isSaved(tourId));
  const toast = useToast();
  const onClick = (e) => {
    e.stopPropagation(); e.preventDefault();
    const now = Store.toggleSaved(tourId);
    setSaved(now);
    toast(now ? "Saved to your trips" : "Removed from saved", now ? "heart" : "check");
  };
  return (
    <button className="save-btn" onClick={onClick} aria-label="Save trip"
      style={{
        width: big ? 46 : 38, height: big ? 46 : 38, borderRadius: "50%",
        display: "grid", placeItems: "center",
        background: "oklch(1 0 0 / 0.9)", backdropFilter: "blur(8px)",
        boxShadow: "var(--sh-sm)", color: saved ? "var(--coral)" : "var(--ink-2)",
        transition: "transform 0.4s var(--spring), color 0.3s",
        transform: saved ? "scale(1.04)" : "scale(1)",
      }}>
      <Icon name="heart" size={big ? 22 : 18} fill={saved ? "current" : "none"} strokeWidth={2} />
    </button>
  );
}

/* ---------- Tour card ---------- */
function TourCard({ tour, onOpen, delay = 0 }) {
  const [hover, setHover] = useState(false);
  return (
    <a href={"#/tour/" + tour.id} onClick={(e) => { e.preventDefault(); onOpen(tour.id); }}
      className="card reveal" style={{ transitionDelay: delay + "s", cursor: "pointer", display: "block" }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <Scenic theme={tour.theme} label={tour.place} style={{ height: 230, transition: "transform 0.7s var(--ease-out)", transform: hover ? "scale(1.06)" : "scale(1)" }} />
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8 }}>
          {tour.oldPrice && <span className="badge badge-coral">SAVE {fmtPrice(tour.oldPrice - tour.price)}</span>}
          {tour.popular && !tour.oldPrice && <span className="badge badge-glass">Popular</span>}
        </div>
        <div style={{ position: "absolute", top: 12, right: 12 }}><SaveButton tourId={tour.id} /></div>
      </div>
      <div style={{ padding: "18px 20px 20px" }}>
        <div className="row" style={{ justifyContent: "space-between", gap: 10 }}>
          <span className="row gap-2" style={{ color: "var(--ink-3)", fontSize: "0.82rem", fontWeight: 600 }}>
            <Icon name="pin" size={15} /> {tour.region}
          </span>
          <span className="row gap-2" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
            <Icon name="star" size={14} fill="current" style={{ color: "var(--gold)" }} /> {tour.rating}
            <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>({tour.reviews})</span>
          </span>
        </div>
        <h3 style={{ fontSize: "1.28rem", margin: "10px 0 8px", letterSpacing: "-0.02em" }}>{tour.title}</h3>
        <p style={{ color: "var(--ink-2)", fontSize: "0.92rem", lineHeight: 1.5, minHeight: 42 }}>{tour.blurb}</p>
        <div className="row gap-3" style={{ margin: "14px 0 16px", color: "var(--ink-2)", fontSize: "0.84rem", fontWeight: 600, flexWrap: "wrap" }}>
          <span className="row gap-2"><Icon name="clock" size={15} /> {tour.days} days</span>
          <span style={{ color: "var(--hairline-2)" }}>·</span>
          <span className="row gap-2"><Icon name="users" size={15} /> {tour.groupMax <= 2 ? "Private" : "Max " + tour.groupMax}</span>
          <span style={{ color: "var(--hairline-2)" }}>·</span>
          <span className="row gap-2"><Icon name="mountain" size={15} /> {tour.difficulty}</span>
        </div>
        <div className="hr" style={{ marginBottom: 14 }} />
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.78rem", color: "var(--ink-3)" }}>from</span>
            <div className="row gap-2" style={{ alignItems: "baseline" }}>
              <span style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{fmtPrice(tour.price)}</span>
              {tour.oldPrice && <span style={{ color: "var(--ink-3)", textDecoration: "line-through", fontSize: "0.9rem" }}>{fmtPrice(tour.oldPrice)}</span>}
              <span style={{ color: "var(--ink-3)", fontSize: "0.8rem" }}>/ person</span>
            </div>
          </div>
          <span className="btn btn-soft btn-sm" style={{ transition: "all 0.4s", background: hover ? "var(--ocean)" : "var(--ocean-tint)", color: hover ? "white" : "var(--ocean-deep)" }}>
            View <Icon name="arrow" size={16} />
          </span>
        </div>
      </div>
    </a>
  );
}

/* ---------- Brand mark ---------- */
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

/* ---------- Navigation ---------- */
function Nav({ go, route, savedCount, user }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const onHome = route.view === "home";
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const solid = scrolled || !onHome;
  const links = [
    { label: "Destinations", to: { view: "listing" } },
    { label: "Journeys", to: { view: "listing" } },
    { label: "About", to: { view: "home", hash: "why" } },
  ];
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "all 0.5s var(--ease)",
      background: solid ? "oklch(1 0 0 / 0.82)" : "transparent",
      backdropFilter: solid ? "blur(14px) saturate(1.4)" : "none",
      boxShadow: solid ? "0 1px 0 var(--hairline)" : "none",
    }}>
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
          <button className="row gap-2" onClick={() => go({ view: "account", tab: "saved" })}
            style={{ position: "relative", color: solid ? "var(--ink-2)" : "white", fontWeight: 600, fontSize: "0.9rem", padding: "6px" }}>
            <Icon name="heart" size={20} fill={savedCount ? "current" : "none"} style={{ color: savedCount ? "var(--coral)" : "inherit" }} />
            {savedCount > 0 && <span style={{ position: "absolute", top: -2, right: -4, background: "var(--coral)", color: "white", fontSize: "0.62rem", fontWeight: 800, minWidth: 16, height: 16, borderRadius: 8, display: "grid", placeItems: "center", padding: "0 4px" }}>{savedCount}</span>}
          </button>
          <button className={"btn " + (solid ? "btn-ghost" : "")} onClick={() => go({ view: "account" })}
            style={!solid ? { background: "oklch(1 0 0 / 0.16)", color: "white", backdropFilter: "blur(8px)" } : {}}>
            <Icon name="user" size={18} /> {user ? user.name.split(" ")[0] : "Sign in"}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- Footer ---------- */
function Footer({ go }) {
  const cols = [
    { h: "Journeys", items: ["Luxury & private", "Adventure", "Guided group", "Cruises", "Cultural"] },
    { h: "Company", items: ["Our story", "Travel guides", "Sustainability", "Careers", "Press"] },
    { h: "Support", items: ["Help centre", "Booking terms", "Travel insurance", "Contact us", "FAQ"] },
  ];
  return (
    <footer style={{ background: "var(--ink)", color: "oklch(0.85 0.02 230)", marginTop: 0 }}>
      <div className="wrap" style={{ padding: "72px 28px 40px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 48 }}>
          <div>
            <div style={{ filter: "none" }}><Logo light onClick={() => go({ view: "home" })} /></div>
            <p style={{ marginTop: 18, maxWidth: 280, lineHeight: 1.6, color: "oklch(0.78 0.02 230)" }}>
              Curated journeys to the world's most beautiful places — designed by people who've been there.
            </p>
            <div className="row gap-3" style={{ marginTop: 22 }}>
              {["globe", "mail", "phone"].map((ic) => (
                <span key={ic} style={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", background: "oklch(1 0 0 / 0.07)", color: "white" }}><Icon name={ic} size={18} /></span>
              ))}
            </div>
          </div>
          {cols.map((c, i) => (
            <div key={i} className="col gap-3">
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
          <span>© 2026 Lumina Voyages. Crafted for the curious.</span>
          <div className="row gap-6">
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Icon, Scenic, Stars, useReveal, ToastProvider, useToast,
  SaveButton, TourCard, Logo, Nav, Footer,
});
