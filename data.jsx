/* =========================================================
   Lumina Voyages — Mock backend
   Tour catalogue, reviews, and a localStorage-backed store
   that simulates a real persistence layer.
   ========================================================= */

const CATEGORIES = [
  { id: "all",      label: "All journeys", icon: "compass" },
  { id: "luxury",   label: "Luxury & private", icon: "diamond" },
  { id: "adventure",label: "Adventure", icon: "mountain" },
  { id: "group",    label: "Guided group", icon: "users" },
  { id: "city",     label: "City breaks", icon: "building" },
  { id: "cruise",   label: "Cruises", icon: "ship" },
  { id: "cultural", label: "Cultural", icon: "landmark" },
];

const TOURS = [
  {
    id: "santorini-cyclades",
    title: "Cyclades by Private Sail",
    place: "Santorini, Greece",
    region: "Mediterranean",
    theme: "santorini",
    categories: ["luxury", "cruise"],
    days: 8, nights: 7,
    price: 4280, oldPrice: 4790,
    rating: 4.9, reviews: 214,
    groupMin: 2, groupMax: 8,
    difficulty: "Easy",
    pace: "Relaxed",
    blurb: "Drift between whitewashed cliffside villages and hidden caldera coves aboard a crewed catamaran.",
    tags: ["Private yacht", "Sunset dining", "Snorkelling"],
    highlights: [
      "Sail the caldera at golden hour with a private skipper",
      "Wine tasting on volcanic Assyrtiko vineyards",
      "Swim the hot springs of Palea Kameni",
      "Two nights in a cave suite above Oia",
    ],
    itinerary: [
      { d: "Day 1", t: "Arrive in Santorini", x: "Private transfer to your caldera-view suite, welcome dinner at sunset." },
      { d: "Day 2", t: "Board the catamaran", x: "Set sail along the volcanic coast, swim stops and a lunch of fresh-caught fish." },
      { d: "Day 3", t: "Thirassia & hot springs", x: "Snorkel the red beach, soak in the geothermal springs, anchor under the stars." },
      { d: "Day 4", t: "Ios & hidden coves", x: "Explore secluded bays only reachable by boat, paddleboard the turquoise shallows." },
      { d: "Day 5", t: "Naxos", x: "Wander marble villages and olive groves, taste citron liqueur with locals." },
      { d: "Day 6", t: "Vineyards of Santorini", x: "Return to land; private tour of cliff-clinging vineyards and a chef's table." },
      { d: "Day 7", t: "Oia at leisure", x: "Spa morning, free afternoon to explore the lanes, farewell feast above the sea." },
      { d: "Day 8", t: "Departure", x: "Leisurely breakfast and private transfer to the airport." },
    ],
    included: ["7 nights accommodation", "Private crewed catamaran (3 days)", "Daily breakfast + 5 dinners", "All transfers", "Local expert host"],
    notIncluded: ["International flights", "Travel insurance", "Personal expenses"],
    featured: true, popular: true,
  },
  {
    id: "maldives-atolls",
    title: "Maldives Overwater Escape",
    place: "Baa Atoll, Maldives",
    region: "Indian Ocean",
    theme: "maldives",
    categories: ["luxury"],
    days: 6, nights: 5,
    price: 5640, oldPrice: null,
    rating: 5.0, reviews: 168,
    groupMin: 2, groupMax: 2,
    difficulty: "Easy",
    pace: "Relaxed",
    blurb: "An overwater villa, a private reef, and a marine biologist guiding you through a UNESCO biosphere.",
    tags: ["Overwater villa", "Couples", "Diving"],
    highlights: [
      "Private overwater villa with glass floor and infinity plunge pool",
      "Swim with manta rays in Hanifaru Bay",
      "Candlelit sandbank dinner for two",
      "Guided night dive over a bioluminescent reef",
    ],
    itinerary: [
      { d: "Day 1", t: "Seaplane arrival", x: "Scenic seaplane to the atoll, settle into your overwater villa." },
      { d: "Day 2", t: "Reef discovery", x: "Private snorkel safari with a resident marine biologist." },
      { d: "Day 3", t: "Hanifaru Bay", x: "Boat to the manta aggregation site, afternoon spa overwater." },
      { d: "Day 4", t: "Sandbank day", x: "Castaway picnic on a private sandbank, sunset dolphin cruise." },
      { d: "Day 5", t: "At leisure", x: "Free day; optional dive certification or simply unwind." },
      { d: "Day 6", t: "Departure", x: "Seaplane back to Malé for your onward flight." },
    ],
    included: ["5 nights overwater villa", "Seaplane transfers", "All meals + house drinks", "2 guided dives", "Spa credit"],
    notIncluded: ["International flights", "Premium spirits", "Travel insurance"],
    featured: true, popular: true,
  },
  {
    id: "patagonia-trek",
    title: "Patagonia: Towers of Paine",
    place: "Torres del Paine, Chile",
    region: "South America",
    theme: "patagonia",
    categories: ["adventure", "group"],
    days: 9, nights: 8,
    price: 3490, oldPrice: 3890,
    rating: 4.8, reviews: 302,
    groupMin: 4, groupMax: 12,
    difficulty: "Challenging",
    pace: "Active",
    blurb: "Trek the legendary W circuit beneath granite spires, glacial lakes and roaming guanacos.",
    tags: ["Hiking", "Small group", "Glaciers"],
    highlights: [
      "Hike to the base of the Torres at sunrise",
      "Navigate Grey Glacier by zodiac",
      "Stay in eco-domes under dark Patagonian skies",
      "Spot condors, guanacos and the elusive puma",
    ],
    itinerary: [
      { d: "Day 1", t: "Punta Arenas", x: "Group welcome, gear check and briefing with your mountain guide." },
      { d: "Day 2", t: "Into the park", x: "Drive to Torres del Paine, first acclimatising walk to a lookout." },
      { d: "Day 3", t: "Base of the Towers", x: "The iconic ascent to the granite towers and glacial lagoon." },
      { d: "Day 4", t: "French Valley", x: "Trek into the hanging glacier amphitheatre." },
      { d: "Day 5", t: "Grey Glacier", x: "Zodiac among icebergs at the face of the glacier." },
      { d: "Day 6", t: "Lake Pehoé", x: "Lower-mileage day, kayaking and wildlife photography." },
      { d: "Day 7", t: "Estancia day", x: "Traditional Patagonian asado and horseback option." },
      { d: "Day 8", t: "Free exploration", x: "Choose your own trail or rest before the journey home." },
      { d: "Day 9", t: "Departure", x: "Transfer back to Punta Arenas for onward flights." },
    ],
    included: ["8 nights (lodges + eco-domes)", "Certified mountain guides", "All meals on trek", "Park fees & transfers", "Technical gear"],
    notIncluded: ["Flights to Punta Arenas", "Sleeping bag hire", "Tips"],
    featured: true, popular: true,
  },
  {
    id: "kyoto-cultural",
    title: "Kyoto & the Old Roads",
    place: "Kyoto, Japan",
    region: "Asia",
    theme: "kyoto",
    categories: ["cultural", "group"],
    days: 7, nights: 6,
    price: 3980, oldPrice: null,
    rating: 4.9, reviews: 187,
    groupMin: 2, groupMax: 10,
    difficulty: "Moderate",
    pace: "Balanced",
    blurb: "Temples at dawn, a tea ceremony with a master, and a walk of the ancient Nakasendo trail.",
    tags: ["Temples", "Tea ceremony", "Heritage"],
    highlights: [
      "Private dawn visit to Fushimi Inari's torii gates",
      "Tea ceremony with a 15th-generation master",
      "Walk a preserved stretch of the Nakasendo road",
      "Kaiseki dinner in a Gion machiya townhouse",
    ],
    itinerary: [
      { d: "Day 1", t: "Arrive Kyoto", x: "Settle into a traditional ryokan, evening stroll through Pontocho." },
      { d: "Day 2", t: "Eastern temples", x: "Kiyomizu-dera and the philosopher's path with a local historian." },
      { d: "Day 3", t: "Arashiyama", x: "Bamboo grove at dawn, monkey park and a riverside lunch." },
      { d: "Day 4", t: "Tea & craft", x: "Tea ceremony, indigo dyeing workshop, Gion kaiseki dinner." },
      { d: "Day 5", t: "Nakasendo", x: "Train to Magome, walk the old post road to Tsumago." },
      { d: "Day 6", t: "Nara day trip", x: "Great Buddha, sacred deer park, free evening in Kyoto." },
      { d: "Day 7", t: "Departure", x: "Morning at leisure, transfer to the station or airport." },
    ],
    included: ["6 nights (ryokan + hotel)", "English-speaking cultural guide", "Daily breakfast + 3 dinners", "All rail & transfers", "Workshops & ceremonies"],
    notIncluded: ["International flights", "Lunches", "Travel insurance"],
    featured: false, popular: true,
  },
  {
    id: "amalfi-coast",
    title: "Amalfi Coast in Bloom",
    place: "Amalfi, Italy",
    region: "Mediterranean",
    theme: "amalfi",
    categories: ["luxury", "city"],
    days: 6, nights: 5,
    price: 3760, oldPrice: 4120,
    rating: 4.8, reviews: 241,
    groupMin: 2, groupMax: 6,
    difficulty: "Easy",
    pace: "Relaxed",
    blurb: "Lemon groves, cliffside terraces and a private boat day along Italy's most romantic coast.",
    tags: ["Couples", "Boat day", "Food"],
    highlights: [
      "Private gozzo boat day to Capri's blue grotto",
      "Pasta masterclass in a Ravello villa",
      "Walk the Path of the Gods above the sea",
      "Limoncello tasting in a family lemon grove",
    ],
    itinerary: [
      { d: "Day 1", t: "Arrive Positano", x: "Transfer to your cliffside hotel, aperitivo over the bay." },
      { d: "Day 2", t: "Path of the Gods", x: "Guided coastal ridge walk, lunch in Nocelle." },
      { d: "Day 3", t: "Capri by boat", x: "Private gozzo to the grotto, swim stops and seaside lunch." },
      { d: "Day 4", t: "Ravello", x: "Villa gardens, a pasta masterclass and a classical concert." },
      { d: "Day 5", t: "Amalfi & Atrani", x: "Cathedral, paper museum and free afternoon." },
      { d: "Day 6", t: "Departure", x: "Breakfast and transfer to Naples." },
    ],
    included: ["5 nights boutique hotel", "Private boat day", "Daily breakfast + 2 dinners", "Cooking class", "All transfers"],
    notIncluded: ["Flights", "Some lunches", "City taxes"],
    featured: false, popular: true,
  },
  {
    id: "marrakech-desert",
    title: "Marrakech & the Sahara",
    place: "Marrakech, Morocco",
    region: "Africa",
    theme: "marrakech",
    categories: ["adventure", "cultural"],
    days: 7, nights: 6,
    price: 2680, oldPrice: null,
    rating: 4.7, reviews: 196,
    groupMin: 2, groupMax: 12,
    difficulty: "Moderate",
    pace: "Balanced",
    blurb: "Souks and riads, the High Atlas, and a night beneath the Milky Way in a luxury desert camp.",
    tags: ["Desert camp", "Souks", "Atlas Mountains"],
    highlights: [
      "Camel trek into the Erg Chebbi dunes at sunset",
      "Stay in a luxury tented camp under the stars",
      "Cross the High Atlas via the Tizi n'Tichka pass",
      "Guided food crawl through the Marrakech medina",
    ],
    itinerary: [
      { d: "Day 1", t: "Marrakech medina", x: "Check into a riad, evening in the Jemaa el-Fnaa square." },
      { d: "Day 2", t: "Souks & gardens", x: "Guided medina walk, Majorelle garden, rooftop dinner." },
      { d: "Day 3", t: "High Atlas", x: "Drive over the mountains to the gateway of the desert." },
      { d: "Day 4", t: "Into the Sahara", x: "Camel trek into the dunes, night in a luxury camp." },
      { d: "Day 5", t: "Desert dawn", x: "Sunrise over the dunes, return via gorges and kasbahs." },
      { d: "Day 6", t: "Aït Benhaddou", x: "Explore the fortified village, return to Marrakech." },
      { d: "Day 7", t: "Departure", x: "Free morning, transfer to the airport." },
    ],
    included: ["6 nights (riads + desert camp)", "Private driver-guide", "Daily breakfast + 4 dinners", "Camel trek", "All entries"],
    notIncluded: ["Flights", "Lunches", "Tips"],
    featured: false, popular: false,
  },
  {
    id: "iceland-ring",
    title: "Iceland Ring of Fire & Ice",
    place: "Reykjavík, Iceland",
    region: "Nordic",
    theme: "iceland",
    categories: ["adventure", "group"],
    days: 8, nights: 7,
    price: 4150, oldPrice: 4490,
    rating: 4.8, reviews: 223,
    groupMin: 4, groupMax: 14,
    difficulty: "Moderate",
    pace: "Active",
    blurb: "Waterfalls, glaciers and black-sand beaches on a full loop of the island — aurora season.",
    tags: ["Northern lights", "Glaciers", "Road trip"],
    highlights: [
      "Hunt the northern lights from a remote lodge",
      "Walk on a glacier with crampons and a guide",
      "Soak in a geothermal lagoon under snow",
      "Cruise a glacial lagoon among floating icebergs",
    ],
    itinerary: [
      { d: "Day 1", t: "Reykjavík", x: "Arrival, group dinner and aurora briefing." },
      { d: "Day 2", t: "Golden Circle", x: "Geysers, Gullfoss and the continental rift at Þingvellir." },
      { d: "Day 3", t: "South coast", x: "Waterfalls and the black-sand beach of Reynisfjara." },
      { d: "Day 4", t: "Glacier walk", x: "Crampon hike on an outlet glacier, lagoon cruise." },
      { d: "Day 5", t: "East fjords", x: "Coastal villages, fishing harbours and reindeer country." },
      { d: "Day 6", t: "Lake Mývatn", x: "Volcanic craters, lava fields and geothermal baths." },
      { d: "Day 7", t: "North & Borgarfjörður", x: "Whale watching option, return toward the capital." },
      { d: "Day 8", t: "Departure", x: "Blue Lagoon soak en route to the airport." },
    ],
    included: ["7 nights lodges & hotels", "Expert driver-guide", "Daily breakfast + 4 dinners", "Glacier gear", "All entries"],
    notIncluded: ["Flights", "Lunches", "Optional whale tour"],
    featured: true, popular: false,
  },
  {
    id: "kenya-safari",
    title: "Great Migration Safari",
    place: "Maasai Mara, Kenya",
    region: "Africa",
    theme: "safari",
    categories: ["luxury", "adventure"],
    days: 8, nights: 7,
    price: 6280, oldPrice: null,
    rating: 5.0, reviews: 142,
    groupMin: 2, groupMax: 6,
    difficulty: "Easy",
    pace: "Balanced",
    blurb: "Big-cat country, a hot-air balloon at dawn and tented luxury in the path of the migration.",
    tags: ["Big Five", "Balloon safari", "Tented luxury"],
    highlights: [
      "Witness the river crossings of the great migration",
      "Dawn hot-air balloon over the Mara plains",
      "Private game drives with a Maasai naturalist",
      "Sundowners and bush dinners under acacia trees",
    ],
    itinerary: [
      { d: "Day 1", t: "Nairobi", x: "Arrival, elephant sanctuary visit and overnight." },
      { d: "Day 2", t: "Fly to the Mara", x: "Light aircraft to camp, first afternoon game drive." },
      { d: "Day 3", t: "Migration country", x: "Full day tracking the herds and river crossings." },
      { d: "Day 4", t: "Balloon dawn", x: "Sunrise balloon flight and champagne bush breakfast." },
      { d: "Day 5", t: "Maasai culture", x: "Village visit, conservation talk, evening drive." },
      { d: "Day 6", t: "Big cats", x: "Full day with the lion prides and cheetah." },
      { d: "Day 7", t: "Leisure & drives", x: "Spa, optional walking safari, farewell bush dinner." },
      { d: "Day 8", t: "Departure", x: "Fly back to Nairobi for international connections." },
    ],
    included: ["7 nights luxury tented camp", "All game drives", "All meals & house drinks", "Balloon safari", "Park & conservancy fees"],
    notIncluded: ["International flights", "Visa", "Premium wines"],
    featured: true, popular: true,
  },
  {
    id: "norway-fjords",
    title: "Norwegian Fjords Voyage",
    place: "Bergen, Norway",
    region: "Nordic",
    theme: "norway",
    categories: ["cruise", "group"],
    days: 7, nights: 6,
    price: 3540, oldPrice: 3950,
    rating: 4.7, reviews: 178,
    groupMin: 2, groupMax: 16,
    difficulty: "Easy",
    pace: "Relaxed",
    blurb: "Sail the deep blue arms of the fjords, past cascading falls and villages clinging to the cliffs.",
    tags: ["Small ship", "Fjords", "Scenic rail"],
    highlights: [
      "Cruise the UNESCO Nærøyfjord",
      "Ride the spectacular Flåm mountain railway",
      "Kayak beneath thundering waterfalls",
      "Explore the Hanseatic wharf of Bergen",
    ],
    itinerary: [
      { d: "Day 1", t: "Bergen", x: "Embark your small ship, explore the colourful Bryggen." },
      { d: "Day 2", t: "Hardangerfjord", x: "Orchards in bloom, waterfall hikes and cider tasting." },
      { d: "Day 3", t: "Flåm railway", x: "One of the world's most scenic rail journeys." },
      { d: "Day 4", t: "Nærøyfjord", x: "Sail the narrowest, deepest fjord; kayak excursion." },
      { d: "Day 5", t: "Geirangerfjord", x: "Seven Sisters falls and the Eagle Road viewpoint." },
      { d: "Day 6", t: "Ålesund", x: "Art Nouveau town and a final scenic cruise." },
      { d: "Day 7", t: "Departure", x: "Disembark and transfer to the airport." },
    ],
    included: ["6 nights small-ship cabin", "All meals aboard", "Flåm railway", "Kayak & shore excursions", "Onboard expert"],
    notIncluded: ["Flights", "Gratuities", "Premium drinks"],
    featured: false, popular: false,
  },
  {
    id: "bali-wellness",
    title: "Bali Wellness & Rice Terraces",
    place: "Ubud, Bali",
    region: "Asia",
    theme: "bali",
    categories: ["luxury", "cultural"],
    days: 7, nights: 6,
    price: 2980, oldPrice: null,
    rating: 4.8, reviews: 209,
    groupMin: 1, groupMax: 8,
    difficulty: "Easy",
    pace: "Relaxed",
    blurb: "Jungle pool villas, sunrise yoga, temple blessings and the emerald terraces of Tegallalang.",
    tags: ["Wellness", "Solo-friendly", "Yoga"],
    highlights: [
      "Daily sunrise yoga over the jungle canopy",
      "Water-purification blessing at Tirta Empul",
      "Cycle through the Tegallalang rice terraces",
      "Balinese healer session and flower bath",
    ],
    itinerary: [
      { d: "Day 1", t: "Arrive Ubud", x: "Settle into a jungle pool villa, welcome flower bath." },
      { d: "Day 2", t: "Sacred sites", x: "Temple blessing, monkey forest and a healer session." },
      { d: "Day 3", t: "Rice terraces", x: "Cycle the terraces, lunch with a farming family." },
      { d: "Day 4", t: "Wellness day", x: "Spa, sound healing and a cooking class." },
      { d: "Day 5", t: "Mount Batur", x: "Optional sunrise summit, hot springs recovery." },
      { d: "Day 6", t: "At leisure", x: "Free day; markets, galleries or simply rest." },
      { d: "Day 7", t: "Departure", x: "Final yoga and transfer to the airport." },
    ],
    included: ["6 nights pool villa", "Daily yoga & breakfast", "Spa treatments", "All activities & entries", "Private transfers"],
    notIncluded: ["Flights", "Most lunches & dinners", "Tips"],
    featured: false, popular: true,
  },
  {
    id: "peru-inca",
    title: "Peru: Inca Trail to Machu Picchu",
    place: "Cusco, Peru",
    region: "South America",
    theme: "peru",
    categories: ["adventure", "cultural", "group"],
    days: 9, nights: 8,
    price: 3290, oldPrice: 3690,
    rating: 4.9, reviews: 331,
    groupMin: 4, groupMax: 12,
    difficulty: "Challenging",
    pace: "Active",
    blurb: "Trek the original Inca Trail through cloud forest to the Sun Gate above Machu Picchu.",
    tags: ["Inca Trail", "Small group", "Ruins"],
    highlights: [
      "Hike the classic 4-day Inca Trail",
      "Sunrise at the Sun Gate over Machu Picchu",
      "Explore the Sacred Valley markets and ruins",
      "Acclimatise in the colonial city of Cusco",
    ],
    itinerary: [
      { d: "Day 1", t: "Cusco", x: "Arrival and gentle acclimatisation walking tour." },
      { d: "Day 2", t: "Sacred Valley", x: "Pisac ruins, Ollantaytambo and local markets." },
      { d: "Day 3", t: "Trail begins", x: "Start the Inca Trail through the Andean foothills." },
      { d: "Day 4", t: "Dead Woman's Pass", x: "The highest, hardest day; camp in cloud forest." },
      { d: "Day 5", t: "Cloud forest", x: "Inca ruins and orchids along the stone path." },
      { d: "Day 6", t: "Sun Gate", x: "Dawn arrival at Machu Picchu through the Sun Gate." },
      { d: "Day 7", t: "Machu Picchu", x: "Full guided tour, return to Cusco by scenic train." },
      { d: "Day 8", t: "Cusco at leisure", x: "Rest, markets and a farewell dinner." },
      { d: "Day 9", t: "Departure", x: "Transfer to the airport for onward flights." },
    ],
    included: ["8 nights (hotels + camping)", "Licensed trail guides & porters", "Trek meals", "Machu Picchu entry & train", "Transfers"],
    notIncluded: ["Flights to Cusco", "Sleeping bag", "Tips for crew"],
    featured: false, popular: true,
  },
  {
    id: "dubai-arabia",
    title: "Dubai & Empty Quarter",
    place: "Dubai, UAE",
    region: "Middle East",
    theme: "dubai",
    categories: ["luxury", "city"],
    days: 5, nights: 4,
    price: 3120, oldPrice: null,
    rating: 4.6, reviews: 134,
    groupMin: 2, groupMax: 8,
    difficulty: "Easy",
    pace: "Balanced",
    blurb: "Sky-high glamour, gold souks and a private night in the dunes of the Empty Quarter.",
    tags: ["City break", "Desert", "Fine dining"],
    highlights: [
      "Observation deck of the world's tallest tower",
      "Private dune drive into the Empty Quarter",
      "Gold and spice souks of old Dubai by abra",
      "Degustation dinner by a celebrated chef",
    ],
    itinerary: [
      { d: "Day 1", t: "Arrive Dubai", x: "Check into a landmark hotel, evening fountain show." },
      { d: "Day 2", t: "Old & new", x: "Heritage district, souks by abra, tower observation deck." },
      { d: "Day 3", t: "Empty Quarter", x: "Drive to the dunes, overnight in a desert resort." },
      { d: "Day 4", t: "Desert dawn", x: "Falconry, dune breakfast, return for a fine-dining finale." },
      { d: "Day 5", t: "Departure", x: "Free morning and transfer to the airport." },
    ],
    included: ["4 nights luxury hotel + desert resort", "Private guide & driver", "Daily breakfast + 2 dinners", "All entries", "Transfers"],
    notIncluded: ["Flights", "Lunches", "Optional experiences"],
    featured: false, popular: false,
  },
];

