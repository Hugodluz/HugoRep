# Kurent: Phase 1 site (brand + waitlist + mock store)

A static single page you can open without installing anything. Open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, Vercel).

## Files
- `index.html`: page structure (header, hero, Movement, Team, KRTP, Media, Mission + athletes, Waitlist, footer)
- `data.js`: **edit this one** for products, placeholder prices (EUR), colours, sizes, limited editions, drop date, YouTube ID, social links and athletes
- `app.js`: cart drawer, product modal, simulated checkout, waitlist, countdown, animations
- `styles.css`: design (black / white / grey / brown base; Team accents; KRTP "dark luxury")
- `assets/`: put the logo, product photos and athlete photos here

## Adding real images
- Product photo: in `data.js` add `images: { 'Navy': 'assets/tee-navy.jpg' }` to the product (key = colour name). It replaces the illustration.
- Athlete photo: set `photo: 'assets/athlete-1.jpg'`.
- Logo: replace the `.logo` markup in `index.html` with `<img src="assets/logo.svg" alt="Kurent">`.

## Mock store
- Test card: `4242 4242 4242 4242`, any future expiry, any CVC. Nothing is charged.
- Cart and test orders are saved in the browser (localStorage).

## Waitlist
- Without a backend, submissions are saved **only in the visitor's own browser**. Good for testing the flow, not for collecting real leads.
- To collect real leads, set `waitlistEndpoint` in `data.js` to a form service URL that accepts JSON POST (e.g. Formspree, a Google Apps Script web app, Zapier/Make webhook, or later a Shopify customer form).
- Testing tip: run `kurentExportWaitlist()` in the browser console to download the local entries as CSV.

## Drop mechanic
- `limited: true` + `edition` on any product shows the Limited badge and edition info.
- `nextDropDate` drives the KRTP countdown. From drop 2, mark Movement/Team products `limited: true` too.

## Kurent Media page (`media.html`)
- Full-screen vertical feed: one photo or video per screen, snap scrolling, keyboard (↑ ↓, Space, Home/End), side dots on desktop.
- Content lives in `KURENT_MEDIA` in `data.js`. For each item set `type`, `src`, `poster` (videos), `ratio` (width / height of the file, so desktop shows it at its real proportions), `focus` (what stays in view on phones) and the texts.
- Link straight to an item with `media.html#<id>` (the home page carousel does this).
- Videos are stored without audio and only play while on screen. Tap a video to pause.
