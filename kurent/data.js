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
  images: { [colorName]: ['front.jpg', 'back.jpg'] } -> product images; the first is shown on the card,
    the second appears on hover and both are shown in the product view (imageLabels names them)
  splitColors: true -> one card per colour in the grid
  brand: 'sport-life' | 'krt-team' -> shows that wordmark on the card and in the product view
  videos: { [colorName]: { src, poster } } -> muted looping product video (takes priority over images)
  limited: true  -> shows the "Limited" badge and edition info
  edition: number of pieces (for limited items)
  meaning: text for art pieces
*/
window.KURENT_PRODUCTS = [
  {
    id: 'mv-sport-life-tee',
    pillar: 'movement',
    category: 'apparel',
    brand: 'sport-life',
    name: 'Kurent Sport Life Tee',
    price: 35,
    images: { Black: ['assets/mockup-sport-life-tee-back.jpg'] },
    description: 'Heavyweight cotton tee with the Kurent Sport Life print on the back: stars, KRT logo, monogram and EST. 2026.',
    details: ['Heavyweight cotton jersey', 'Relaxed, slightly boxy fit', 'Back print: Kurent Sport Life', 'Drop 01: not limited'],
    colors: [{ name: 'Black', swatch: '#0d0d0d' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'mv-dirty-hands-tee',
    pillar: 'movement',
    category: 'apparel',
    brand: 'krt-team',
    name: 'Dirty Hands Clean Form Tee',
    price: 35,
    images: { Black: ['assets/mockup-dirty-hands-tee.jpg'] },
    description: 'Black tee with "Dirty Hands Clean Form" across the chest and the KRT monogram below.',
    details: ['Cotton jersey', 'Relaxed fit', 'Chest print with KRT monogram', 'KRT team neck label'],
    colors: [{ name: 'Black', swatch: '#0d0d0d' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'mv-monogram-shorts',
    pillar: 'movement',
    category: 'apparel',
    brand: 'krt-team',
    name: 'Monogram Shorts',
    price: 45,
    images: { Black: ['assets/mockup-shorts.jpg'] },
    description: 'Black training shorts with side pockets and the KRT monogram on the left leg.',
    details: ['Lightweight training fabric', 'Elastic waistband', 'Two side pockets', 'KRT monogram, left leg'],
    colors: [{ name: 'Black', swatch: '#0d0d0d' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 'mv-mon-sujo-jacket',
    pillar: 'movement',
    category: 'apparel',
    brand: 'sport-life',
    name: 'Mon Sujo Dinhero Limpo Jacket',
    price: 120,
    images: { Graphite: ['assets/mockup-jacket-front.jpg', 'assets/mockup-jacket-back.jpg'] },
    imageLabels: ['Front', 'Back'],
    description: 'Two-tone hooded jacket. KRT logo and monogram on the front; "Mon Sujo Dinhero Limpo" with the Sportlife script on the back.',
    details: ['Full zip with hood', 'Two-tone grey and graphite', 'Front: KRT logo + monogram', 'Back: Mon Sujo Dinhero Limpo, Sportlife script'],
    colors: [{ name: 'Graphite', swatch: 'linear-gradient(180deg,#9aa0a4 50%,#3a3e43 50%)' }],
    sizes: ['S', 'M', 'L', 'XL']
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
   where items fill the screen. id is used in links: media.html#training
   brand: 'sport-life' | 'krt-team' shows that wordmark instead of the tag text */
window.KURENT_MEDIA = [
  { id: 'training', brand: 'krt-team', type: 'video', src: 'assets/training-weighted-pullup.mp4', poster: 'assets/training-weighted-pullup-poster.jpg', ratio: 9 / 16, focus: '50% 45%',
    tag: 'Training', title: 'Weighted pull-ups', caption: 'Plates on the belt, chin over the bar. Dirty hands, clean form.' },
  { id: 'forest', brand: 'sport-life', type: 'image', src: 'assets/lifestyle-sport-life-back.jpg', ratio: 1200 / 1477, focus: '50% 60%',
    tag: 'Lifestyle', title: 'Spritu forti in the forest', caption: 'The Kurent Sport Life tee, out among the boulders.' },
  { id: 'tee-concept', brand: 'sport-life', type: 'video', src: 'assets/sport-life-tee-concept.mp4', poster: 'assets/sport-life-tee-concept-poster.jpg', ratio: 9 / 16, focus: '50% 50%',
    tag: 'Product', title: 'Concept: the Sport Life tee', caption: 'Front and back of the first Kurent Movement tee.', link: { href: 'index.html#movement', label: 'Shop the tee' } },
  { id: 'dirty-hands', type: 'image', src: 'assets/gym-plates-chain.jpg', ratio: 900 / 1200, focus: '50% 40%',
    tag: 'Training', title: 'Dirty hands, clean form', caption: 'Plates, chain and belt. The tools of the work.' },
  { id: 'rising', type: 'image', src: 'assets/lifestyle-boulders-full.jpg', ratio: 777 / 1307, focus: '50% 55%',
    tag: 'Mindset', title: 'Keep rising through pain', caption: 'Stand in front of what is bigger than you, and keep going.' },
  { id: 'portrait', type: 'image', src: 'assets/lifestyle-portrait-color.jpg', ratio: 1200 / 1600, focus: '50% 35%',
    tag: 'Community', title: 'Vida e movimento', caption: 'Movement is for everyone. This is where it starts.' }
];

/* Brand marks (files in assets/, black for light backgrounds, white for dark) */
window.KURENT_BRANDS = {
  'sport-life': { name: 'Sport-Life', black: 'assets/sport-life-wordmark-black.png', white: 'assets/sport-life-wordmark-white.png', ratio: 696 / 142 },
  'krt-team': { name: 'KRT team', black: 'assets/krt-team-wordmark-black.png', white: 'assets/krt-team-wordmark-white.png', ratio: 1096 / 213 }
};