/* ---- Sample reviews keyed by tour ---- */
const REVIEWS = {
  "santorini-cyclades": [
    { name: "Elena & Marco", date: "May 2026", rating: 5, title: "The trip of a lifetime", text: "Every sunset felt unreal. Our skipper found coves we'd never have reached otherwise, and the cave suite in Oia was magical.", trip: "Honeymoon" },
    { name: "James W.", date: "Apr 2026", rating: 5, title: "Seamless and special", text: "Lumina handled every detail. The wine tasting on the volcanic vineyards was a highlight I still talk about.", trip: "Couples" },
    { name: "Priya S.", date: "Mar 2026", rating: 4, title: "Beautiful, slightly rushed", text: "Stunning throughout. I'd have loved one more day at sea — that's how good the sailing was.", trip: "Friends" },
  ],
  "patagonia-trek": [
    { name: "Tom H.", date: "May 2026", rating: 5, title: "Hard, humbling, unforgettable", text: "The sunrise at the base of the towers brought our whole group to silence. Guides were world-class.", trip: "Solo" },
    { name: "The Okonkwo family", date: "Apr 2026", rating: 5, title: "Our teens loved it", text: "Challenging but so rewarding. The eco-domes under the stars sealed it for the kids.", trip: "Family" },
  ],
  "kenya-safari": [
    { name: "Dr. Amara N.", date: "May 2026", rating: 5, title: "Beyond expectations", text: "We saw a river crossing on day three and a balloon dawn that I'll never forget. The camp staff felt like family.", trip: "Couples" },
  ],
};

