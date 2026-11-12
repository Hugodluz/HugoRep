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
