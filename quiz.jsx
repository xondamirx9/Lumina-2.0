/* =========================================================
   Oscar Travel — Journey Finder
   A 4-question quiz that scores every tour and recommends
   the best matches with a match percentage.
   ========================================================= */

const QUIZ_QUESTIONS = [
  {
    id: "vibe", labelKey: "quiz_q_vibe",
    options: [
      { v: "relax",     icon: "sun",      key: "quiz_relax" },
      { v: "adventure", icon: "mountain", key: "quiz_adventure" },
      { v: "culture",   icon: "landmark", key: "quiz_culture" },
      { v: "romance",   icon: "heart",    key: "quiz_romance" },
    ],
  },
  {
    id: "scenery", labelKey: "quiz_q_scenery",
    options: [
      { v: "sea",       icon: "ship",     key: "quiz_sea" },
      { v: "mountains", icon: "mountain", key: "quiz_mountains" },
      { v: "desert",    icon: "sun",      key: "quiz_desert" },
      { v: "city",      icon: "building", key: "quiz_city" },
      { v: "north",     icon: "globe",    key: "quiz_north" },
    ],
  },
  {
    id: "length", labelKey: "quiz_q_length",
    options: [
      { v: "short", icon: "clock", key: "quiz_short" },
      { v: "mid",   icon: "clock", key: "quiz_mid" },
      { v: "long",  icon: "clock", key: "quiz_long" },
    ],
  },
  {
    id: "budget", labelKey: "quiz_q_budget",
    options: [
      { v: "low",  icon: "tag",     key: "quiz_low" },
      { v: "mid",  icon: "tag",     key: "quiz_midb" },
      { v: "high", icon: "diamond", key: "quiz_high" },
    ],
  },
];

const QUIZ_SCENERY_THEMES = {
  sea:       ["santorini", "maldives", "amalfi", "bali", "norway", "ocean", "sunset", "venice"],
  mountains: ["patagonia", "peru", "iceland", "alps", "machu"],
  desert:    ["marrakech", "dubai", "desert", "cappadocia", "petra"],
  city:      ["kyoto", "dubai", "city", "tokyo", "venice", "amalfi"],
  north:     ["iceland", "norway", "arctic"],
};

function scoreQuizTour(tour, ans) {
  const cats = tour.categories || (tour.category ? [tour.category] : []);
  const gmax = tour.group_max || tour.groupMax || 12;
  let s = 0;

  // 1 — vibe
  if (ans.vibe === "relax"     && (tour.difficulty === "Easy" || cats.includes("luxury") || cats.includes("cruise"))) s += 1;
  if (ans.vibe === "adventure" && (cats.includes("adventure") || tour.difficulty === "Challenging" || tour.difficulty === "Strenuous")) s += 1;
  if (ans.vibe === "culture"   && (cats.includes("cultural") || cats.includes("city"))) s += 1;
  if (ans.vibe === "romance"   && (gmax <= 6 || cats.includes("luxury"))) s += 1;

  // 2 — scenery via theme
  if ((QUIZ_SCENERY_THEMES[ans.scenery] || []).includes(tour.theme)) s += 1;

  // 3 — trip length (adjacent band earns half credit)
  const days = Number(tour.days) || 7;
  const band = days <= 6 ? "short" : days <= 8 ? "mid" : "long";
  if (band === ans.length) s += 1;
  else if (band === "mid" || ans.length === "mid") s += 0.5;

  // 4 — budget (adjacent band earns half credit)
  const p = tourPrice(tour);
  const pband = p < 3200 ? "low" : p <= 4600 ? "mid" : "high";
  if (pband === ans.budget) s += 1;
  else if (pband === "mid" || ans.budget === "mid") s += 0.5;

  return s / 4;
}

function JourneyFinder({ go, onClose }) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [tours, setTours] = useState(TOURS);

  useEffect(() => {
    if (typeof SB !== "undefined" && SB.ok) {
      SB.tours.list().then((rows) => {
        if (rows && rows.length) setTours(mergeTours(rows));
      }).catch(() => {});
    }
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);

  const done = step >= QUIZ_QUESTIONS.length;
  const q = QUIZ_QUESTIONS[step];

  const pick = (v) => {
    setAnswers((a) => ({ ...a, [q.id]: v }));
    setStep(step + 1);
  };
  const restart = () => { setAnswers({}); setStep(0); };

  const results = done
    ? tours
        .map((tour) => ({ tour, score: scoreQuizTour(tour, answers) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .filter((r) => r.score > 0)
    : [];

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 920, background: "oklch(0.1 0.02 235 / 0.6)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 18, overflowY: "auto" }}>
      <div className="card anim-scale-in" style={{ width: "100%", maxWidth: done ? 980 : 620, padding: "30px 30px 34px", boxShadow: "var(--sh-xl)", maxHeight: "92vh", overflowY: "auto" }}>
        {/* Header */}
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <span className="eyebrow">{t("quiz_title")}</span>
            <h2 className="display" style={{ fontSize: "1.9rem", marginTop: 6 }}>{done ? t("quiz_results") : t(q.labelKey)}</h2>
          </div>
          <button onClick={onClose} aria-label="Close quiz" style={{ color: "var(--ink-3)", flexShrink: 0, padding: 4 }}><Icon name="x" size={22} /></button>
        </div>

        {/* Progress */}
        <div className="row gap-2" style={{ margin: "10px 0 24px" }}>
          {QUIZ_QUESTIONS.map((_, i) => (
            <span key={i} style={{ height: 5, flex: 1, borderRadius: 4, background: i < step || done ? "var(--ocean)" : i === step ? "var(--coral)" : "var(--hairline)", transition: "background 0.4s" }} />
          ))}
        </div>

        {!done ? (
          <>
            <div className="quiz-options" style={{ display: "grid", gridTemplateColumns: q.options.length > 4 ? "repeat(3, 1fr)" : "repeat(2, 1fr)", gap: 12 }}>
              {q.options.map((o) => (
                <button key={o.v} className="quiz-option" onClick={() => pick(o.v)}>
                  <span className="quiz-option-icon"><Icon name={o.icon} size={24} /></span>
                  <span style={{ fontWeight: 700, fontSize: "0.94rem" }}>{t(o.key)}</span>
                </button>
              ))}
            </div>
            {step > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => setStep(step - 1)} style={{ marginTop: 20 }}>
                <Icon name="arrowL" size={15} /> {t("quiz_back")}
              </button>
            )}
          </>
        ) : (
          <>
            {results.length === 0 ? (
              <p style={{ color: "var(--ink-2)", padding: "20px 0" }}>{t("quiz_none")}</p>
            ) : (
              <div className="quiz-results" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(results.length, 3)}, 1fr)`, gap: 18 }}>
                {results.map(({ tour, score }) => (
                  <TourCard key={tour.id} tour={tour} matchPct={Math.round(score * 100)}
                    onOpen={(id) => { onClose(); go({ view: "tour", id }); }} />
                ))}
              </div>
            )}
            <div className="row gap-3" style={{ justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
              <button className="btn btn-ghost" onClick={restart}><Icon name="arrowL" size={16} /> {t("quiz_restart")}</button>
              <button className="btn btn-primary" onClick={() => { onClose(); go({ view: "listing" }); }}>{t("featured_browse")} <Icon name="arrow" size={16} /></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { JourneyFinder });
