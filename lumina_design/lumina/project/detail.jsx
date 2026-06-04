/* =========================================================
   Lumina Voyages — Tour detail page
   ========================================================= */

const DEPARTURES = ["14 Jun 2026", "12 Jul 2026", "9 Aug 2026", "13 Sep 2026", "11 Oct 2026"];

function TourPage({ go, route }) {
  const tour = getTour(route.id);
  const ref = useReveal();
  const [tab, setTab] = useState("overview");
  const [openDay, setOpenDay] = useState(0);
  const [travellers, setTravellers] = useState(2);
  const [departure, setDeparture] = useState(DEPARTURES[0]);
  const reviews = reviewsFor(tour ? tour.id : "");
  const [showReview, setShowReview] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [route.id]);
  if (!tour) return null;

  const total = tour.price * travellers;
  const tabs = [["overview", "Overview"], ["itinerary", "Itinerary"], ["included", "What's included"], ["reviews", "Reviews (" + reviews.length + ")"]];

  const scrollTo = (id) => {
    setTab(id);
    const el = document.getElementById("sec-" + id);
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
  };

  return (
    <div ref={ref} style={{ paddingTop: 74 }}>
      {/* gallery */}
      <div className="wrap" style={{ paddingTop: 22 }}>
        <div className="row gap-2" style={{ color: "var(--ink-3)", fontSize: "0.85rem", fontWeight: 600, marginBottom: 14, flexWrap: "wrap" }}>
          <a href="#/" onClick={(e) => { e.preventDefault(); go({ view: "home" }); }} style={{ color: "var(--ocean)" }}>Home</a>
          <Icon name="chevR" size={13} />
          <a href="#/journeys" onClick={(e) => { e.preventDefault(); go({ view: "listing" }); }} style={{ color: "var(--ocean)" }}>Journeys</a>
          <Icon name="chevR" size={13} /> <span>{tour.title}</span>
        </div>
        <div className="gallery" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "200px 200px", gap: 12, borderRadius: "var(--r-lg)", overflow: "hidden" }}>
          <Scenic theme={tour.theme} label={tour.place} style={{ gridRow: "span 2", height: "100%", minHeight: 412 }}>
            <div style={{ position: "absolute", top: 18, left: 18, display: "flex", gap: 8 }}>
              {tour.tags.slice(0, 2).map((t) => <span key={t} className="badge badge-glass">{t}</span>)}
            </div>
          </Scenic>
          <Scenic theme={["maldives","amalfi","bali","norway"][0]} label="moment · two" style={{ height: "100%" }} />
          <Scenic theme={tour.theme === "santorini" ? "sunset" : "ocean"} label="moment · three" style={{ height: "100%" }}>
            <button className="btn btn-ghost btn-sm" style={{ position: "absolute", right: 14, bottom: 14, background: "oklch(1 0 0 / 0.92)" }}><Icon name="camera" size={16} /> +18 photos</button>
          </Scenic>
        </div>
      </div>

      {/* title row */}
      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 460px" }}>
            <div className="row gap-3" style={{ marginBottom: 10, flexWrap: "wrap" }}>
              <span className="badge badge-ocean"><Icon name="pin" size={13} /> {tour.region}</span>
              <span className="row gap-2" style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                <Stars value={tour.rating} /> {tour.rating} <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>· {tour.reviews} reviews</span>
              </span>
            </div>
            <h1 className="display" style={{ fontSize: "clamp(2.2rem, 4.4vw, 3.6rem)", lineHeight: 1 }}>{tour.title}</h1>
            <p style={{ color: "var(--ink-2)", fontSize: "1.1rem", marginTop: 14, maxWidth: 640, lineHeight: 1.55 }}>{tour.blurb}</p>
            <div className="row gap-4" style={{ marginTop: 22, flexWrap: "wrap" }}>
              {[["clock", tour.days + " days / " + tour.nights + " nights"], ["users", tour.groupMax <= 2 ? "Private journey" : tour.groupMin + "–" + tour.groupMax + " travellers"], ["mountain", tour.difficulty], ["globe", tour.pace + " pace"]].map(([ic, l]) => (
                <span key={l} className="row gap-2" style={{ fontWeight: 600, color: "var(--ink-2)", fontSize: "0.92rem" }}><Icon name={ic} size={18} style={{ color: "var(--ocean)" }} /> {l}</span>
              ))}
            </div>
          </div>
          <div className="row gap-3">
            <SaveButton tourId={tour.id} big />
          </div>
        </div>
      </div>

      {/* sticky tab nav */}
      <div style={{ position: "sticky", top: 74, zIndex: 40, background: "oklch(1 0 0 / 0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--hairline)", marginTop: 28 }}>
        <div className="wrap row gap-6" style={{ height: 58 }}>
          {tabs.map(([id, l]) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ fontWeight: 700, fontSize: "0.92rem", color: tab === id ? "var(--ocean)" : "var(--ink-2)", height: "100%", borderBottom: tab === id ? "2.5px solid var(--ocean)" : "2.5px solid transparent", transition: "all 0.3s" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* body */}
      <div className="wrap detail-body" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, padding: "44px 28px 90px", alignItems: "start" }}>
        <div className="col gap-8">
          {/* overview */}
          <section id="sec-overview" className="reveal" style={{ scrollMarginTop: 130 }}>
            <h2 className="display" style={{ fontSize: "2rem", marginBottom: 16 }}>The experience</h2>
            <p style={{ color: "var(--ink-2)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: 26 }}>
              {tour.blurb} This is travel designed around the moments that stay with you — the unhurried mornings, the meals you'll still talk about, the views that make you go quiet. Every detail is handled, so all you have to do is be there.
            </p>
            <h3 style={{ fontSize: "1.25rem", marginBottom: 16 }}>Trip highlights</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {tour.highlights.map((h, i) => (
                <div key={i} className="row gap-3" style={{ alignItems: "flex-start", background: "var(--surface)", padding: "16px 18px", borderRadius: "var(--r-sm)", boxShadow: "var(--sh-sm)" }}>
                  <span style={{ flexShrink: 0, color: "var(--coral)", marginTop: 1 }}><Icon name="sparkle" size={20} fill="current" /></span>
                  <span style={{ fontWeight: 600, fontSize: "0.94rem", lineHeight: 1.45 }}>{h}</span>
                </div>
              ))}
            </div>
          </section>

          {/* itinerary */}
          <section id="sec-itinerary" className="reveal" style={{ scrollMarginTop: 130 }}>
            <h2 className="display" style={{ fontSize: "2rem", marginBottom: 6 }}>Day by day</h2>
            <p style={{ color: "var(--ink-3)", marginBottom: 22 }}>{tour.days}-day itinerary · tap any day to expand</p>
            <div style={{ position: "relative", paddingLeft: 4 }}>
              {tour.itinerary.map((d, i) => {
                const open = openDay === i;
                return (
                  <div key={i} style={{ display: "flex", gap: 18 }}>
                    <div className="col" style={{ alignItems: "center", flexShrink: 0 }}>
                      <span style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "0.82rem", background: open ? "var(--ocean)" : "var(--ocean-tint)", color: open ? "white" : "var(--ocean-deep)", transition: "all 0.3s", zIndex: 2 }}>{i + 1}</span>
                      {i < tour.itinerary.length - 1 && <span style={{ width: 2, flex: 1, background: "var(--hairline)", minHeight: 20 }} />}
                    </div>
                    <button onClick={() => setOpenDay(open ? -1 : i)} style={{ flex: 1, textAlign: "left", paddingBottom: 16 }}>
                      <div className="row" style={{ justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <span style={{ fontSize: "0.74rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ocean)" }}>{d.d}</span>
                          <h4 style={{ fontSize: "1.1rem", marginTop: 3 }}>{d.t}</h4>
                        </div>
                        <span style={{ color: "var(--ink-3)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s", marginTop: 4 }}><Icon name="chevD" size={20} /></span>
                      </div>
                      <div style={{ maxHeight: open ? 120 : 0, overflow: "hidden", transition: "max-height 0.45s var(--ease), margin 0.3s, opacity 0.4s", opacity: open ? 1 : 0, marginTop: open ? 8 : 0 }}>
                        <p style={{ color: "var(--ink-2)", lineHeight: 1.6, fontSize: "0.96rem" }}>{d.x}</p>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* included */}
          <section id="sec-included" className="reveal" style={{ scrollMarginTop: 130 }}>
            <h2 className="display" style={{ fontSize: "2rem", marginBottom: 22 }}>What's included</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
              <div>
                <h4 className="row gap-2" style={{ fontSize: "1rem", marginBottom: 14, color: "var(--ocean-deep)" }}><Icon name="checkC" size={20} /> Included</h4>
                <div className="col gap-3">
                  {tour.included.map((x) => (
                    <div key={x} className="row gap-3"><span style={{ color: "var(--ocean)", flexShrink: 0 }}><Icon name="check" size={18} strokeWidth={2.5} /></span><span style={{ fontSize: "0.94rem", color: "var(--ink-2)" }}>{x}</span></div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="row gap-2" style={{ fontSize: "1rem", marginBottom: 14, color: "var(--ink-3)" }}><Icon name="x" size={18} /> Not included</h4>
                <div className="col gap-3">
                  {tour.notIncluded.map((x) => (
                    <div key={x} className="row gap-3"><span style={{ color: "var(--ink-3)", flexShrink: 0 }}><Icon name="minus" size={18} /></span><span style={{ fontSize: "0.94rem", color: "var(--ink-3)" }}>{x}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* reviews */}
          <section id="sec-reviews" className="reveal" style={{ scrollMarginTop: 130 }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
              <h2 className="display" style={{ fontSize: "2rem" }}>Traveller reviews</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowReview(true)}><Icon name="plus" size={16} /> Write a review</button>
            </div>
            <div className="row gap-6" style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, marginBottom: 22, boxShadow: "var(--sh-sm)", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div className="display" style={{ fontSize: "3.4rem", color: "var(--ocean)" }}>{tour.rating}</div>
                <Stars value={tour.rating} size={18} />
                <div style={{ fontSize: "0.82rem", color: "var(--ink-3)", marginTop: 4 }}>{tour.reviews} reviews</div>
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                {[["Experience", 4.9], ["Value", 4.7], ["Guides", 5.0], ["Accommodation", 4.8]].map(([l, v]) => (
                  <div key={l} className="row gap-3" style={{ marginBottom: 8 }}>
                    <span style={{ width: 110, fontSize: "0.84rem", color: "var(--ink-2)", fontWeight: 600 }}>{l}</span>
                    <span style={{ flex: 1, height: 7, background: "var(--bg-2)", borderRadius: 4, overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: (v / 5 * 100) + "%", background: "var(--ocean)", borderRadius: 4 }} /></span>
                    <span style={{ fontSize: "0.84rem", fontWeight: 700, width: 28 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            {showReview && <ReviewForm tour={tour} onClose={() => setShowReview(false)} />}
            <div className="col gap-4">
              {reviews.length === 0 && <p style={{ color: "var(--ink-3)" }}>Be the first to review this journey.</p>}
              {reviews.map((r, i) => (
                <div key={i} className="card" style={{ padding: 22, boxShadow: "var(--sh-sm)", border: r.mine ? "1.5px solid var(--ocean)" : "none" }}>
                  <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                    <div className="row gap-3">
                      <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--ocean-tint)", color: "var(--ocean-deep)", display: "grid", placeItems: "center", fontWeight: 800 }}>{r.name[0]}</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>{r.name} {r.mine && <span className="badge badge-ocean" style={{ marginLeft: 6 }}>You</span>}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>{r.trip} · {r.date}</div>
                      </div>
                    </div>
                    <Stars value={r.rating} />
                  </div>
                  <h4 style={{ fontSize: "1.05rem", marginBottom: 6 }}>{r.title}</h4>
                  <p style={{ color: "var(--ink-2)", lineHeight: 1.6, fontSize: "0.96rem" }}>{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* sticky booking widget */}
        <aside className="book-aside" style={{ position: "sticky", top: 130 }}>
          <div className="card" style={{ padding: 24, boxShadow: "var(--sh-lg)" }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>from</span>
                <div className="row gap-2" style={{ alignItems: "baseline" }}>
                  <span className="display" style={{ fontSize: "2.4rem" }}>{fmtPrice(tour.price)}</span>
                  <span style={{ color: "var(--ink-3)", fontSize: "0.85rem" }}>/ person</span>
                </div>
              </div>
              {tour.oldPrice && <span className="badge badge-coral">Save {fmtPrice(tour.oldPrice - tour.price)}</span>}
            </div>
            <div className="hr" style={{ margin: "18px 0" }} />
            <div className="field" style={{ marginBottom: 14 }}>
              <label>Departure date</label>
              <select className="select" value={departure} onChange={(e) => setDeparture(e.target.value)}>
                {DEPARTURES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 18 }}>
              <label>Travellers</label>
              <div className="row" style={{ justifyContent: "space-between", background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--hairline-2)", borderRadius: "var(--r-sm)", padding: "8px 14px" }}>
                <span style={{ fontWeight: 600 }}>{travellers} {travellers === 1 ? "traveller" : "travellers"}</span>
                <div className="row gap-3">
                  <button onClick={() => setTravellers(Math.max(tour.groupMin, travellers - 1))} style={stepBtn} disabled={travellers <= tour.groupMin}><Icon name="minus" size={16} /></button>
                  <button onClick={() => setTravellers(Math.min(tour.groupMax, travellers + 1))} style={stepBtn} disabled={travellers >= tour.groupMax}><Icon name="plus" size={16} /></button>
                </div>
              </div>
            </div>
            <div className="col gap-2" style={{ background: "var(--bg-2)", borderRadius: "var(--r-sm)", padding: "14px 16px", marginBottom: 18 }}>
              <div className="row" style={{ justifyContent: "space-between", fontSize: "0.9rem" }}><span style={{ color: "var(--ink-2)" }}>{fmtPrice(tour.price)} × {travellers}</span><span style={{ fontWeight: 600 }}>{fmtPrice(total)}</span></div>
              <div className="row" style={{ justifyContent: "space-between", fontSize: "0.9rem" }}><span style={{ color: "var(--ink-2)" }}>Taxes & fees</span><span style={{ fontWeight: 600 }}>Included</span></div>
              <div className="hr" style={{ margin: "4px 0" }} />
              <div className="row" style={{ justifyContent: "space-between" }}><span style={{ fontWeight: 700 }}>Total</span><span style={{ fontWeight: 800, fontSize: "1.2rem" }}>{fmtPrice(total)}</span></div>
            </div>
            <button className="btn btn-primary btn-lg btn-block" onClick={() => go({ view: "booking", id: tour.id, travellers, departure })}>Reserve your place <Icon name="arrow" size={18} /></button>
            <p className="row gap-2" style={{ justifyContent: "center", color: "var(--ink-3)", fontSize: "0.8rem", marginTop: 12 }}><Icon name="shield" size={15} /> Free cancellation up to 60 days before</p>
          </div>
          <div className="row gap-3" style={{ marginTop: 14, justifyContent: "center", color: "var(--ink-2)", fontSize: "0.86rem", fontWeight: 600 }}>
            <Icon name="phone" size={16} style={{ color: "var(--ocean)" }} /> Questions? Call +1 (800) 555-0142
          </div>
        </aside>
      </div>

      {/* related */}
      <RelatedTours go={go} current={tour} />
    </div>
  );
}
const stepBtn = { width: 32, height: 32, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--ocean-tint)", color: "var(--ocean-deep)" };

function ReviewForm({ tour, onClose }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [name, setName] = useState(Store.get().user ? Store.get().user.name : "");
  const toast = useToast();
  const submit = () => {
    if (!title.trim() || !text.trim() || !name.trim()) { toast("Please fill in every field", "x"); return; }
    Store.addReview(tour.id, { name, rating, title, text, trip: "Verified traveller" });
    toast("Thanks — your review is live!", "checkC");
    onClose();
  };
  return (
    <div className="card anim-scale-in" style={{ padding: 24, marginBottom: 22, boxShadow: "var(--sh-md)", border: "1.5px solid var(--ocean-tint)" }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ fontSize: "1.2rem" }}>Share your experience</h3>
        <button onClick={onClose} style={{ color: "var(--ink-3)" }}><Icon name="x" size={20} /></button>
      </div>
      <div className="row gap-2" style={{ marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)}><Icon name="star" size={30} fill={n <= rating ? "current" : "none"} style={{ color: n <= rating ? "var(--gold)" : "var(--hairline-2)" }} strokeWidth={1.5} /></button>
        ))}
      </div>
      <div className="col gap-3">
        <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Headline (e.g. Trip of a lifetime)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="input" rows="3" placeholder="Tell others what made it special…" value={text} onChange={(e) => setText(e.target.value)} style={{ resize: "vertical" }} />
        <div className="row gap-3"><button className="btn btn-ocean" onClick={submit}>Post review</button><button className="btn btn-ghost" onClick={onClose}>Cancel</button></div>
      </div>
    </div>
  );
}

function RelatedTours({ go, current }) {
  const related = TOURS.filter((t) => t.id !== current.id && t.categories.some((c) => current.categories.includes(c))).slice(0, 3);
  if (!related.length) return null;
  return (
    <section style={{ background: "var(--bg-2)", padding: "70px 0" }}>
      <div className="wrap">
        <h2 className="display" style={{ fontSize: "2.2rem", marginBottom: 28 }}>You might also love</h2>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {related.map((t) => <TourCard key={t.id} tour={t} onOpen={(id) => go({ view: "tour", id })} />)}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { TourPage });
