/* =========================================================
   Oscar Travel — Tour detail page
   ========================================================= */

const DEPARTURES = ["14 Jun 2026", "12 Jul 2026", "9 Aug 2026", "13 Sep 2026", "11 Oct 2026"];

function TourPage({ go, route }) {
  const [tour, setTour] = useState(() => getTour(route.id));
  const ref = useReveal();
  const [tab, setTab] = useState("overview");
  const [openDay, setOpenDay] = useState(0);
  const [travellers, setTravellers] = useState(2);
  const departureDates = (tour?.departure_dates && tour.departure_dates.length > 0) ? tour.departure_dates : DEPARTURES;
  const [departure, setDeparture] = useState(departureDates[0]);
  const reviews = reviewsFor(tour ? tour.id : "");
  const [showReview, setShowReview] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    window.scrollTo(0, 0);
    const local = getTour(route.id);
    if (local) setTour(local);
    if (typeof SB !== "undefined" && SB.ok) {
      SB.tours.get(route.id).then((sb) => {
        if (sb) setTour(mergeTour(local, sb));
      }).catch(() => {});
    }
  }, [route.id]);
  /* Keep the selected departure valid when tour data arrives from the DB */
  useEffect(() => {
    setDeparture(d => departureDates.includes(d) ? d : departureDates[0]);
  }, [departureDates.join("|")]);
  useEffect(() => { if (typeof SB !== "undefined" && SB.ok && tour?.id) SB.tours.trackView(tour.id).catch(() => {}); }, [tour?.id]);
  if (!tour) return <div style={{ paddingTop: 120, textAlign: "center", color: "var(--ink-3)" }}>Loading…</div>;

  const price = tourPrice(tour);
  const oldP = tourOldPrice(tour);
  const total = price * travellers;
  const tabs = [
    ["overview", t("detail_overview")],
    ["itinerary", t("detail_itinerary")],
    ["included", t("detail_included_tab")],
    ["reviews", t("detail_reviews_tab") + " (" + reviews.length + ")"],
  ];

  const scrollTo = (id) => {
    setTab(id);
    const el = document.getElementById("sec-" + id);
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
  };

  return (
    <div ref={ref} style={{ paddingTop: 74 }}>
      <div className="wrap" style={{ paddingTop: 22 }}>
        <div className="row gap-2" style={{ color: "var(--ink-3)", fontSize: "0.85rem", fontWeight: 600, marginBottom: 14, flexWrap: "wrap" }}>
          <a href="#/" onClick={(e) => { e.preventDefault(); go({ view: "home" }); }} style={{ color: "var(--ocean)" }}>{t("detail_home")}</a>
          <Icon name="chevR" size={13} />
          <a href="#/journeys" onClick={(e) => { e.preventDefault(); go({ view: "listing" }); }} style={{ color: "var(--ocean)" }}>{t("detail_journeys")}</a>
          <Icon name="chevR" size={13} /> <span>{tour.title}</span>
        </div>
        {(() => {
          const mainImg = tour.image_url;
          const galleryUrls = tour.gallery_urls || [];
          const g1 = galleryUrls[0];
          const g2 = galleryUrls[1];
          const ImgCell = ({ src, theme, label, style, children }) => (
            <div style={{ position: "relative", overflow: "hidden", ...style }}>
              {src
                ? <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <Scenic theme={theme} label={label} style={{ width: "100%", height: "100%" }} />
              }
              {label && !src && <span style={{ position: "absolute", bottom: 10, left: 14, fontSize: "0.75rem", color: "white", fontWeight: 600, background: "oklch(0 0 0 / 0.4)", padding: "3px 8px", borderRadius: 6 }}>{label}</span>}
              {children}
            </div>
          );
          return (
            <div className="gallery" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "200px 200px", gap: 12, borderRadius: "var(--r-lg)", overflow: "hidden" }}>
              <ImgCell src={mainImg} theme={tour.theme} label={tour.place} style={{ gridRow: "span 2", height: "100%", minHeight: 412 }}>
                <div style={{ position: "absolute", top: 18, left: 18, display: "flex", gap: 8 }}>
                  {(tour.tags || tour.tags_json || []).slice(0, 2).map((tg) => <span key={tg} className="badge badge-glass">{tg}</span>)}
                </div>
              </ImgCell>
              <ImgCell src={g1 || null} theme="maldives" label="moment · two" style={{ height: "100%" }} />
              <ImgCell src={g2 || null} theme={tour.theme === "santorini" ? "sunset" : "ocean"} label="moment · three" style={{ height: "100%" }}>
                {galleryUrls.length > 0 && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowGallery(true)}
                    style={{ position: "absolute", right: 14, bottom: 14, background: "oklch(1 0 0 / 0.92)", color: "oklch(0.28 0.035 235)" }}>
                    <Icon name="camera" size={16} /> +{galleryUrls.length + (mainImg ? 1 : 0)} {t("detail_photos")}
                  </button>
                )}
              </ImgCell>
            </div>
          );
        })()}
        {showGallery && <GalleryLightbox tour={tour} onClose={() => setShowGallery(false)} />}
      </div>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 460px" }}>
            <div className="row gap-3" style={{ marginBottom: 10, flexWrap: "wrap" }}>
              <span className="badge badge-ocean"><Icon name="pin" size={13} /> {tour.region}</span>
              <span className="row gap-2" style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                <Stars value={tour.rating} /> {tour.rating} <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>· {tour.reviews} {t("detail_reviews_tab").toLowerCase()}</span>
              </span>
            </div>
            <h1 className="display" style={{ fontSize: "clamp(2.2rem, 4.4vw, 3.6rem)", lineHeight: 1 }}>{tour.title}</h1>
            <p style={{ color: "var(--ink-2)", fontSize: "1.1rem", marginTop: 14, maxWidth: 640, lineHeight: 1.55 }}>{tour.blurb}</p>
            <div className="row gap-4" style={{ marginTop: 22, flexWrap: "wrap" }}>
              {[
                ["clock", tour.days + " " + t("detail_days") ],
                ["users", (tour.group_max || tour.groupMax) <= 2 ? t("detail_private_j") : "Max " + (tour.group_max || tour.groupMax || 12) + " " + t("detail_travellers")],
                ["mountain", tour.difficulty],
                ["globe", (tour.season || tour.pace || t("detail_year_round"))],
              ].map(([ic, l]) => (
                <span key={l} className="row gap-2" style={{ fontWeight: 600, color: "var(--ink-2)", fontSize: "0.92rem" }}><Icon name={ic} size={18} style={{ color: "var(--ocean)" }} /> {l}</span>
              ))}
            </div>
          </div>
          <div className="row gap-3"><SaveButton tourId={tour.id} big /></div>
        </div>
      </div>

      <div className="sticky-tabs" style={{ position: "sticky", top: 74, zIndex: 40, background: "var(--nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--hairline)", marginTop: 28 }}>
        <div className="wrap row gap-6" style={{ height: 58 }}>
          {tabs.map(([id, l]) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ fontWeight: 700, fontSize: "0.92rem", color: tab === id ? "var(--ocean)" : "var(--ink-2)", height: "100%", borderBottom: tab === id ? "2.5px solid var(--ocean)" : "2.5px solid transparent", transition: "all 0.3s" }}>{l}</button>
          ))}
        </div>
      </div>

      <div className="wrap detail-body" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, padding: "44px 28px 90px", alignItems: "start" }}>
        <div className="col gap-8">
          <section id="sec-overview" className="reveal" style={{ scrollMarginTop: 130 }}>
            <h2 className="display" style={{ fontSize: "2rem", marginBottom: 16 }}>{t("detail_exp_h")}</h2>
            <p style={{ color: "var(--ink-2)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: 26 }}>{tour.blurb} {t("detail_exp_body")}</p>
            <h3 style={{ fontSize: "1.25rem", marginBottom: 16 }}>{t("detail_highlights")}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {(tour.highlights || []).map((h, i) => (
                <div key={i} className="row gap-3" style={{ alignItems: "flex-start", background: "var(--surface)", padding: "16px 18px", borderRadius: "var(--r-sm)", boxShadow: "var(--sh-sm)" }}>
                  <span style={{ flexShrink: 0, color: "var(--coral)", marginTop: 1 }}><Icon name="sparkle" size={20} fill="current" /></span>
                  <span style={{ fontWeight: 600, fontSize: "0.94rem", lineHeight: 1.45 }}>{h}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="sec-itinerary" className="reveal" style={{ scrollMarginTop: 130 }}>
            <h2 className="display" style={{ fontSize: "2rem", marginBottom: 6 }}>{t("detail_day_h")}</h2>
            <p style={{ color: "var(--ink-3)", marginBottom: 22 }}>{tour.days}-{t("detail_day_sub")}</p>
            <div style={{ position: "relative", paddingLeft: 4 }}>
              {(tour.itinerary || []).map((d, i) => {
                const open = openDay === i;
                return (
                  <div key={i} style={{ display: "flex", gap: 18 }}>
                    <div className="col" style={{ alignItems: "center", flexShrink: 0 }}>
                      <span style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "0.82rem", background: open ? "var(--ocean)" : "var(--ocean-tint)", color: open ? "white" : "var(--ocean-deep)", transition: "all 0.3s", zIndex: 2 }}>{i + 1}</span>
                      {i < (tour.itinerary || []).length - 1 && <span style={{ width: 2, flex: 1, background: "var(--hairline)", minHeight: 20 }} />}
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

          <section id="sec-included" className="reveal" style={{ scrollMarginTop: 130 }}>
            <h2 className="display" style={{ fontSize: "2rem", marginBottom: 22 }}>{t("detail_inc_h")}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
              <div>
                <h4 className="row gap-2" style={{ fontSize: "1rem", marginBottom: 14, color: "var(--ocean-deep)" }}><Icon name="checkC" size={20} /> {t("detail_inc_yes")}</h4>
                <div className="col gap-3">
                  {(tour.included || tour.included_json || []).map((x) => (
                    <div key={x} className="row gap-3"><span style={{ color: "var(--ocean)", flexShrink: 0 }}><Icon name="check" size={18} strokeWidth={2.5} /></span><span style={{ fontSize: "0.94rem", color: "var(--ink-2)" }}>{x}</span></div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="row gap-2" style={{ fontSize: "1rem", marginBottom: 14, color: "var(--ink-3)" }}><Icon name="x" size={18} /> {t("detail_inc_no")}</h4>
                <div className="col gap-3">
                  {(tour.excluded || tour.notIncluded || tour.excluded_json || []).map((x) => (
                    <div key={x} className="row gap-3"><span style={{ color: "var(--ink-3)", flexShrink: 0 }}><Icon name="minus" size={18} /></span><span style={{ fontSize: "0.94rem", color: "var(--ink-3)" }}>{x}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="sec-reviews" className="reveal" style={{ scrollMarginTop: 130 }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
              <h2 className="display" style={{ fontSize: "2rem" }}>{t("detail_rev_h")}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowReview(true)}><Icon name="plus" size={16} /> {t("detail_write")}</button>
            </div>
            <div className="row gap-6" style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: 24, marginBottom: 22, boxShadow: "var(--sh-sm)", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div className="display" style={{ fontSize: "3.4rem", color: "var(--ocean)" }}>{tour.rating}</div>
                <Stars value={tour.rating} size={18} />
                <div style={{ fontSize: "0.82rem", color: "var(--ink-3)", marginTop: 4 }}>{tour.reviews} {t("detail_reviews_tab").toLowerCase()}</div>
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                {[[t("detail_exp_l"), 4.9], [t("detail_val_l"), 4.7], [t("detail_guides_l"), 5.0], [t("detail_acc_l"), 4.8]].map(([l, v]) => (
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
              {reviews.length === 0 && <p style={{ color: "var(--ink-3)" }}>{t("detail_be_first")}</p>}
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

        <aside className="book-aside" style={{ position: "sticky", top: 130 }}>
          <div className="card" style={{ padding: 24, boxShadow: "var(--sh-lg)" }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>{t("detail_from")}</span>
                <div className="row gap-2" style={{ alignItems: "baseline" }}>
                  <span className="display" style={{ fontSize: "2.4rem" }}>{fmtPrice(price)}</span>
                  {oldP && <span style={{ color: "var(--ink-3)", textDecoration: "line-through", fontSize: "0.95rem" }}>{fmtPrice(oldP)}</span>}
                  <span style={{ color: "var(--ink-3)", fontSize: "0.85rem" }}>{t("detail_person")}</span>
                </div>
              </div>
              {oldP && <span className="badge badge-coral">{t("save_badge")} {fmtPrice(oldP - price)}</span>}
            </div>
            <div className="hr" style={{ margin: "18px 0" }} />
            <div className="field" style={{ marginBottom: 14 }}>
              <label>{t("detail_depart")}</label>
              <select className="select" value={departure} onChange={(e) => setDeparture(e.target.value)}>
                {departureDates.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 18 }}>
              <label>{t("detail_travellers")}</label>
              <div className="row" style={{ justifyContent: "space-between", background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--hairline-2)", borderRadius: "var(--r-sm)", padding: "8px 14px" }}>
                <span style={{ fontWeight: 600 }}>{travellers} {travellers === 1 ? t("detail_traveller") : t("detail_travellers")}</span>
                <div className="row gap-3">
                  <button onClick={() => setTravellers(Math.max(tour.group_min || tour.groupMin || 1, travellers - 1))} style={stepBtn} disabled={travellers <= (tour.group_min || tour.groupMin || 1)}><Icon name="minus" size={16} /></button>
                  <button onClick={() => setTravellers(Math.min(tour.group_max || tour.groupMax || 20, travellers + 1))} style={stepBtn} disabled={travellers >= (tour.group_max || tour.groupMax || 20)}><Icon name="plus" size={16} /></button>
                </div>
              </div>
            </div>
            <div className="col gap-2" style={{ background: "var(--bg-2)", borderRadius: "var(--r-sm)", padding: "14px 16px", marginBottom: 18 }}>
              <div className="row" style={{ justifyContent: "space-between", fontSize: "0.9rem" }}><span style={{ color: "var(--ink-2)" }}>{fmtPrice(price)} × {travellers}</span><span style={{ fontWeight: 600 }}>{fmtPrice(total)}</span></div>
              <div className="row" style={{ justifyContent: "space-between", fontSize: "0.9rem" }}><span style={{ color: "var(--ink-2)" }}>{t("detail_taxes")}</span><span style={{ fontWeight: 600 }}>{t("detail_included_tab")}</span></div>
              <div className="hr" style={{ margin: "4px 0" }} />
              <div className="row" style={{ justifyContent: "space-between" }}><span style={{ fontWeight: 700 }}>{t("detail_total")}</span><span style={{ fontWeight: 800, fontSize: "1.2rem" }}>{fmtPrice(total)}</span></div>
            </div>
            <button className="btn btn-primary btn-lg btn-block" onClick={() => go({ view: "booking", id: tour.id, travellers, departure })}>{t("detail_reserve")} <Icon name="arrow" size={18} /></button>
            <p className="row gap-2" style={{ justifyContent: "center", color: "var(--ink-3)", fontSize: "0.8rem", marginTop: 12 }}><Icon name="shield" size={15} /> {t("detail_cancel_note")}</p>
          </div>
          <a href={waHref()} target="_blank" rel="noopener" className="row gap-3"
            style={{ marginTop: 14, justifyContent: "center", color: "var(--ink-2)", fontSize: "0.86rem", fontWeight: 600 }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#25D366", color: "white", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="phone" size={13} /></span>
            {t("detail_call")} {DEFAULT_WHATSAPP}
          </a>
          <InquiryForm tour={tour} />
        </aside>
      </div>

      <RelatedTours go={go} current={tour} />
    </div>
  );
}

const stepBtn = { width: 32, height: 32, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--ocean-tint)", color: "var(--ocean-deep)" };

/* Fullscreen gallery viewer for tour photos */
function GalleryLightbox({ tour, onClose }) {
  const images = [tour.image_url, ...(tour.gallery_urls || [])].filter(Boolean);
  const [i, setI] = useState(0);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI(x => (x + 1) % images.length);
      if (e.key === "ArrowLeft") setI(x => (x - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [images.length]);
  if (!images.length) return null;
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 950, background: "oklch(0.08 0.01 235 / 0.92)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <button onClick={onClose} aria-label="Close gallery" style={{ position: "absolute", top: 18, right: 20, width: 42, height: 42, borderRadius: "50%", background: "oklch(1 0 0 / 0.12)", color: "white", display: "grid", placeItems: "center" }}><Icon name="x" size={20} /></button>
      <img src={images[i]} alt={tour.title} className="anim-scale-in" style={{ maxWidth: "88vw", maxHeight: "76vh", borderRadius: 14, objectFit: "contain", boxShadow: "var(--sh-xl)" }} />
      <div className="row gap-4" style={{ marginTop: 20 }}>
        <button onClick={() => setI(x => (x - 1 + images.length) % images.length)} aria-label="Previous photo" style={{ width: 44, height: 44, borderRadius: "50%", background: "oklch(1 0 0 / 0.14)", color: "white", display: "grid", placeItems: "center" }}><Icon name="arrowL" size={20} /></button>
        <span style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", minWidth: 60, textAlign: "center" }}>{i + 1} / {images.length}</span>
        <button onClick={() => setI(x => (x + 1) % images.length)} aria-label="Next photo" style={{ width: 44, height: 44, borderRadius: "50%", background: "oklch(1 0 0 / 0.14)", color: "white", display: "grid", placeItems: "center" }}><Icon name="arrow" size={20} /></button>
      </div>
    </div>
  );
}

function ReviewForm({ tour, onClose }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [name, setName] = useState(Store.get().user ? Store.get().user.name : "");
  const toast = useToast();
  const { t } = useI18n();
  const submit = () => {
    if (!title.trim() || !text.trim() || !name.trim()) { toast("Please fill in every field", "x"); return; }
    Store.addReview(tour.id, { name, rating, title, text, trip: "Verified traveller" });
    toast("Thanks — your review is live!", "checkC");
    onClose();
  };
  return (
    <div className="card anim-scale-in" style={{ padding: 24, marginBottom: 22, boxShadow: "var(--sh-md)", border: "1.5px solid var(--ocean-tint)" }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ fontSize: "1.2rem" }}>{t("rev_share")}</h3>
        <button onClick={onClose} style={{ color: "var(--ink-3)" }}><Icon name="x" size={20} /></button>
      </div>
      <div className="row gap-2" style={{ marginBottom: 16 }}>
        {[1,2,3,4,5].map((n) => (
          <button key={n} onClick={() => setRating(n)}><Icon name="star" size={30} fill={n <= rating ? "current" : "none"} style={{ color: n <= rating ? "var(--gold)" : "var(--hairline-2)" }} strokeWidth={1.5} /></button>
        ))}
      </div>
      <div className="col gap-3">
        <input className="input" placeholder={t("rev_name")} value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder={t("rev_headline")} value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="input" rows="3" placeholder={t("rev_text")} value={text} onChange={(e) => setText(e.target.value)} style={{ resize: "vertical" }} />
        <div className="row gap-3"><button className="btn btn-ocean" onClick={submit}>{t("rev_post")}</button><button className="btn btn-ghost" onClick={onClose}>{t("rev_cancel")}</button></div>
      </div>
    </div>
  );
}

function InquiryForm({ tour }) {
  const user = Store.get().user;
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim() || !msg.trim()) { toast("Please fill in name, email and message", "x"); return; }
    setLoading(true);
    try {
      if (typeof SB !== "undefined" && SB.ok) {
        await SB.inquiries.create({ tour_id: tour.id, tour_title: tour.title, name: name.trim(), email: email.trim(), phone: phone.trim(), message: msg.trim() });
      }
      toast("Inquiry sent! We'll be in touch soon.", "checkC");
      setMsg(""); setPhone(""); setOpen(false);
    } catch (e) {
      toast("Failed to send — please try again", "x");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: 16, padding: 20, boxShadow: "var(--sh-sm)" }}>
      <button className="row gap-2" style={{ width: "100%", justifyContent: "space-between", fontWeight: 700, fontSize: "0.95rem" }} onClick={() => setOpen(o => !o)}>
        <span className="row gap-2"><Icon name="mail" size={17} style={{ color: "var(--ocean)" }} /> Have a question?</span>
        <Icon name={open ? "chevD" : "chevR"} size={16} style={{ color: "var(--ink-3)", transform: open ? "rotate(0deg)" : "none" }} />
      </button>
      {open && (
        <div className="col gap-3 anim-scale-in" style={{ marginTop: 16 }}>
          <input className="input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} />
          <textarea className="input" rows="3" placeholder="Your message…" value={msg} onChange={e => setMsg(e.target.value)} style={{ resize: "vertical" }} />
          <button className="btn btn-ocean btn-block" onClick={submit} disabled={loading}>{loading ? "Sending…" : "Send Inquiry"}</button>
        </div>
      )}
    </div>
  );
}

function RelatedTours({ go, current }) {
  const { t } = useI18n();
  const curCats = current.categories || (current.category ? [current.category] : []);
  const related = TOURS.filter((tr) => {
    if (tr.id === current.id) return false;
    const trCats = tr.categories || (tr.category ? [tr.category] : []);
    return trCats.some((c) => curCats.includes(c));
  }).slice(0, 3);
  if (!related.length) return null;
  return (
    <section style={{ background: "var(--bg-2)", padding: "70px 0" }}>
      <div className="wrap">
        <h2 className="display" style={{ fontSize: "2.2rem", marginBottom: 28 }}>{t("detail_also_love")}</h2>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {related.map((tr) => <TourCard key={tr.id} tour={tr} onOpen={(id) => go({ view: "tour", id })} />)}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { TourPage });