const DESTINATIONS = [
  { name: "Greece", theme: "santorini", count: 6 },
  { name: "Japan", theme: "kyoto", count: 5 },
  { name: "Iceland", theme: "iceland", count: 4 },
  { name: "Italy", theme: "amalfi", count: 7 },
  { name: "Kenya", theme: "safari", count: 3 },
  { name: "Peru", theme: "peru", count: 4 },
];

/* =========================================================
   Store — localStorage + Supabase auth sync
   ========================================================= */
const LS_KEY_PREFIX = "lumina_store_v2_";

const Store = (() => {
  const defaults = { saved: [], bookings: [], user: null, userReviews: {} };
  let state = { ...defaults };
  const listeners = new Set();

  /* key is per-user so two accounts never share data */
  function _key(userId) { return LS_KEY_PREFIX + (userId || "guest"); }

  function _loadForUser(userId) {
    try {
      const raw = localStorage.getItem(_key(userId));
      if (raw) return { ...defaults, ...JSON.parse(raw) };
    } catch (e) {}
    return { ...defaults };
  }
  function persist() {
    try {
      const userId = state.user?.id || null;
      localStorage.setItem(_key(userId), JSON.stringify(state));
    } catch (e) {}
    listeners.forEach((fn) => fn(state));
  }

  async function _applySession(session, profile) {
    const userId = session.user.id;
    const local = _loadForUser(userId);
    state = {
      ...local,
      user: {
        id: userId,
        name: profile?.name || session.user.user_metadata?.name || session.user.email.split("@")[0],
        email: session.user.email,
        avatar: profile?.avatar_url || null,
        isAdmin: profile?.is_admin || false,
      }
    };
    persist();
    /* Pull bookings from Supabase so any device sees the full history */
    try {
      const rows = await SB.bookings.mine();
      if (rows?.length) {
        state.bookings = rows.map(b => ({
          id: b.id, tourId: b.tour_id, date: b.date,
          guests: b.guests, total: b.total, status: b.status,
          createdAt: b.created_at, tours: b.tours,
          name: b.guest_name, email: b.guest_email,
        }));
        persist();
      }
    } catch(e) {}
  }

  /* Sync user from Supabase session on startup */
  if (typeof SB !== "undefined" && SB.ok) {
    SB.auth.session().then(async (session) => {
      if (session?.user) {
        const profile = await SB.auth.profile(session.user.id).catch(() => null);
        _applySession(session, profile);
      }
    }).catch(() => {});

    SB.auth.onChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await SB.auth.profile(session.user.id).catch(() => null);
        _applySession(session, profile);
      } else if (event === "SIGNED_OUT") {
        state = { ...defaults };
        persist();
      }
    });

    /* Seed tours DB on first run */
    SB.tours.seed(TOURS).catch(() => {});
  }

  return {
    get: () => state,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    toggleSaved(id) {
      state.saved = state.saved.includes(id)
        ? state.saved.filter((x) => x !== id)
        : [...state.saved, id];
      persist();
      return state.saved.includes(id);
    },
    isSaved: (id) => state.saved.includes(id),
    addBooking(b) {
      const booking = { id: "LV-" + Math.random().toString(36).slice(2, 7).toUpperCase(), createdAt: Date.now(), status: "Confirmed", ...b };
      state.bookings = [booking, ...state.bookings];
      persist();
      /* also persist to Supabase */
      if (typeof SB !== "undefined" && SB.ok && state.user) {
        SB.bookings.create({
          tour_id: b.tourId, user_id: state.user.id,
          date: b.date, guests: b.guests, total: b.total,
          guest_name: b.name || state.user.name,
          guest_email: b.email || state.user.email,
          guest_phone: b.phone || "", status: "confirmed"
        }).catch(() => {});
      }
      return booking;
    },
    cancelBooking(id) {
      state.bookings = state.bookings.map((b) => b.id === id ? { ...b, status: "Cancelled" } : b);
      persist();
    },
    signIn(user) { state.user = { isAdmin: false, ...state.user, ...user }; persist(); },
    signOut() { state.user = null; persist(); },
    addReview(tourId, review) {
      const list = state.userReviews[tourId] || [];
      state.userReviews[tourId] = [{ ...review, date: "Just now", mine: true }, ...list];
      persist();
    },
  };
})();

function getTour(id) { return TOURS.find((t) => t.id === id); }
function reviewsFor(id) {
  const mine = (Store.get().userReviews[id] || []);
  return [...mine, ...(REVIEWS[id] || [])];
}
function fmtPrice(n) { return "$" + n.toLocaleString("en-US"); }

Object.assign(window, {
  CATEGORIES, TOURS, REVIEWS, DESTINATIONS, Store,
  getTour, reviewsFor, fmtPrice,
});
