/* ================================================================
   Lumina Voyages — Account: auth, profile, trips, saved
   ================================================================ */

/* ── Auth panel (not logged in) ───────────────────────────────── */
function AuthPanel({ go }) {
  const [mode, setMode] = useState("signin"); // signin | signup | forgot | check-email | reset-pw
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [pwStrength, setPwStrength] = useState(0);
  const { t } = useI18n();
  const toast = useToast();

  const set = (k) => (e) => {
    const v = e.target.value;
    setForm(p => ({ ...p, [k]: v }));
    if (k === "password") {
      let s = 0;
      if (v.length >= 8) s++;
      if (/[A-Z]/.test(v)) s++;
      if (/[0-9]/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      setPwStrength(s);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      if (SB.ok) {
        const { session } = await SB.auth.signIn(form.email, form.password);
        if (session) go({ view: "account" });
      } else {
        // fallback: simple localStorage auth
        if (!form.email || !form.password) { setErr("Fill in all fields."); setBusy(false); return; }
        Store.signIn({ name: form.email.split("@")[0], email: form.email, isAdmin: false });
        go({ view: "account" });
      }
    } catch(ex) {
      setErr(ex.message || "Invalid email or password.");
    }
    setBusy(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr(""); 
    if (!form.name.trim()) { setErr("Please enter your name."); return; }
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    if (form.password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    setBusy(true);
    try {
      if (SB.ok) {
        await SB.auth.signUp(form.email, form.password, form.name);
        setMode("check-email");
      } else {
        Store.signIn({ name: form.name, email: form.email, isAdmin: false });
        go({ view: "account" });
      }
    } catch(ex) {
      setErr(ex.message || "Sign up failed. Please try again.");
    }
    setBusy(false);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await SB.auth.resetPassword(form.email);
      setMode("check-email");
    } catch(ex) { setErr(ex.message || "Could not send reset email."); }
    setBusy(false);
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "var(--coral)", "#f59e0b", "var(--teal)", "var(--ocean)"];

  const inputProps = (k, type = "text", placeholder = "") => ({
    className: "input", type, placeholder, value: form[k] || "",
    onChange: set(k), required: true, autoComplete: k === "password" ? "current-password" : k
  });

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--bg)" }} className="auth-wrap">
      {/* Left art panel */}
      <div className="auth-art" style={{ position: "relative", overflow: "hidden", background: "var(--ocean-deep)" }}>
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80"
          alt="Travel" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, var(--ocean-deep) 0%, oklch(0.42 0.09 235 / 0.6) 100%)" }} />
        <div style={{ position: "relative", padding: "48px 40px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white" }}>
          <Logo light onClick={() => go({ view: "home" })} />
          <div>
            <h2 className="display" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "white", marginBottom: 18 }}>
              Every journey<br /><span className="serif-italic" style={{ color: "var(--sand)" }}>starts here</span>
            </h2>
            <p style={{ color: "oklch(1 0 0 / 0.78)", lineHeight: 1.6, maxWidth: 360, fontSize: "1rem" }}>
              Create an account to save your favourite tours, track bookings, and get personalised recommendations.
            </p>
            <div className="row gap-4" style={{ marginTop: 36, flexWrap: "wrap" }}>
              {["60+ destinations", "Verified reviews", "24/7 support"].map(x => (
                <span key={x} className="row gap-2" style={{ background: "oklch(1 0 0 / 0.12)", backdropFilter: "blur(8px)", padding: "8px 14px", borderRadius: "var(--r-pill)", fontSize: "0.82rem", fontWeight: 600 }}>
                  <Icon name="check" size={14} style={{ color: "var(--teal)" }} /> {x}
                </span>
              ))}
            </div>
          </div>
          <p style={{ color: "oklch(1 0 0 / 0.45)", fontSize: "0.78rem" }}>© 2025 Lumina Voyages</p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px", overflow: "auto" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Check email screen */}
          {mode === "check-email" && (
            <div style={{ textAlign: "center" }}>
              <span style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--ocean-tint)", display: "grid", placeItems: "center", margin: "0 auto 24px", color: "var(--ocean-deep)" }}>
                <Icon name="mail" size={32} />
              </span>
              <h2 style={{ marginBottom: 12 }}>Check your email</h2>
              <p style={{ color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 28 }}>
                We've sent a link to <strong>{form.email}</strong>.<br />Click it to verify your account and sign in.
              </p>
              <button className="btn btn-ghost" onClick={() => setMode("signin")}>Back to sign in</button>
            </div>
          )}

          {/* Sign in */}
          {mode === "signin" && (
            <>
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--ocean-tint)", color: "var(--ocean-deep)", padding: "6px 14px", borderRadius: "var(--r-pill)", fontSize: "0.8rem", fontWeight: 700, marginBottom: 18 }}>
                  <Icon name="user" size={15} /> {t("auth_welcome")}
                </div>
                <h1 className="display" style={{ fontSize: "2.4rem", marginBottom: 8 }}>{t("auth_signin_h")}</h1>
                <p style={{ color: "var(--ink-3)" }}>{t("auth_signin_sub")}</p>
              </div>

              <form onSubmit={handleSignIn} className="col gap-4">
                <div className="field">
                  <label>{t("auth_email")}</label>
                  <input {...inputProps("email", "email", "you@example.com")} autoComplete="email" />
                </div>
                <div className="field">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <label>{t("auth_password")}</label>
                    <button type="button" onClick={() => setMode("forgot")}
                      style={{ fontSize: "0.8rem", color: "var(--ocean)", fontWeight: 600 }}>{t("auth_forgot")}</button>
                  </div>
                  <input {...inputProps("password", "password", "••••••••")} autoComplete="current-password" />
                </div>
                {err && <div style={{ background: "var(--coral-soft)", color: "var(--coral-deep)", padding: "10px 14px", borderRadius: "var(--r-sm)", fontSize: "0.88rem", fontWeight: 600 }}>{err}</div>}
                <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={busy}>
                  {busy ? t("auth_signing_in") : <>{t("auth_signin_btn")} <Icon name="arrow" size={18} /></>}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 28, color: "var(--ink-3)", fontSize: "0.9rem" }}>
                {t("auth_no_account")}{" "}
                <button onClick={() => { setMode("signup"); setErr(""); }} style={{ color: "var(--ocean)", fontWeight: 700 }}>{t("auth_create")}</button>
              </div>
            </>
          )}

          {/* Sign up */}
          {mode === "signup" && (
            <>
              <div style={{ marginBottom: 36 }}>
                <h1 className="display" style={{ fontSize: "2.2rem", marginBottom: 8 }}>{t("auth_signup_h")}</h1>
                <p style={{ color: "var(--ink-3)" }}>{t("auth_signup_sub")}</p>
              </div>

              <form onSubmit={handleSignUp} className="col gap-4">
                <div className="field">
                  <label>{t("auth_name")}</label>
                  <input {...inputProps("name", "text", "Jane Smith")} autoComplete="name" />
                </div>
                <div className="field">
                  <label>{t("auth_email")}</label>
                  <input {...inputProps("email", "email", "you@example.com")} autoComplete="email" />
                </div>
                <div className="field">
                  <label>{t("auth_password")}</label>
                  <input {...inputProps("password", "password", "8+ characters")} autoComplete="new-password" />
                  {form.password && (
                    <div>
                      <div style={{ height: 4, borderRadius: 4, background: "var(--hairline)", overflow: "hidden", marginTop: 6 }}>
                        <div style={{ height: "100%", width: (pwStrength / 4 * 100) + "%", background: strengthColor[pwStrength], transition: "all 0.4s", borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: "0.76rem", color: strengthColor[pwStrength], fontWeight: 700 }}>{strengthLabel[pwStrength]}</span>
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>{t("auth_confirm")}</label>
                  <input {...inputProps("confirm", "password", "Repeat password")} autoComplete="new-password" />
                </div>
                {err && <div style={{ background: "var(--coral-soft)", color: "var(--coral-deep)", padding: "10px 14px", borderRadius: "var(--r-sm)", fontSize: "0.88rem", fontWeight: 600 }}>{err}</div>}
                <div style={{ fontSize: "0.8rem", color: "var(--ink-3)", lineHeight: 1.5 }}>
                  By creating an account you agree to our <a href="#" style={{ color: "var(--ocean)" }}>Terms</a> and <a href="#" style={{ color: "var(--ocean)" }}>Privacy Policy</a>.
                </div>
                <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={busy}>
                  {busy ? "Creating account…" : <>{t("auth_signup_btn")} <Icon name="arrow" size={18} /></>}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 28, color: "var(--ink-3)", fontSize: "0.9rem" }}>
                {t("auth_have_account")}{" "}
                <button onClick={() => { setMode("signin"); setErr(""); }} style={{ color: "var(--ocean)", fontWeight: 700 }}>{t("auth_signin_link")}</button>
              </div>
            </>
          )}

          {/* Forgot password */}
          {mode === "forgot" && (
            <>
              <button onClick={() => setMode("signin")} className="row gap-2" style={{ color: "var(--ink-3)", fontWeight: 600, fontSize: "0.9rem", marginBottom: 28 }}>
                <Icon name="arrowL" size={18} /> Back
              </button>
              <h2 style={{ marginBottom: 8 }}>Reset your password</h2>
              <p style={{ color: "var(--ink-3)", marginBottom: 28 }}>Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleForgot} className="col gap-4">
                <div className="field">
                  <label>Email address</label>
                  <input {...inputProps("email", "email", "you@example.com")} />
                </div>
                {err && <div style={{ background: "var(--coral-soft)", color: "var(--coral-deep)", padding: "10px 14px", borderRadius: "var(--r-sm)", fontSize: "0.88rem", fontWeight: 600 }}>{err}</div>}
                <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={busy || !SB.ok}>
                  {!SB.ok ? "Requires Supabase" : busy ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Tabs ─────────────────────────────────────────────────────── */
function TripsTab({ store, go }) {
  const [sbBookings, setSbBookings] = useState(null);
  const { t } = useI18n();
  useEffect(() => {
    if (SB.ok) SB.bookings.mine().then(setSbBookings).catch(() => {});
  }, []);
  const bookings = sbBookings || store.bookings || [];

  if (!bookings.length) return (
    <div style={{ textAlign: "center", padding: "70px 20px", background: "var(--surface)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-sm)" }}>
      <Icon name="compass" size={48} style={{ color: "var(--hairline-2)", margin: "0 auto 18px" }} />
      <h3 style={{ marginBottom: 8 }}>{t("acc_no_trips")}</h3>
      <p style={{ color: "var(--ink-3)", marginBottom: 24 }}>{t("acc_no_trips_sub")}</p>
      <button className="btn btn-primary" onClick={() => go({ view: "listing" })}>{t("acc_explore")}</button>
    </div>
  );

  return (
    <div className="col gap-4">
      {bookings.map((b, i) => {
        const tour = b.tours || (b.tourId ? getTour(b.tourId) : null);
        const statusColor = { Confirmed: "var(--ocean)", confirmed: "var(--ocean)", Cancelled: "var(--coral)", cancelled: "var(--coral)", completed: "var(--teal)" };
        return (
          <div key={b.id || i} style={{ background: "var(--surface)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-sm)", overflow: "hidden", display: "grid", gridTemplateColumns: "180px 1fr", border: "1px solid var(--hairline)" }}>
            <div style={{ position: "relative", background: "var(--ocean-tint)" }}>
              {tour?.theme && <img src={typeof PHOTOS !== "undefined" ? PHOTOS[tour.theme] : ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
            <div style={{ padding: "20px 22px" }}>
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--ink-3)" }}>{b.id}</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: statusColor[b.status] || "var(--ink-3)", textTransform: "capitalize" }}>{b.status}</span>
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: 6 }}>{tour?.title || b.tour_id || t("acc_trip")}</h3>
              <div className="row gap-4" style={{ color: "var(--ink-3)", fontSize: "0.84rem", flexWrap: "wrap" }}>
                {b.date && <span className="row gap-1"><Icon name="calendar" size={14} /> {b.date}</span>}
                {b.guests && <span className="row gap-1"><Icon name="users" size={14} /> {b.guests} {t("acc_guests")}</span>}
                {b.total && <span className="row gap-1" style={{ fontWeight: 700, color: "var(--ink)" }}><Icon name="tag" size={14} /> {fmtPrice(b.total)}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SavedTab({ store, go }) {
  const { t } = useI18n();
  const saved = store.saved || [];
  const tours = saved.map(id => getTour(id)).filter(Boolean);
  if (!tours.length) return (
    <div style={{ textAlign: "center", padding: "70px 20px", background: "var(--surface)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-sm)" }}>
      <Icon name="heart" size={48} style={{ color: "var(--hairline-2)", margin: "0 auto 18px" }} />
      <h3 style={{ marginBottom: 8 }}>{t("acc_no_saved")}</h3>
      <p style={{ color: "var(--ink-3)", marginBottom: 24 }}>{t("acc_no_saved_sub")}</p>
      <button className="btn btn-primary" onClick={() => go({ view: "listing" })}>{t("acc_explore")}</button>
    </div>
  );
  return <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
    {tours.map(tr => <TourCard key={tr.id} tour={tr} onOpen={id => go({ view: "tour", id })} />)}
  </div>;
}

function ProfileTab({ user, go }) {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: user.name || "", email: user.email || "", phone: "" });
  const [pwForm, setPwForm] = useState({ password: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const toast = useToast();

  const saveProfile = async () => {
    setSaving(true);
    try {
      if (SB.ok && user.id) {
        await SB.auth.updateProfile(user.id, { name: form.name, phone: form.phone });
        Store.signIn({ ...user, name: form.name });
      }
      toast("Profile updated", "check");
    } catch(e) { toast("Update failed: " + e.message, "x"); }
    setSaving(false);
  };

  const changePassword = async () => {
    if (pwForm.password !== pwForm.confirm) { toast("Passwords don't match", "x"); return; }
    if (pwForm.password.length < 8) { toast("Password too short", "x"); return; }
    setPwSaving(true);
    try {
      await SB.auth.updatePassword(pwForm.password);
      toast("Password changed", "check");
      setPwForm({ password: "", confirm: "" });
    } catch(e) { toast("Failed: " + e.message, "x"); }
    setPwSaving(false);
  };

  return (
    <div style={{ maxWidth: 560 }} className="col gap-6">
      <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-sm)", padding: 28 }}>
        <h3 style={{ marginBottom: 22 }}>{t("acc_profile")}</h3>
        <div className="col gap-4">
          <div className="field"><label>{t("auth_name")}</label>
            <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="field"><label>{t("auth_email")}</label>
            <input className="input" value={form.email} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="field"><label>Phone (optional)</label>
            <input className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 8900" />
          </div>
          <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>
            {saving ? "Saving…" : <><Icon name="check" size={18} /> {t("acc_save")}</>}
          </button>
        </div>
      </div>

      {SB.ok && (
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-sm)", padding: 28 }}>
          <h3 style={{ marginBottom: 22 }}>Change password</h3>
          <div className="col gap-4">
            <div className="field"><label>New password</label>
              <input className="input" type="password" value={pwForm.password} onChange={e => setPwForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div className="field"><label>Confirm new password</label>
              <input className="input" type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
            </div>
            <button className="btn btn-ghost" onClick={changePassword} disabled={pwSaving}>
              {pwSaving ? "Updating…" : "Update password"}
            </button>
          </div>
        </div>
      )}

      <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-sm)", padding: 28 }}>
        <h3 style={{ marginBottom: 16 }}>Danger zone</h3>
        <button className="btn btn-sm" onClick={async () => {
          if (SB.ok) await SB.auth.signOut();
          Store.signOut();
          go({ view: "home" });
        }} style={{ background: "var(--coral-soft)", color: "var(--coral-deep)" }}>
          Sign out of all devices
        </button>
      </div>
    </div>
  );
}

/* ── AccountPage ──────────────────────────────────────────────── */
function AccountPage({ go, route, store }) {
  const user = store.user;
  const [tab, setTab] = useState(route.tab || "trips");
  const { t } = useI18n();

  useEffect(() => { if (route.tab) setTab(route.tab); }, [route.tab]);

  if (!user) return <AuthPanel go={go} />;

  const tabs = [
    ["trips",   t("acc_trips"),   "compass",  (store.bookings || []).length],
    ["saved",   t("acc_saved"),   "heart",    (store.saved || []).length],
    ["profile", t("acc_profile"), "user",     null],
  ];

  return (
    <div style={{ paddingTop: 74, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, var(--ocean-deep), var(--ocean))", color: "white", position: "relative", overflow: "hidden" }}>
        <div className="blob" style={{ width: 300, height: 300, background: "var(--teal)", top: -80, right: 40 }} />
        <div className="wrap" style={{ position: "relative", zIndex: 2, padding: "40px 28px 30px" }}>
          <div className="row gap-4" style={{ flexWrap: "wrap" }}>
            <span style={{ width: 72, height: 72, borderRadius: "50%", background: "oklch(1 0 0 / 0.18)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "1.8rem", border: "2px solid oklch(1 0 0 / 0.3)" }}>
              {(user.name || user.email || "?")[0].toUpperCase()}
            </span>
            <div style={{ flex: 1 }}>
              <div className="row gap-2" style={{ marginBottom: 4 }}>
                <h1 className="display" style={{ fontSize: "2rem" }}>{t("acc_welcome")} {(user.name || "").split(" ")[0]}</h1>
                {user.isAdmin && <span style={{ background: "var(--coral)", color: "white", fontSize: "0.7rem", fontWeight: 800, padding: "3px 10px", borderRadius: "var(--r-pill)", letterSpacing: "0.08em", textTransform: "uppercase", alignSelf: "center" }}>Admin</span>}
              </div>
              <p style={{ color: "oklch(1 0 0 / 0.82)" }}>{user.email}</p>
            </div>
            <div className="row gap-3">
              {user.isAdmin && (
                <button className="btn" onClick={() => go({ view: "admin" })} style={{ background: "var(--coral)", color: "white" }}>
                  <Icon name="shield" size={18} /> Admin panel
                </button>
              )}
              <button className="btn" onClick={async () => { if (SB.ok) await SB.auth.signOut(); Store.signOut(); go({ view: "home" }); }}
                style={{ background: "oklch(1 0 0 / 0.16)", color: "white", backdropFilter: "blur(8px)" }}>
                {t("acc_signout")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ position: "sticky", top: 74, zIndex: 40, background: "var(--nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--hairline)" }}>
        <div className="wrap row gap-6" style={{ height: 58 }}>
          {tabs.map(([id, l, ic, n]) => (
            <button key={id} onClick={() => setTab(id)} className="row gap-2"
              style={{ fontWeight: 700, fontSize: "0.92rem", color: tab === id ? "var(--ocean)" : "var(--ink-2)", height: "100%", borderBottom: tab === id ? "2.5px solid var(--ocean)" : "2.5px solid transparent", transition: "all 0.3s" }}>
              <Icon name={ic} size={18} /> {l}
              {n > 0 && <span style={{ background: tab === id ? "var(--ocean)" : "var(--hairline-2)", color: tab === id ? "white" : "var(--ink-2)", fontSize: "0.72rem", fontWeight: 800, minWidth: 19, height: 19, borderRadius: 10, display: "grid", placeItems: "center", padding: "0 5px" }}>{n}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="wrap" style={{ padding: "36px 28px 90px" }}>
        {tab === "trips"   && <TripsTab store={store} go={go} />}
        {tab === "saved"   && <SavedTab store={store} go={go} />}
        {tab === "profile" && <ProfileTab user={user} go={go} />}
      </div>
    </div>
  );
}

Object.assign(window, { AccountPage });
