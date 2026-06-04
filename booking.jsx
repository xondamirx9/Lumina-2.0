/* =========================================================
   Lumina Voyages — Booking / checkout flow
   ========================================================= */

const ADDONS = [
  { id: "insurance", icon: "shield", name: "Travel protection", desc: "Comprehensive cover incl. cancellation & medical", price: 180, per: true, popular: true },
  { id: "upgrade", icon: "bed", name: "Premium room upgrade", desc: "Best available suites & villas throughout", price: 640, per: true },
  { id: "flights", icon: "plane", name: "Add flights", desc: "We'll arrange the best routing from your city", price: 0, per: true, quote: true },
  { id: "transfer", icon: "globe", name: "Private airport transfers", desc: "Chauffeured arrival & departure", price: 120, per: false },
  { id: "extranight", icon: "camera", name: "Extra night pre-trip", desc: "Arrive early and settle in", price: 260, per: false },
];

function BookingPage({ go, route }) {
  const tour = getTour(route.id);
  const [step, setStep] = useState(0);
  const [travellers, setTravellers] = useState(route.travellers || 2);
  const [departure, setDeparture] = useState(route.departure || DEPARTURES[0]);
  const [lead, setLead] = useState({ first: "", last: "", email: "", phone: "", country: "" });
  const [addons, setAddons] = useState(["insurance"]);
  const [card, setCard] = useState({ num: "", name: "", exp: "", cvc: "" });
  const [pay, setPay] = useState("card");
  const [booking, setBooking] = useState(null);
  const toast = useToast();

  useEffect(() => { window.scrollTo(0, 0); }, [step]);
  if (!tour) return null;

  const steps = ["Your details", "Enhance your trip", "Payment", "Confirmed"];
  const addonTotal = addons.reduce((s, id) => {
    const a = ADDONS.find((x) => x.id === id); if (!a || a.quote) return s;
    return s + (a.per ? a.price * travellers : a.price);
  }, 0);
  const base = tour.price * travellers;
  const total = base + addonTotal;
  const deposit = Math.round(total * 0.2);

  const toggleAddon = (id) => setAddons(addons.includes(id) ? addons.filter((x) => x !== id) : [...addons, id]);

  const validStep0 = lead.first && lead.last && /\S+@\S+\.\S+/.test(lead.email) && lead.phone;
  const validPay = pay !== "card" || (card.num.replace(/\s/g, "").length >= 15 && card.name && card.exp && card.cvc.length >= 3);

  const confirm = () => {
    if (!validPay) { toast("Please complete payment details", "x"); return; }
    const b = Store.addBooking({
      tourId: tour.id, tourTitle: tour.title, place: tour.place, theme: tour.theme,
      departure, travellers, total, deposit, lead, addons,
    });
    if (!Store.get().user) Store.signIn({ name: lead.first + " " + lead.last, email: lead.email });
    setBooking(b);
    setStep(3);
  };

  return (
    <div style={{ paddingTop: 74, minHeight: "100vh", background: "var(--bg-2)" }}>
      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 70 }}>
        {/* back + stepper */}
        {step < 3 && (
          <button className="row gap-2" onClick={() => step === 0 ? go({ view: "tour", id: tour.id }) : setStep(step - 1)}
            style={{ color: "var(--ink-2)", fontWeight: 600, marginBottom: 22 }}>
            <Icon name="arrowL" size={18} /> {step === 0 ? "Back to trip" : "Back"}
          </button>
        )}

        <div className="stepper row" style={{ justifyContent: "center", gap: 0, marginBottom: 36, flexWrap: "wrap" }}>
          {steps.map((s, i) => (
            <div key={s} className="row" style={{ alignItems: "center" }}>
              <div className="row gap-2" style={{ opacity: i <= step ? 1 : 0.4 }}>
                <span style={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "0.85rem", background: i < step ? "var(--ocean)" : i === step ? "var(--coral)" : "var(--surface)", color: i <= step ? "white" : "var(--ink-3)", boxShadow: i > step ? "inset 0 0 0 1.5px var(--hairline-2)" : "none", transition: "all 0.3s" }}>
                  {i < step ? <Icon name="check" size={16} strokeWidth={3} /> : i + 1}
                </span>
                <span className="step-label" style={{ fontWeight: 700, fontSize: "0.88rem", color: i === step ? "var(--ink)" : "var(--ink-2)" }}>{s}</span>
              </div>
              {i < steps.length - 1 && <span style={{ width: 40, height: 2, background: i < step ? "var(--ocean)" : "var(--hairline-2)", margin: "0 12px", transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>

        {step === 3 ? (
          <Confirmation booking={booking} tour={tour} go={go} />
        ) : (
          <div className="booking-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>
            <div className="card anim-fade-up" style={{ padding: 32, boxShadow: "var(--sh-md)" }}>
              {step === 0 && <StepDetails lead={lead} setLead={setLead} travellers={travellers} setTravellers={setTravellers} departure={departure} setDeparture={setDeparture} tour={tour} />}
              {step === 1 && <StepAddons addons={addons} toggle={toggleAddon} travellers={travellers} />}
              {step === 2 && <StepPayment card={card} setCard={setCard} pay={pay} setPay={setPay} total={total} deposit={deposit} lead={lead} />}

              <div className="row" style={{ justifyContent: "space-between", marginTop: 30 }}>
                <button className="btn btn-ghost" onClick={() => step === 0 ? go({ view: "tour", id: tour.id }) : setStep(step - 1)}>Back</button>
                {step < 2 ? (
                  <button className="btn btn-ocean btn-lg" onClick={() => { if (step === 0 && !validStep0) { toast("Please complete your details", "x"); return; } setStep(step + 1); }}>
                    Continue <Icon name="arrow" size={18} />
                  </button>
                ) : (
                  <button className="btn btn-primary btn-lg" onClick={confirm}><Icon name="lock" size={17} /> Confirm & pay {fmtPrice(deposit)}</button>
                )}
              </div>
            </div>

            <OrderSummary tour={tour} travellers={travellers} departure={departure} base={base} addons={addons} addonTotal={addonTotal} total={total} deposit={deposit} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Step 1: details ---- */
function StepDetails({ lead, setLead, travellers, setTravellers, departure, setDeparture, tour }) {
  const f = (k) => (e) => setLead({ ...lead, [k]: e.target.value });
  return (
    <div>
      <h2 className="display" style={{ fontSize: "1.9rem", marginBottom: 6 }}>Who's travelling?</h2>
      <p style={{ color: "var(--ink-2)", marginBottom: 26 }}>We'll send your confirmation and trip documents here.</p>
      <div className="row gap-4" style={{ marginBottom: 24, flexWrap: "wrap" }}>
        <div className="field" style={{ flex: "1 1 200px" }}>
          <label>Departure date</label>
          <select className="select" value={departure} onChange={(e) => setDeparture(e.target.value)}>{DEPARTURES.map((d) => <option key={d}>{d}</option>)}</select>
        </div>
        <div className="field" style={{ flex: "1 1 200px" }}>
          <label>Travellers</label>
          <div className="row" style={{ justifyContent: "space-between", background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--hairline-2)", borderRadius: "var(--r-sm)", padding: "8px 14px" }}>
            <span style={{ fontWeight: 600 }}>{travellers}</span>
            <div className="row gap-3">
              <button onClick={() => setTravellers(Math.max(tour.groupMin, travellers - 1))} style={stepBtn} disabled={travellers <= tour.groupMin}><Icon name="minus" size={16} /></button>
              <button onClick={() => setTravellers(Math.min(tour.groupMax, travellers + 1))} style={stepBtn} disabled={travellers >= tour.groupMax}><Icon name="plus" size={16} /></button>
            </div>
          </div>
        </div>
      </div>
      <h3 style={{ fontSize: "1.05rem", marginBottom: 16 }}>Lead traveller</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="field"><label>First name</label><input className="input" value={lead.first} onChange={f("first")} placeholder="Jordan" /></div>
        <div className="field"><label>Last name</label><input className="input" value={lead.last} onChange={f("last")} placeholder="Rivera" /></div>
        <div className="field"><label>Email</label><input className="input" type="email" value={lead.email} onChange={f("email")} placeholder="you@email.com" /></div>
        <div className="field"><label>Phone</label><input className="input" value={lead.phone} onChange={f("phone")} placeholder="+1 555 000 0000" /></div>
        <div className="field" style={{ gridColumn: "span 2" }}><label>Country of residence</label>
          <select className="select" value={lead.country} onChange={f("country")}>
            <option value="">Select…</option>
            {["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Other"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <label className="row gap-3" style={{ marginTop: 20, background: "var(--ocean-tint)", padding: "14px 16px", borderRadius: "var(--r-sm)", cursor: "pointer" }}>
        <Icon name="sparkle" size={20} style={{ color: "var(--ocean-deep)" }} />
        <span style={{ fontSize: "0.9rem", color: "var(--ink-2)", fontWeight: 500 }}>Email me a free, no-obligation quote and a specialist will be in touch within 24 hours.</span>
      </label>
    </div>
  );
}

/* ---- Step 2: add-ons ---- */
function StepAddons({ addons, toggle, travellers }) {
  return (
    <div>
      <h2 className="display" style={{ fontSize: "1.9rem", marginBottom: 6 }}>Make it yours</h2>
      <p style={{ color: "var(--ink-2)", marginBottom: 24 }}>Optional touches to round out your journey. Add or skip — entirely up to you.</p>
      <div className="col gap-3">
        {ADDONS.map((a) => {
          const on = addons.includes(a.id);
          const priceLabel = a.quote ? "On request" : (a.price === 0 ? "Free" : fmtPrice(a.price) + (a.per ? " pp" : ""));
          return (
            <button key={a.id} onClick={() => toggle(a.id)} style={{ textAlign: "left", display: "flex", gap: 16, alignItems: "center", padding: "18px 20px", borderRadius: "var(--r-md)", background: on ? "var(--ocean-tint)" : "var(--surface)", boxShadow: on ? "inset 0 0 0 2px var(--ocean)" : "inset 0 0 0 1px var(--hairline-2)", transition: "all 0.3s" }}>
              <span style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "var(--r-sm)", display: "grid", placeItems: "center", background: on ? "var(--ocean)" : "var(--ocean-tint)", color: on ? "white" : "var(--ocean-deep)", transition: "all 0.3s" }}><Icon name={a.icon} size={24} /></span>
              <div style={{ flex: 1 }}>
                <div className="row gap-2"><span style={{ fontWeight: 700 }}>{a.name}</span>{a.popular && <span className="badge badge-coral">Recommended</span>}</div>
                <p style={{ fontSize: "0.86rem", color: "var(--ink-2)", marginTop: 2 }}>{a.desc}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 800 }}>{priceLabel}</div>
                <span style={{ display: "inline-grid", placeItems: "center", width: 26, height: 26, borderRadius: "50%", marginTop: 6, background: on ? "var(--ocean)" : "transparent", boxShadow: on ? "none" : "inset 0 0 0 1.5px var(--hairline-2)", color: "white" }}>{on && <Icon name="check" size={15} strokeWidth={3} />}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Step 3: payment ---- */
function StepPayment({ card, setCard, pay, setPay, total, deposit, lead }) {
  const f = (k) => (e) => {
    let v = e.target.value;
    if (k === "num") v = v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (k === "exp") v = v.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/");
    if (k === "cvc") v = v.replace(/\D/g, "").slice(0, 4);
    setCard({ ...card, [k]: v });
  };
  return (
    <div>
      <h2 className="display" style={{ fontSize: "1.9rem", marginBottom: 6 }}>Secure payment</h2>
      <p style={{ color: "var(--ink-2)", marginBottom: 22 }}>Pay a {fmtPrice(deposit)} deposit today to reserve. Balance due 60 days before departure.</p>
      <div className="row gap-3" style={{ marginBottom: 22, flexWrap: "wrap" }}>
        {[["card", "Card", "lock"], ["paypal", "PayPal", "globe"], ["bank", "Bank transfer", "shield"]].map(([id, l, ic]) => (
          <button key={id} onClick={() => setPay(id)} className="row gap-2" style={{ flex: "1 1 120px", justifyContent: "center", padding: "13px", borderRadius: "var(--r-sm)", fontWeight: 700, fontSize: "0.9rem", background: pay === id ? "var(--ocean-tint)" : "var(--surface)", boxShadow: pay === id ? "inset 0 0 0 2px var(--ocean)" : "inset 0 0 0 1px var(--hairline-2)", color: pay === id ? "var(--ocean-deep)" : "var(--ink-2)" }}>
            <Icon name={ic} size={18} /> {l}
          </button>
        ))}
      </div>
      {pay === "card" ? (
        <div className="col gap-4">
          <div className="field"><label>Card number</label><input className="input" value={card.num} onChange={f("num")} placeholder="4242 4242 4242 4242" inputMode="numeric" /></div>
          <div className="field"><label>Name on card</label><input className="input" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder={lead.first ? lead.first + " " + lead.last : "Full name"} /></div>
          <div className="row gap-4">
            <div className="field" style={{ flex: 1 }}><label>Expiry</label><input className="input" value={card.exp} onChange={f("exp")} placeholder="MM/YY" inputMode="numeric" /></div>
            <div className="field" style={{ flex: 1 }}><label>CVC</label><input className="input" value={card.cvc} onChange={f("cvc")} placeholder="123" inputMode="numeric" /></div>
          </div>
        </div>
      ) : (
        <div style={{ padding: 28, background: "var(--bg-2)", borderRadius: "var(--r-md)", textAlign: "center", color: "var(--ink-2)" }}>
          <Icon name={pay === "paypal" ? "globe" : "shield"} size={32} style={{ color: "var(--ocean)", margin: "0 auto 10px" }} />
          <p style={{ fontWeight: 600 }}>You'll be redirected to complete payment securely via {pay === "paypal" ? "PayPal" : "bank transfer"} after confirming.</p>
        </div>
      )}
      <div className="row gap-3" style={{ marginTop: 20, padding: "14px 16px", background: "var(--teal-soft)", borderRadius: "var(--r-sm)" }}>
        <Icon name="lock" size={20} style={{ color: "oklch(0.42 0.07 200)" }} />
        <span style={{ fontSize: "0.86rem", color: "var(--ink-2)", fontWeight: 500 }}>Your payment is encrypted and protected. This is a demo — no real card is charged.</span>
      </div>
    </div>
  );
}

/* ---- Order summary rail ---- */
function OrderSummary({ tour, travellers, departure, base, addons, addonTotal, total, deposit }) {
  return (
    <aside className="order-summary" style={{ position: "sticky", top: 90 }}>
      <div className="card" style={{ boxShadow: "var(--sh-md)", overflow: "hidden" }}>
        <Scenic theme={tour.theme} label={tour.place} style={{ height: 130 }} />
        <div style={{ padding: 22 }}>
          <h3 style={{ fontSize: "1.15rem", marginBottom: 4 }}>{tour.title}</h3>
          <div className="row gap-2" style={{ color: "var(--ink-3)", fontSize: "0.84rem", marginBottom: 14 }}><Icon name="pin" size={14} /> {tour.place}</div>
          <div className="col gap-2" style={{ fontSize: "0.88rem", marginBottom: 14 }}>
            <div className="row" style={{ justifyContent: "space-between" }}><span className="row gap-2" style={{ color: "var(--ink-2)" }}><Icon name="calendar" size={15} /> Departs</span><span style={{ fontWeight: 600 }}>{departure}</span></div>
            <div className="row" style={{ justifyContent: "space-between" }}><span className="row gap-2" style={{ color: "var(--ink-2)" }}><Icon name="clock" size={15} /> Duration</span><span style={{ fontWeight: 600 }}>{tour.days} days</span></div>
            <div className="row" style={{ justifyContent: "space-between" }}><span className="row gap-2" style={{ color: "var(--ink-2)" }}><Icon name="users" size={15} /> Travellers</span><span style={{ fontWeight: 600 }}>{travellers}</span></div>
          </div>
          <div className="hr" style={{ margin: "4px 0 14px" }} />
          <div className="col gap-2" style={{ fontSize: "0.9rem" }}>
            <div className="row" style={{ justifyContent: "space-between" }}><span style={{ color: "var(--ink-2)" }}>Trip × {travellers}</span><span style={{ fontWeight: 600 }}>{fmtPrice(base)}</span></div>
            {addons.filter((id) => { const a = ADDONS.find((x) => x.id === id); return a && !a.quote && a.price > 0; }).map((id) => {
              const a = ADDONS.find((x) => x.id === id);
              return <div key={id} className="row" style={{ justifyContent: "space-between" }}><span style={{ color: "var(--ink-2)" }}>{a.name}</span><span style={{ fontWeight: 600 }}>{fmtPrice(a.per ? a.price * travellers : a.price)}</span></div>;
            })}
          </div>
          <div className="hr" style={{ margin: "14px 0" }} />
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontWeight: 700, fontSize: "1.05rem" }}>Total</span><span style={{ fontWeight: 800, fontSize: "1.3rem" }}>{fmtPrice(total)}</span></div>
          <div className="row" style={{ justifyContent: "space-between", padding: "10px 14px", background: "var(--coral-soft)", borderRadius: "var(--r-sm)" }}>
            <span style={{ fontWeight: 700, color: "var(--coral-deep)" }}>Due today (20%)</span><span style={{ fontWeight: 800, color: "var(--coral-deep)" }}>{fmtPrice(deposit)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---- Step 4: confirmation ---- */
function Confirmation({ booking, tour, go }) {
  const ref = useRef(null);
  useEffect(() => {
    // little burst of confetti dots
    const host = ref.current; if (!host) return;
    const colors = ["var(--coral)", "var(--ocean)", "var(--teal)", "var(--gold)"];
    for (let i = 0; i < 36; i++) {
      const s = document.createElement("span");
      const size = 6 + Math.random() * 8;
      Object.assign(s.style, { position: "absolute", left: "50%", top: "40px", width: size + "px", height: size + "px", borderRadius: Math.random() > 0.5 ? "50%" : "2px", background: colors[i % 4], opacity: "0.9", pointerEvents: "none" });
      host.appendChild(s);
      const angle = Math.random() * Math.PI * 2, dist = 80 + Math.random() * 220;
      s.animate([{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 }, { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 200}px) scale(0.4) rotate(${Math.random() * 360}deg)`, opacity: 0 }], { duration: 1400 + Math.random() * 800, easing: "cubic-bezier(0.2,0.6,0.3,1)", fill: "forwards" });
    }
  }, []);
  if (!booking) return null;
  return (
    <div className="anim-scale-in" style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
      <div ref={ref} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none", zIndex: 5 }} />
      <div className="card" style={{ padding: "44px 40px", textAlign: "center", boxShadow: "var(--sh-lg)", position: "relative", zIndex: 2 }}>
        <span style={{ width: 78, height: 78, borderRadius: "50%", background: "var(--ocean-tint)", color: "var(--ocean)", display: "grid", placeItems: "center", margin: "0 auto 20px" }}><Icon name="checkC" size={44} /></span>
        <span className="eyebrow">Booking confirmed</span>
        <h1 className="display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", margin: "10px 0 12px" }}>You're going to {tour.place.split(",")[0]}!</h1>
        <p style={{ color: "var(--ink-2)", fontSize: "1.05rem", marginBottom: 8 }}>A confirmation is on its way to <strong>{booking.lead.email}</strong>.</p>
        <div className="row gap-2" style={{ justifyContent: "center", marginBottom: 28 }}><span className="badge badge-ocean" style={{ fontSize: "0.86rem", padding: "8px 16px" }}>Reference {booking.id}</span></div>

        <div style={{ background: "var(--bg-2)", borderRadius: "var(--r-md)", padding: 22, textAlign: "left", marginBottom: 24 }}>
          <div className="row gap-4" style={{ alignItems: "center" }}>
            <Scenic theme={tour.theme} label="" style={{ width: 84, height: 84, borderRadius: "var(--r-sm)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "1.15rem" }}>{tour.title}</h3>
              <div className="row gap-4" style={{ color: "var(--ink-2)", fontSize: "0.86rem", marginTop: 6, flexWrap: "wrap" }}>
                <span className="row gap-2"><Icon name="calendar" size={15} /> {booking.departure}</span>
                <span className="row gap-2"><Icon name="users" size={15} /> {booking.travellers} travellers</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--ink-3)" }}>Paid today</div>
              <div style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--ocean)" }}>{fmtPrice(booking.deposit)}</div>
              <div style={{ fontSize: "0.76rem", color: "var(--ink-3)" }}>of {fmtPrice(booking.total)}</div>
            </div>
          </div>
        </div>

        <div className="row gap-3" style={{ justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-ocean btn-lg" onClick={() => go({ view: "account", tab: "trips" })}>View my trips <Icon name="arrow" size={18} /></button>
          <button className="btn btn-ghost btn-lg" onClick={() => go({ view: "listing" })}>Browse more journeys</button>
        </div>
      </div>
      <div className="row gap-3" style={{ justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
        {[["mail", "Check your email"], ["phone", "We'll call to plan details"], ["shield", "Free changes for 60 days"]].map(([ic, l]) => (
          <span key={l} className="row gap-2" style={{ color: "var(--ink-2)", fontSize: "0.86rem", fontWeight: 600 }}><Icon name={ic} size={16} style={{ color: "var(--ocean)" }} /> {l}</span>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { BookingPage });
