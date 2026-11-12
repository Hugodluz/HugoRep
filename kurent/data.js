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
  shape: placeholder illustration ('tee' | 'tank' | 'shorts' | 'kit' | 'tracksuit' | 'shirt' | 'painting' | 'sculpture')
  images: { [colorName]: 'assets/file.jpg' }  -> real photos override the illustration
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

  /* ---------- TEAM (mid) ---------- */
  {
    id: 'tm-performance-top',
    pillar: 'team',
    category: 'apparel',
    name: 'Performance Sleeveless Top',
    price: 55,
    shape: 'tank',
    description: 'Light, quick-drying polyester built for training days. Tonal KRT monogram and star-ring badge.',
    details: ['Technical polyester, quick-dry', 'Athletic cut, open armholes', 'Tonal KRT monogram', 'Star-ring badge'],
    colors: [{ name: 'Black', swatch: '#0d0d0d', art: { base: '#121212', ink: '#262626', accent: '#ff5a1f' } }],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 'tm-performance-shorts',
    pillar: 'team',
    category: 'apparel',
    name: 'Performance Shorts',
    price: 50,
    shape: 'shorts',
    description: 'Stretch shorts that keep up through every rep. Tonal monogram, zip pocket, no distractions.',
    details: ['4-way stretch polyester', '5" inseam', 'Zip back pocket', 'Tonal KRT monogram'],
    colors: [{ name: 'Black', swatch: '#0d0d0d', art: { base: '#121212', ink: '#262626', accent: '#ff5a1f' } }],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 'tm-performance-kit',
    pillar: 'team',
    category: 'apparel',
    name: 'Performance Kit (Top + Shorts)',
    price: 95,
    shape: 'kit',
    description: 'The full team kit, as worn by the Kurent athletes. Sleeveless top and shorts in one set.',
    details: ['Sleeveless top + shorts', 'Save vs. buying separately', 'Tonal KRT monogram', 'Star-ring badge'],
    colors: [{ name: 'Black', swatch: '#0d0d0d', art: { base: '#121212', ink: '#262626', accent: '#ff5a1f' } }],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },

  /* ---------- KRTP (premium / limited) ---------- */
  {
    id: 'kr-velvet-tracksuit',
    pillar: 'krtp',
    category: 'apparel',
    name: 'Velvet Tracksuit',
    price: 240,
    shape: 'tracksuit',
    limited: true,
    edition: 50,
    description: 'Matte charcoal velvet, cut clean. Jacket and trousers that feel like armour and move like nothing.',
    details: ['Matte charcoal velvet', 'Zip jacket + tapered trousers', 'Embroidered KRTP mark', 'Numbered edition'],
    colors: [{ name: 'Charcoal', swatch: '#2b2c2e', art: { base: '#2a2b2e', ink: '#3a3c40', accent: '#7fd1b9' } }],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'kr-pinstripe-shirt',
    pillar: 'krtp',
    category: 'apparel',
    name: 'Pinstripe Button Shirt',
    price: 140,
    shape: 'shirt',
    limited: true,
    edition: 75,
    description: 'Fine pinstripes on deep black. A shirt for the gallery, the street and everything after midnight.',
    details: ['Cotton poplin, fine pinstripe', 'Relaxed fit, camp collar', 'Mother-of-pearl buttons', 'Numbered edition'],
    colors: [{ name: 'Midnight', swatch: '#0f1420', art: { base: '#0f1420', ink: '#2e3a52', accent: '#7fa4d1' } }],
    sizes: ['S', 'M', 'L', 'XL']
  },

  /* KRTP gallery — placeholder names & meanings */
  {
    id: 'kr-art-painting',
    pillar: 'krtp',
    category: 'art',
    name: '“Rising”',
    price: 1800,
    shape: 'painting',
    limited: true,
    edition: 1,
    description: 'Original painting. Acrylic and charcoal on canvas, 100 × 120 cm. One of one.',
    meaning: 'A figure climbing out of the dark. Every layer of paint was laid over the last: what was painful stays underneath, but it is no longer the surface.',
    details: ['Original, one of one', 'Acrylic & charcoal on canvas', '100 × 120 cm', 'Signed, certificate included'],
    colors: [{ name: 'Original', swatch: '#14261f', art: { base: '#0c1512', ink: '#1f4a3c', accent: '#d9c9a3' } }],
    sizes: []
  },
  {
    id: 'kr-art-sculpture-1',
    pillar: 'krtp',
    category: 'art',
    name: '“Firmeza”',
    price: 650,
    shape: 'sculpture',
    limited: true,
    edition: 5,
    description: 'Cast sculpture, 32 cm. Edition of 5.',
    meaning: 'Firmness. A body holding its ground against something unseen. Strength is not the absence of pressure, it is staying upright inside it.',
    details: ['Limited edition of 5', 'Cast resin, bronze finish', 'Height 32 cm', 'Signed & numbered'],
    colors: [{ name: 'Bronze', swatch: '#5b4630', art: { base: '#0b0f1a', ink: '#6b5236', accent: '#c9a36b' } }],
    sizes: []
  },
  {
    id: 'kr-art-sculpture-2',
    pillar: 'krtp',
    category: 'art',
    name: '“Silêncio”',
    price: 650,
    shape: 'sculpture',
    limited: true,
    edition: 5,
    description: 'Cast sculpture, 28 cm. Edition of 5.',
    meaning: 'Silence. The quiet moment after the hardest effort, when the noise in your head finally stops and you are free.',
    details: ['Limited edition of 5', 'Cast resin, graphite finish', 'Height 28 cm', 'Signed & numbered'],
    colors: [{ name: 'Graphite', swatch: '#3a3d42', art: { base: '#0a1210', ink: '#43474d', accent: '#8fb7a8' } }],
    sizes: []
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
