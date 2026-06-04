/* =========================================================
   Lumina Voyages — Account: trips, saved, profile
   ========================================================= */

function AccountPage({ go, route, store }) {
  const user = store.user;
  if (!user) return <AuthPanel go={go} />;
  const [tab, setTab] = useState(route.tab || "trips");
  useEffect(() => { if (route.tab) setTab(route.tab); }, [route.tab]);

  const tabs = [["trips", "My trips", "compass", store.bookings.length], ["saved", "Saved", "heart", store.saved.length], ["profile", "Profile", "user"]];

  return (
    <div style={{ paddingTop: 74, minHeight: "100vh" }}>
      {/* profile header */}
      <div style={{ background: "linear-gradient(160deg, var(--ocean-deep), var(--ocean))", color: "white", position: "relative", overflow: "hidden" }}>
        <div className="blob" style={{ width: 300, height: 300, background: "var(--teal)", top: -80, right: 40 }} />
        <div className="wrap" style={{ position: "relative", zIndex: 2, padding: "40px 28px 30px" }}>
          <div className="row gap-4" style={{ flexWrap: "wrap" }}>
            <span style={{ width: 72, height: 72, borderRadius: "50%", background: "oklch(1 0 0 / 0.18)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "1.8rem", border: "2px solid oklch(1 0 0 / 0.3)" }}>{user.name[0]}</span>
            <div style={{ flex: 1 }}>
              <h1 className="display" style={{ fontSize: "2.4rem" }}>Welcome back, {user.name.split(" ")[0]}</h1>
              <p style={{ color: "oklch(1 0 0 / 0.82)" }}>{user.email}</p>
            </div>
            <button className="btn" onClick={() => { Store.signOut(); go({ view: "home" }); }} style={{ background: "oklch(1 0 0 / 0.16)", color: "white", backdropFilter: "blur(8px)" }}>Sign out</button>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div style={{ position: "sticky", top: 74, zIndex: 40, background: "oklch(1 0 0 / 0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--hairline)" }}>
        <div className="wrap row gap-6" style={{ height: 58 }}>
          {tabs.map(([id, l, ic, n]) => (
            <button key={id} onClick={() => setTab(id)} className="row gap-2"
              style={{ fontWeight: 700, fontSize: "0.92rem", color: tab === id ? "var(--ocean)" : "var(--ink-2)", height: "100%", borderBottom: tab === id ? "2.5px solid var(--ocean)" : "2.5px solid transparent", transition: "all 0.3s" }}>
              <Icon name={ic} size={18} /> {l} {n > 0 && <span style={{ background: tab === id ? "var(--ocean)" : "var(--hairline-2)", color: tab === id ? "white" : "var(--ink-2)", fontSize: "0.72rem", fontWeight: 800, minWidth: 19, height: 19, borderRadius: 10, display: "grid", placeItems: "center", padding: "0 5px" }}>{n}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="wrap" style={{ padding: "36px 28px 90px" }}>
        {tab === "trips" && <TripsTab store={store} go={go} />}
        {tab === "saved" && <SavedTab store={store} go={go} />}
        {tab === "profile" && <ProfileTab user={user} />}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, text, cta, onCta }) {
  return (
    <div style={{ textAlign: "center", padding: "70px 20px", background: "var(--surface)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-sm)" }}>
      <span style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--ocean-tint)", color: "var(--ocean)", display: "grid", placeItems: "center", margin: "0 auto 18px" }}><Icon name={icon} size={34} /></span>
      <h3 style={{ fontSize: "1.5rem", marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "var(--ink-2)", marginBottom: 24, maxWidth: 380, marginInline: "auto" }}>{text}</p>
      <button className="btn btn-ocean btn-lg" onClick={onCta}>{cta} <Icon name="arrow" size={18} /></button>
    </div>
  );
}

function TripsTab({ store, go }) {
  if (!store.bookings.length) return <EmptyState icon="compass" title="No trips booked yet" text="When you book a journey it'll appear here with all your details and documents." cta="Explore journeys" onCta={() => go({ view: "listing" })} />;
  return (
    <div className="col gap-4">
      {store.bookings.map((b) => {
        const cancelled = b.status === "Cancelled";
        return (
          <div key={b.id} className="card" style={{ display: "flex", boxShadow: "var(--sh-sm)", opacity: cancelled ? 0.6 : 1, flexWrap: "wrap" }}>
            <Scenic theme={b.theme} label={b.place} style={{ width: 230, minHeight: 180, flexShrink: 0 }} />
            <div style={{ flex: 1, padding: 24, minWidth: 260 }}>
              <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <span className={"badge " + (cancelled ? "badge-coral" : "badge-ocean")}><Icon name={cancelled ? "x" : "checkC"} size={13} /> {b.status}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--ink-3)", fontWeight: 600 }}>Ref {b.id}</span>
              </div>
              <h3 style={{ fontSize: "1.4rem", margin: "12px 0 8px" }}>{b.tourTitle}</h3>
              <div className="row gap-4" style={{ color: "var(--ink-2)", fontSize: "0.88rem", flexWrap: "wrap", marginBottom: 16 }}>
                <span className="row gap-2"><Icon name="calendar" size={15} /> {b.departure}</span>
                <span className="row gap-2"><Icon name="users" size={15} /> {b.travellers} travellers</span>
                <span className="row gap-2"><Icon name="tag" size={15} /> {fmtPrice(b.total)} total</span>
              </div>
              <div className="row gap-3" style={{ flexWrap: "wrap" }}>
                <button className="btn btn-soft btn-sm" onClick={() => go({ view: "tour", id: b.tourId })}>View itinerary</button>
                {!cancelled && <button className="btn btn-ghost btn-sm" onClick={() => Store.cancelBooking(b.id)}><Icon name="x" size={15} /> Cancel</button>}
                {!cancelled && <span className="row gap-2" style={{ marginLeft: "auto", fontSize: "0.82rem", color: "var(--ink-3)" }}><Icon name="shield" size={14} /> {fmtPrice(b.total - b.deposit)} balance due before departure</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SavedTab({ store, go }) {
  const saved = store.saved.map(getTour).filter(Boolean);
  if (!saved.length) return <EmptyState icon="heart" title="No saved trips yet" text="Tap the heart on any journey to save it here and compare your favourites." cta="Find something to love" onCta={() => go({ view: "listing" })} />;
  return (
    <div>
      <h2 className="display" style={{ fontSize: "1.8rem", marginBottom: 20 }}>{saved.length} saved {saved.length === 1 ? "journey" : "journeys"}</h2>
      <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {saved.map((t) => <TourCard key={t.id} tour={t} onOpen={(id) => go({ view: "tour", id })} />)}
      </div>
    </div>
  );
}

function ProfileTab({ user }) {
  const toast = useToast();
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: "", country: "United States" });
  const prefs = [
    { icon: "diamond", l: "Luxury & private" }, { icon: "mountain", l: "Adventure" }, { icon: "leaf", l: "Sustainable travel" },
  ];
  return (
    <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28, alignItems: "start" }}>
      <div className="card" style={{ padding: 30, boxShadow: "var(--sh-sm)" }}>
        <h2 style={{ fontSize: "1.3rem", marginBottom: 20 }}>Personal details</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="field" style={{ gridColumn: "span 2" }}><label>Full name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field" style={{ gridColumn: "span 2" }}><label>Email</label><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="field"><label>Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 0000" /></div>
          <div className="field"><label>Country</label><select className="select" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>{["United States", "United Kingdom", "Canada", "Australia", "Other"].map((c) => <option key={c}>{c}</option>)}</select></div>
        </div>
        <button className="btn btn-ocean" style={{ marginTop: 22 }} onClick={() => { Store.signIn({ ...user, name: form.name, email: form.email }); toast("Profile updated", "checkC"); }}>Save changes</button>
      </div>
      <div className="col gap-4">
        <div className="card" style={{ padding: 26, boxShadow: "var(--sh-sm)" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: 14 }}>Travel preferences</h3>
          <div className="col gap-2">
            {prefs.map((p) => (
              <div key={p.l} className="row gap-3" style={{ padding: "10px 0" }}>
                <span style={{ width: 38, height: 38, borderRadius: "var(--r-sm)", background: "var(--ocean-tint)", color: "var(--ocean-deep)", display: "grid", placeItems: "center" }}><Icon name={p.icon} size={18} /></span>
                <span style={{ fontWeight: 600 }}>{p.l}</span>
                <Icon name="check" size={18} style={{ marginLeft: "auto", color: "var(--ocean)" }} strokeWidth={2.5} />
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 26, boxShadow: "none", background: "linear-gradient(160deg, var(--coral-soft), var(--sand))" }}>
          <Icon name="award" size={26} style={{ color: "var(--coral-deep)" }} />
          <h3 style={{ fontSize: "1.1rem", margin: "8px 0 4px" }}>Lumina Circle member</h3>
          <p style={{ fontSize: "0.88rem", color: "var(--ink-2)", lineHeight: 1.5 }}>Earn 2% back in travel credit on every booking and unlock early access to new journeys.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Auth panel (sign in / create account) ---------- */
function AuthPanel({ go }) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", pass: "" });
  const toast = useToast();
  const submit = () => {
    if (!/\S+@\S+\.\S+/.test(form.email) || form.pass.length < 4 || (mode === "signup" && !form.name)) { toast("Please complete the form", "x"); return; }
    Store.signIn({ name: mode === "signup" ? form.name : form.email.split("@")[0].replace(/^\w/, (c) => c.toUpperCase()), email: form.email });
    toast(mode === "signup" ? "Welcome to Lumina!" : "Signed in", "checkC");
  };
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="auth-wrap">
      <div style={{ position: "relative", overflow: "hidden" }} className="auth-art">
        <Scenic theme="santorini" label="santorini · greece" style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, oklch(0.3 0.06 235 / 0.5), oklch(0.4 0.08 235 / 0.2))" }} />
        <div style={{ position: "absolute", left: 50, bottom: 60, color: "white", maxWidth: 380, zIndex: 2 }}>
          <Icon name="quote" size={40} fill="current" style={{ color: "oklch(1 0 0 / 0.4)" }} />
          <p className="display" style={{ fontSize: "1.9rem", fontStyle: "italic", lineHeight: 1.25, marginTop: 8 }}>The most thoughtfully designed trip we've ever taken.</p>
          <p style={{ marginTop: 14, fontWeight: 600 }}>— Elena & Marco, Cyclades by Private Sail</p>
        </div>
      </div>
      <div style={{ display: "grid", placeItems: "center", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ marginBottom: 28 }}><Logo onClick={() => go({ view: "home" })} /></div>
          <h1 className="display" style={{ fontSize: "2.4rem", marginBottom: 6 }}>{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p style={{ color: "var(--ink-2)", marginBottom: 26 }}>{mode === "signin" ? "Sign in to manage your trips and saved journeys." : "Join to book, save and track your adventures."}</p>
          <div className="col gap-4">
            {mode === "signup" && <div className="field"><label>Full name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jordan Rivera" /></div>}
            <div className="field"><label>Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" /></div>
            <div className="field"><label>Password</label><input className="input" type="password" value={form.pass} onChange={(e) => setForm({ ...form, pass: e.target.value })} placeholder="••••••••" /></div>
            <button className="btn btn-ocean btn-lg btn-block" onClick={submit}>{mode === "signin" ? "Sign in" : "Create account"}</button>
          </div>
          <div className="row gap-3" style={{ margin: "20px 0" }}><span className="hr" /><span style={{ color: "var(--ink-3)", fontSize: "0.84rem", whiteSpace: "nowrap" }}>or</span><span className="hr" /></div>
          <button className="btn btn-ghost btn-block" onClick={() => { Store.signIn({ name: "Jordan Rivera", email: "jordan@email.com" }); toast("Signed in as guest", "check"); }}><Icon name="globe" size={18} /> Continue as demo guest</button>
          <p style={{ textAlign: "center", marginTop: 22, color: "var(--ink-2)", fontSize: "0.9rem" }}>
            {mode === "signin" ? "New to Lumina? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} style={{ color: "var(--ocean)", fontWeight: 700 }}>{mode === "signin" ? "Create an account" : "Sign in"}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AccountPage });
