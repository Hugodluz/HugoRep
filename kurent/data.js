/* =========================================================
   KURENT — site content & mock store data
   Edit this file to change products, prices, drops, links
   and athletes. No build step needed.
   ========================================================= */

window.KURENT_CONFIG = {
  currency: 'EUR',
  locale: 'en-IE',            // formats prices as €35.00
  freeShippingFrom: 100,      // placeholder
  shippingFlat: 5.9,          // placeholder

  // Next limited drop (used by any product with limited: true and the KRTP countdown)
  nextDropDate: '2027-02-14T19:00:00Z',

  // Featured YouTube video. Leave empty to show the placeholder.
  // Example: 'dQw4w9WgXcQ' (the part after watch?v=)
  youtubeId: '',

  socials: {
    instagram: 'https://instagram.com/',
    tiktok: 'https://tiktok.com/',
    youtube: 'https://youtube.com/',
    strava: 'https://strava.com/'
  },

  // Optional: POST waitlist submissions to a real endpoint (Formspree, Zapier,
  // Google Apps Script, Shopify customer form, your own API...).
  // When empty, submissions are kept in this browser's localStorage only.
  waitlistEndpoint: ''
};

/*
  PRODUCT FIELDS
  id, pillar ('movement' | 'team' | 'krtp'), category ('apparel' | 'art')
  name, price (EUR placeholder), description, details[]
  colors: [{ name, swatch, art }]  -> 'art' drives the placeholder illustration
  sizes: [] (empty for art)
  shape / art: no longer used for images (kept for reference)
  images: { [colorName]: 'assets/file.jpg' }  -> product photo (no photo = "Photo coming soon" tile)
  splitColors: true -> one card per colour in the grid
  videos: { [colorName]: { src, poster } } -> muted looping product video (takes priority over images)
  limited: true  -> shows the "Limited" badge and edition info
  edition: number of pieces (for limited items)
  meaning: text for art pieces
*/
window.KURENT_PRODUCTS = [
  /* ---------- MOVEMENT (accessible) ---------- */
  {
    id: 'mv-sport-life-tee',
    pillar: 'movement',
    category: 'apparel',
    name: 'Kurent Sport Life Tee',
    price: 35,
    shape: 'tee',
    splitColors: true,          // show one card per colourway
    videos: { Navy: { src: 'assets/sport-life-tee-concept.mp4', poster: 'assets/sport-life-tee-concept-poster.jpg' } },
    description: 'The everyday tee for a life in motion. Heavyweight cotton, relaxed fit, Kurent Sport Life print on the chest.',
    details: ['Heavyweight cotton jersey', 'Relaxed, slightly boxy fit', 'Screen-printed chest graphic', 'Drop 01: not limited'],
    colors: [
      { name: 'Navy', swatch: '#1c2433', art: { base: '#1c2433', ink: '#e9e6df' } },
      { name: 'Blue Camo', swatch: 'camo-blue', art: { camo: ['#2a3a52', '#3f5677', '#1b2638', '#5b7392'], ink: '#f2efe8' } },
      { name: 'Olive Camo', swatch: 'camo-olive', art: { camo: ['#4a4f33', '#626a43', '#33371f', '#7c7a52'], ink: '#f2efe8' } }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },

  {
    id: 'mv-dirty-hands-kit',
    pillar: 'movement',
    category: 'apparel',
    name: 'Dirty Hands Clean Form Kit',
    price: 95,
    shape: 'kit',
    images: { Black: 'assets/krt-team-kit-dirty-hands.jpg' },
    description: 'Black tee with "Dirty Hands Clean Form" on the chest and the KRT monogram, plus matching shorts.',
    details: ['T-shirt + shorts set', '"Dirty Hands Clean Form" chest print', 'KRT monogram on chest and left leg', 'KRT team neck label'],
    colors: [{ name: 'Black', swatch: '#0d0d0d', art: { base: '#121212', ink: '#262626', accent: '#ff5a1f' } }],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  }
];

/* Athletes — placeholders until real names/photos are ready.
   photo: 'assets/athlete-1.jpg' replaces the monogram card. */
window.KURENT_ATHLETES = [
  { name: 'Athlete Name', discipline: 'Street lifting', base: 'Lisbon', photo: '' },
  { name: 'Athlete Name', discipline: 'Calisthenics', base: 'Praia', photo: '' },
  { name: 'Athlete Name', discipline: 'Street lifting', base: 'Porto', photo: '' },
  { name: 'Athlete Name', discipline: 'Calisthenics', base: 'Mindelo', photo: '' }
];

/* Kurent Media feed (media.html) — vertical, one item per screen.
   type: 'video' | 'image'. ratio = width / height of the file (used on desktop
   so each item keeps its real proportions). focus = object-position on phones,
   where items fill the screen. id is used in links: media.html#training */
window.KURENT_MEDIA = [
  { id: 'intro', type: 'video', src: 'assets/krt-logo-vida-e-movimento.mp4', poster: 'assets/krt-logo-vida-e-movimento-poster.jpg', ratio: 9 / 16, focus: '50% 50%',
    tag: 'Kurent Media', title: 'Vida e Movimento', caption: 'Training, product and the people behind Kurent. Scroll to explore.' },
  { id: 'training', type: 'video', src: 'assets/training-weighted-pullup.mp4', poster: 'assets/training-weighted-pullup-poster.jpg', ratio: 9 / 16, focus: '50% 45%',
    tag: 'Training', title: 'Weighted pull-ups', caption: 'Plates on the belt, chin over the bar. Dirty hands, clean form.' },
  { id: 'forest', type: 'image', src: 'assets/lifestyle-sport-life-back.jpg', ratio: 1200 / 1477, focus: '50% 60%',
    tag: 'Lifestyle', title: 'Spritu forti in the forest', caption: 'The Kurent Sport Life tee, out among the boulders.' },
  { id: 'tee-concept', type: 'video', src: 'assets/sport-life-tee-concept.mp4', poster: 'assets/sport-life-tee-concept-poster.jpg', ratio: 9 / 16, focus: '50% 50%',
    tag: 'Product', title: 'Concept: the Sport Life tee', caption: 'Front and back of the first Kurent Movement tee.', link: { href: 'index.html#movement', label: 'Shop the tee' } },
  { id: 'dirty-hands', type: 'image', src: 'assets/gym-plates-chain.jpg', ratio: 900 / 1200, focus: '50% 40%',
    tag: 'Training', title: 'Dirty hands, clean form', caption: 'Plates, chain and belt. The tools of the work.' },
  { id: 'rising', type: 'image', src: 'assets/lifestyle-boulders-full.jpg', ratio: 777 / 1307, focus: '50% 55%',
    tag: 'Mindset', title: 'Keep rising through pain', caption: 'Stand in front of what is bigger than you, and keep going.' },
  { id: 'portrait', type: 'image', src: 'assets/lifestyle-portrait-color.jpg', ratio: 1200 / 1600, focus: '50% 35%',
    tag: 'Community', title: 'Vida e movimento', caption: 'Movement is for everyone. This is where it starts.' }
];
