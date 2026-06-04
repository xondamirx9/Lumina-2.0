/* =========================================================
   Lumina Voyages — Homepage
   ========================================================= */

/* ---------- Hero search bar ---------- */
function HeroSearch({ go }) {
  const [where, setWhere] = useState("");
  const [cat, setCat] = useState("all");
  const [when, setWhen] = useState("Anytime");
  const submit = () => go({ view: "listing", q: where, cat });
  return (
    <div className="hero-search anim-fade-up" style={{
      background: "oklch(1 0 0 / 0.92)", backdropFilter: "blur(16px)",
      borderRadius: "var(--r-lg)", boxShadow: "var(--sh-xl)",
      padding: 10, display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr auto", gap: 6,
      maxWidth: 880, margin: "0 auto", animationDelay: "0.3s",
    }}>
      <label className="hs-field" style={hsField}>
        <Icon name="pin" size={20} style={{ color: "var(--ocean)" }} />
        <span style={hsCol}>
          <span style={hsLabel}>Where to</span>
          <input value={where} onChange={(e) => setWhere(e.target.value)} placeholder="Search destinations" style={hsInput} />
        </span>
      </label>
      <label className="hs-field" style={hsField}>
        <Icon name="compass" size={20} style={{ color: "var(--ocean)" }} />
        <span style={hsCol}>
          <span style={hsLabel}>Journey type</span>
          <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ ...hsInput, cursor: "pointer", appearance: "none" }}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </span>
      </label>
      <label className="hs-field" style={{ ...hsField, borderRight: "none" }}>
        <Icon name="calendar" size={20} style={{ color: "var(--ocean)" }} />
        <span style={hsCol}>
          <span style={hsLabel}>When</span>
          <select value={when} onChange={(e) => setWhen(e.target.value)} style={{ ...hsInput, cursor: "pointer", appearance: "none" }}>
            {["Anytime", "Summer 2026", "Autumn 2026", "Winter 2026", "Spring 2027"].map((w) => <option key={w}>{w}</option>)}
          </select>
        </span>
      </label>
      <button className="btn btn-primary btn-lg" onClick={submit} style={{ borderRadius: "var(--r-md)" }}>
        <Icon name="search" size={20} /> <span className="search-label">Search</span>
      </button>
    </div>
  );
}
const hsField = { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRight: "1px solid var(--hairline)", borderRadius: "var(--r-md)" };
const hsCol = { display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 };
const hsLabel = { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" };
const hsInput = { border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "0.98rem", fontWeight: 600, color: "var(--ink)", width: "100%", padding: 0 };

/* ---------- Hero ---------- */
function Hero({ go }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => setP(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", paddingTop: 90 }}>
      {/* layered scenic background */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${p * 0.25}px) scale(1.05)`, zIndex: 0 }}>
        <img src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80" alt="Santorini aegean coastline at golden hour" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, oklch(0.25 0.05 235 / 0.45) 0%, oklch(0.3 0.05 235 / 0.1) 40%, oklch(0.99 0.01 220 / 0.0) 70%, var(--bg) 100%)" }} />
      </div>

      <div className="wrap" style={{ position: "relative", zIndex: 2, textAlign: "center", paddingBottom: 30 }}>
        <span className="anim-fade-up row gap-2" style={{ display: "inline-flex", animationDelay: "0.05s", background: "oklch(1 0 0 / 0.16)", backdropFilter: "blur(8px)", color: "white", padding: "8px 16px", borderRadius: "var(--r-pill)", fontSize: "0.82rem", fontWeight: 600, marginBottom: 26 }}>
          <Icon name="sparkle" size={16} /> Handcrafted journeys to 60+ countries
        </span>
        <h1 className="display anim-fade-up" style={{ fontSize: "clamp(3rem, 8vw, 6.6rem)", color: "white", animationDelay: "0.12s", textShadow: "0 2px 40px oklch(0.2 0.05 235 / 0.4)" }}>
          Travel that feels<br /><span className="serif-italic" style={{ color: "var(--sand)" }}>extraordinary</span>
        </h1>
        <p className="anim-fade-up" style={{ color: "oklch(1 0 0 / 0.94)", fontSize: "clamp(1.05rem, 2vw, 1.3rem)", maxWidth: 600, margin: "22px auto 40px", animationDelay: "0.2s", lineHeight: 1.5, textShadow: "0 1px 20px oklch(0.2 0.05 235 / 0.4)" }}>
          From private sails through the Cyclades to the dunes of the Sahara — discover beautifully designed tours, then book in minutes.
        </p>
        <HeroSearch go={go} />
        <div className="anim-fade-up row" style={{ justifyContent: "center", gap: 40, marginTop: 44, animationDelay: "0.45s", flexWrap: "wrap" }}>
          {[["4.9★", "12,400+ reviews"], ["60+", "Countries"], ["100%", "Tailor-made"], ["24/7", "On-trip support"]].map(([n, l], i) => (
            <div key={i} style={{ textAlign: "center", color: "white" }}>
              <div style={{ fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.02em" }}>{n}</div>
              <div style={{ fontSize: "0.82rem", color: "oklch(1 0 0 / 0.8)", fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Category strip ---------- */
function CategoryStrip({ go }) {
  return (
    <section className="wrap" style={{ padding: "70px 28px 20px" }}>
      <div className="cat-strip" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
        {CATEGORIES.filter((c) => c.id !== "all").map((c, i) => (
          <button key={c.id} className="reveal" onClick={() => go({ view: "listing", cat: c.id })}
            style={{ transitionDelay: i * 0.05 + "s", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "26px 12px", background: "var(--surface)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-sm)", transition: "transform 0.4s var(--spring), box-shadow 0.4s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "var(--sh-lg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--sh-sm)"; }}>
            <span style={{ width: 54, height: 54, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--ocean-tint)", color: "var(--ocean-deep)" }}>
              <Icon name={c.icon} size={24} />
            </span>
            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{c.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------- Featured tours ---------- */
function FeaturedTours({ go }) {
  const featured = TOURS.filter((t) => t.featured).slice(0, 6);
  return (
    <section className="wrap" style={{ padding: "60px 28px" }}>
      <div className="row reveal" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="eyebrow">Editor's selection</span>
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", marginTop: 12 }}>Journeys we're<br /><span className="serif-italic" style={{ color: "var(--ocean)" }}>dreaming about</span></h2>
        </div>
        <button className="btn btn-ghost" onClick={() => go({ view: "listing" })}>Browse all journeys <Icon name="arrow" size={18} /></button>
      </div>
      <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
        {featured.map((t, i) => <TourCard key={t.id} tour={t} onOpen={(id) => go({ view: "tour", id })} delay={(i % 3) * 0.08} />)}
      </div>
    </section>
  );
}

/* ---------- Destination showcase (beautiful browsing) ---------- */
function DestinationShowcase({ go }) {
  const tiles = [
    { ...DESTINATIONS[0], span: "tall" }, { ...DESTINATIONS[3] }, { ...DESTINATIONS[1] },
    { ...DESTINATIONS[2] }, { ...DESTINATIONS[4] }, { ...DESTINATIONS[5], span: "wide" },
  ];
  return (
    <section style={{ background: "var(--bg-2)", padding: "90px 0" }}>
      <div className="wrap">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 46 }}>
          <span className="eyebrow">Browse by destination</span>
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", marginTop: 12 }}>Where will you wander?</h2>
        </div>
        <div className="dest-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "200px", gap: 16 }}>
          {tiles.map((d, i) => (
            <button key={d.name + i} className="reveal" onClick={() => go({ view: "listing", q: d.name })}
              style={{ transitionDelay: (i * 0.06) + "s", position: "relative", borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--sh-md)", gridColumn: d.span === "wide" ? "span 2" : "span 1", gridRow: d.span === "tall" ? "span 2" : "span 1", cursor: "pointer" }}
              onMouseEnter={(e) => { const img = e.currentTarget.querySelector(".ph-img"); if (img) img.style.transform = "scale(1.08)"; }}
              onMouseLeave={(e) => { const img = e.currentTarget.querySelector(".ph-img"); if (img) img.style.transform = "scale(1)"; }}>
              <Scenic theme={d.theme} label={""} style={{ position: "absolute", inset: 0, transition: "transform 0.8s var(--ease-out)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, oklch(0.2 0.04 235 / 0.6) 100%)" }} />
              <div style={{ position: "absolute", left: 20, bottom: 18, textAlign: "left", color: "white" }}>
                <div className="display" style={{ fontSize: "1.9rem" }}>{d.name}</div>
                <div style={{ fontSize: "0.82rem", color: "oklch(1 0 0 / 0.85)", fontWeight: 600 }}>{d.count} journeys</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Why Lumina ---------- */
function WhyLumina() {
  const items = [
    { icon: "map", h: "Designed by specialists", x: "Every itinerary is built and tested by people who live and breathe their regions." },
    { icon: "shield", h: "Protected & flexible", x: "Financial protection, free changes up to 60 days out, and 24/7 support on the ground." },
    { icon: "leaf", h: "Travel that gives back", x: "Carbon-balanced trips and partnerships with the communities you visit." },
    { icon: "award", h: "Loved by 12,000+ travellers", x: "An average rating of 4.9 across more than a decade of journeys." },
  ];
  return (
    <section id="why" className="wrap" style={{ padding: "90px 28px", scrollMarginTop: 80 }}>
      <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div className="reveal">
          <span className="eyebrow">The Lumina difference</span>
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)", margin: "14px 0 20px" }}>Beautifully planned,<br /><span className="serif-italic" style={{ color: "var(--coral)" }}>effortlessly yours</span></h2>
          <p style={{ color: "var(--ink-2)", fontSize: "1.08rem", lineHeight: 1.65, maxWidth: 460, marginBottom: 30 }}>
            We obsess over the details so you don't have to — from the view at breakfast to the timing of every sunset. The result is travel that feels personal, generous, and genuinely yours.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {items.map((it) => (
              <div key={it.h} className="row gap-3" style={{ alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: "var(--r-sm)", display: "grid", placeItems: "center", background: "var(--ocean-tint)", color: "var(--ocean-deep)" }}><Icon name={it.icon} size={22} /></span>
                <div>
                  <h4 style={{ fontSize: "1rem", marginBottom: 4 }}>{it.h}</h4>
                  <p style={{ fontSize: "0.88rem", color: "var(--ink-2)", lineHeight: 1.5 }}>{it.x}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal reveal-d2" style={{ position: "relative", height: 540 }}>
          <Scenic theme="maldives" label="overwater villa · maldives" rounded="var(--r-lg)" style={{ position: "absolute", top: 0, right: 0, width: "78%", height: 340, boxShadow: "var(--sh-lg)" }} />
          <Scenic theme="kyoto" label="kyoto · temple dawn" rounded="var(--r-lg)" style={{ position: "absolute", bottom: 0, left: 0, width: "60%", height: 280, boxShadow: "var(--sh-xl)", border: "6px solid var(--bg)" }} />
          <div style={{ position: "absolute", bottom: 40, right: 10, background: "var(--surface)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-lg)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--coral-soft)", color: "var(--coral-deep)", display: "grid", placeItems: "center" }}><Icon name="award" size={24} /></span>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>Travellers' Choice</div>
              <div style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>Awarded 2024 · 2025 · 2026</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */
function Testimonials() {
  const quotes = [
    { text: "The most thoughtfully designed trip we've ever taken. Every day felt like the highlight until the next one arrived.", name: "Elena & Marco", trip: "Cyclades by Private Sail", theme: "santorini" },
    { text: "I travelled solo and never once felt alone — the group and guides became friends for life.", name: "Tom H.", trip: "Patagonia: Towers of Paine", theme: "patagonia" },
    { text: "From the seaplane to the sandbank dinner, it was flawless. Worth every moment of the planning conversations.", name: "Dr. Amara N.", trip: "Great Migration Safari", theme: "safari" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % quotes.length), 6000);
    return () => clearInterval(t);
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

/* ---------- CTA band ---------- */
function CTABand({ go }) {
  return (
    <section className="wrap" style={{ padding: "90px 28px" }}>
      <div className="reveal" style={{ position: "relative", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--sh-xl)" }}>
        <Scenic theme="amalfi" label="amalfi coast" style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, oklch(0.25 0.05 235 / 0.85) 0%, oklch(0.3 0.06 235 / 0.4) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "clamp(40px, 6vw, 80px)", maxWidth: 620, color: "white" }}>
          <span className="eyebrow" style={{ color: "var(--sand)" }}>Let's begin</span>
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", margin: "12px 0 16px" }}>Your next great story starts here</h2>
          <p style={{ fontSize: "1.1rem", color: "oklch(1 0 0 / 0.9)", lineHeight: 1.6, marginBottom: 32 }}>
            Tell us how you like to travel and our specialists will craft something just for you — or browse our ready-to-book journeys.
          </p>
          <div className="row gap-3" style={{ flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={() => go({ view: "listing" })}>Explore journeys <Icon name="arrow" size={20} /></button>
            <button className="btn btn-lg" onClick={() => go({ view: "listing" })} style={{ background: "oklch(1 0 0 / 0.16)", color: "white", backdropFilter: "blur(8px)" }}><Icon name="phone" size={18} /> Talk to a specialist</button>
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
