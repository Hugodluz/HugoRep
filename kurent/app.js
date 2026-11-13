/* =========================================================
   KURENT — app logic (mock store, cart, checkout, waitlist)
   ========================================================= */
(function () {
  'use strict';

  const CFG = window.KURENT_CONFIG;
  const PRODUCTS = window.KURENT_PRODUCTS;
  const ATHLETES = window.KURENT_ATHLETES;
  const BRANDS = window.KURENT_BRANDS || {};
  const brandImg = (key, tone, cls) => { const b = BRANDS[key]; return b ? `<img class="${cls}" src="${b[tone]}" alt="${b.name}">` : ''; };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  const fmt = new Intl.NumberFormat(CFG.locale, { style: 'currency', currency: CFG.currency });
  const money = (n) => fmt.format(n);
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const PILLAR_LABEL = { movement: 'Kurent Movement', team: 'Kurent Team', krtp: 'Keep Rising Through Pain' };

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ }
    }
  };

  /* ---------------- Product image ----------------
     Real photo from p.images[colourName]; otherwise a neutral "photo coming soon" tile. */
  function productArt(p, colorIdx = 0, thumb = false) {
    const color = p.colors[colorIdx] || p.colors[0];
    const vid = p.videos && p.videos[color.name];
    if (vid) {
      if (thumb) return `<img class="photo photo--dark" src="${vid.poster}" alt="${p.name} in ${color.name}" loading="lazy">`;
      return `<video class="media-video product-video" src="${vid.src}" poster="${vid.poster}" muted loop playsinline preload="metadata" aria-label="${p.name} in ${color.name}"></video>`;
    }
    const src = p.images && (p.images[color.name] || Object.values(p.images)[0]);
    if (src) return `<img class="photo" src="${src}" alt="${p.name} in ${color.name}" loading="lazy">`;
    return `<div class="no-photo" role="img" aria-label="${p.name}: photo coming soon"><span>Photo coming soon</span></div>`;
  }

  function swatchStyle(sw) {
    if (sw === 'camo-blue') return 'background: radial-gradient(circle at 30% 30%, #3f5677 30%, transparent 31%), radial-gradient(circle at 70% 65%, #1b2638 28%, transparent 29%), #2a3a52';
    if (sw === 'camo-olive') return 'background: radial-gradient(circle at 30% 30%, #626a43 30%, transparent 31%), radial-gradient(circle at 70% 65%, #33371f 28%, transparent 29%), #4a4f33';
    return `background:${sw}`;
  }

  /* ---------------- Product grid ---------------- */
  function renderProducts() {
    $$('.products').forEach((grid) => {
      const pillar = grid.dataset.pillar;
      const cat = grid.dataset.category;
      const items = [];
      PRODUCTS.filter((p) => p.pillar === pillar && (!cat || p.category === cat)).forEach((p) => {
        if (p.splitColors) p.colors.forEach((c, i) => items.push({ p, ci: i, split: true }));
        else items.push({ p, ci: 0, split: false });
      });
      grid.innerHTML = items.map(({ p, ci, split }) => `
        <article class="card tile reveal" data-id="${p.id}" data-color="${ci}"${split ? ' data-split' : ''}>
          <button class="tile__hit" data-open="${p.id}" aria-label="View ${p.name}${split ? ' in ' + p.colors[ci].name : ''}">
            <div class="tile__media" data-art>${productArt(p, ci)}</div>
            ${p.limited ? `<span class="badge badge--limited tile__badge">Limited</span>` : ''}
            <span class="tile__text">
              ${p.brand ? brandImg(p.brand, 'white', 'tile__brand') : ''}
              <span class="tile__title">${p.name}</span>
              <span class="tile__sub">${p.colors.length > 1 ? p.colors[ci].name + ' · ' : ''}${money(p.price)}</span>
            </span>
          </button>
        </article>`).join('');
    });

    // swatch -> swap card art
    $$('.card').forEach((card) => {
      const p = byId(card.dataset.id);
      $$('[data-swatch]', card).forEach((sw) => sw.addEventListener('click', () => {
        $$('[data-swatch]', card).forEach((s) => s.classList.remove('is-active'));
        sw.classList.add('is-active');
        card.dataset.color = sw.dataset.swatch;
        $('[data-art]', card).innerHTML = productArt(p, +sw.dataset.swatch);
        wireVideos(card);
      }));
      $('[data-open]', card).addEventListener('click', () => openProduct(p.id, +(card.dataset.color || 0)));
    });
  }

  /* ---------------- Modal / overlay helpers ---------------- */
  const overlay = $('#overlay');
  let openLayer = null;
  let lastFocus = null;

  function showLayer(el) {
    if (openLayer && openLayer !== el) hideLayer(openLayer, true);
    lastFocus = document.activeElement;
    openLayer = el;
    overlay.hidden = false;
    if (el.classList.contains('drawer')) { el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); }
    else el.hidden = false;
    requestAnimationFrame(() => { overlay.classList.add('is-visible'); el.classList.add('is-visible'); });
    document.body.classList.add('no-scroll');
    const focusable = el.querySelector('button, [href], input, select');
    if (focusable) setTimeout(() => focusable.focus(), 50);
  }
  function hideLayer(el, swapping) {
    if (!el) return;
    el.classList.remove('is-visible');
    if (el.classList.contains('drawer')) { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); }
    else setTimeout(() => { if (!el.classList.contains('is-visible')) el.hidden = true; }, 250);
    if (!swapping) {
      overlay.classList.remove('is-visible');
      setTimeout(() => { if (!openLayer) overlay.hidden = true; }, 250);
      document.body.classList.remove('no-scroll');
      openLayer = null;
      if (lastFocus) lastFocus.focus();
    }
  }
  overlay.addEventListener('click', () => hideLayer(openLayer));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openLayer) hideLayer(openLayer); });
  $$('[data-close]').forEach((b) => b.addEventListener('click', () => hideLayer(b.closest('.modal, .drawer'))));

  /* ---------------- Product detail ---------------- */
  const pm = { product: null, color: 0, size: null };

  function openProduct(id, colorIdx = 0) {
    const p = byId(id);
    pm.product = p; pm.color = colorIdx; pm.size = null;
    const modal = $('#productModal');
    modal.dataset.pillar = p.pillar;
    $('#pmPillar').innerHTML = p.brand ? brandImg(p.brand, 'black', 'pm__brand') : (PILLAR_LABEL[p.pillar] + (p.category === 'art' ? ' · Gallery' : ''));
    $('#pmTitle').textContent = p.name;
    $('#pmPrice').innerHTML = money(p.price) + (p.limited ? ` <span class="badge badge--limited">${p.edition === 1 ? '1 of 1' : 'Limited'}</span>` : '');
    $('#pmDesc').textContent = p.description;
    const meaning = $('#pmMeaning');
    if (p.meaning) { meaning.hidden = false; meaning.innerHTML = `<span>Meaning</span><p>${p.meaning}</p>`; } else meaning.hidden = true;
    $('#pmDetails').innerHTML = p.details.map((d) => `<li>${d}</li>`).join('');
    $('#pmStock').textContent = p.limited
      ? (p.edition === 1 ? 'One piece only. Once it is gone, it is gone.' : `Limited edition of ${p.edition}. Will not be restocked.`)
      : 'In stock. Ships in 2–4 business days (preview).';
    renderPmOptions();
    showLayer(modal);
  }

  function renderPmOptions() {
    const p = pm.product;
    $('#pmMedia').innerHTML = productArt(p, pm.color);
    wireVideos($('#pmMedia'));
    $('#pmColors').innerHTML = `<p class="pm__label">Colour: <strong>${p.colors[pm.color].name}</strong></p>
      <div class="swatches swatches--lg">${p.colors.map((c, i) => `<button class="swatch${i === pm.color ? ' is-active' : ''}" style="${swatchStyle(c.swatch)}" data-c="${i}" aria-label="${c.name}" aria-pressed="${i === pm.color}"></button>`).join('')}</div>`;
    $('#pmSizes').innerHTML = p.sizes.length
      ? `<p class="pm__label">Size${pm.size ? `: <strong>${pm.size}</strong>` : ''}</p>
         <div class="sizes">${p.sizes.map((s) => `<button class="size${s === pm.size ? ' is-active' : ''}" data-s="${s}" aria-pressed="${s === pm.size}">${s}</button>`).join('')}</div>`
      : '';
    $$('#pmColors [data-c]').forEach((b) => b.addEventListener('click', () => { pm.color = +b.dataset.c; renderPmOptions(); }));
    $$('#pmSizes [data-s]').forEach((b) => b.addEventListener('click', () => { pm.size = b.dataset.s; renderPmOptions(); }));
    const add = $('#pmAdd');
    add.textContent = p.sizes.length && !pm.size ? 'Select a size' : (p.category === 'art' ? 'Reserve this piece' : 'Add to cart');
  }

  $('#pmAdd').addEventListener('click', () => {
    const p = pm.product;
    if (p.sizes.length && !pm.size) {
      $('#pmSizes').classList.remove('shake'); void $('#pmSizes').offsetWidth; $('#pmSizes').classList.add('shake');
      return;
    }
    const ok = addToCart(p.id, p.colors[pm.color].name, pm.size);
    if (ok) {
      hideLayer($('#productModal'), true);
      openCart();
    }
  });

  /* ---------------- Cart ---------------- */
  let cart = store.get('kurent_cart', []);
  const lineKey = (id, color, size) => [id, color, size || ''].join('|');
  const maxQty = (p) => (p.edition === 1 ? 1 : p.category === 'art' ? 2 : 10);

  function addToCart(id, color, size) {
    const p = byId(id);
    const key = lineKey(id, color, size);
    const line = cart.find((l) => l.key === key);
    if (line) {
      if (line.qty >= maxQty(p)) { toast(p.edition === 1 ? 'This piece is one of one: already in your cart.' : 'Maximum quantity reached for this item.'); return line.qty > 0; }
      line.qty++;
    } else cart.push({ key, id, color, size, qty: 1 });
    saveCart();
    toast(`Added: ${p.name}`);
    return true;
  }
  function saveCart() { store.set('kurent_cart', cart); renderCart(); }

  function totals() {
    const subtotal = cart.reduce((s, l) => s + byId(l.id).price * l.qty, 0);
    const shipping = subtotal === 0 ? 0 : subtotal >= CFG.freeShippingFrom ? 0 : CFG.shippingFlat;
    return { subtotal, shipping, total: subtotal + shipping, count: cart.reduce((s, l) => s + l.qty, 0) };
  }

  function renderCart() {
    cart = cart.filter((l) => byId(l.id)); // drop products removed from data.js
    const t = totals();
    const count = $('#cartCount');
    count.textContent = t.count;
    count.classList.toggle('has-items', t.count > 0);
    count.classList.remove('bump'); void count.offsetWidth; if (t.count) count.classList.add('bump');

    const items = $('#cartItems');
    if (!cart.length) {
      items.innerHTML = `<div class="cart-empty"><p>Your cart is empty.</p><a href="#movement" class="btn btn--ghost btn--sm" data-close-cart>Start with Movement</a></div>`;
      $('#cartFoot').hidden = true;
    } else {
      items.innerHTML = cart.map((l) => {
        const p = byId(l.id);
        const ci = Math.max(0, p.colors.findIndex((c) => c.name === l.color));
        return `<div class="line" data-key="${l.key}">
          <div class="line__art" data-pillar="${p.pillar}">${productArt(p, ci, true)}</div>
          <div class="line__info">
            <p class="line__name">${p.name}</p>
            <p class="line__meta">${l.color}${l.size ? ' · ' + l.size : ''}</p>
            <div class="qty">
              <button data-q="-1" aria-label="Decrease quantity">−</button>
              <span>${l.qty}</span>
              <button data-q="1" aria-label="Increase quantity" ${l.qty >= maxQty(p) ? 'disabled' : ''}>+</button>
            </div>
          </div>
          <div class="line__end">
            <p class="line__price">${money(p.price * l.qty)}</p>
            <button class="line__remove" data-remove>Remove</button>
          </div>
        </div>`;
      }).join('');
      $('#cartFoot').hidden = false;
    }
    $('#cartSubtotal').textContent = money(t.subtotal);
    $('#cartShipping').textContent = t.subtotal === 0 ? '—' : t.shipping === 0 ? 'Free' : money(t.shipping);
    $('#cartTotal').textContent = money(t.total);
    const left = CFG.freeShippingFrom - t.subtotal;
    $('#shipNote').textContent = left > 0 ? `Add ${money(left)} more for free shipping.` : 'You get free shipping.';

    $$('.line').forEach((row) => {
      const line = cart.find((l) => l.key === row.dataset.key);
      $$('[data-q]', row).forEach((b) => b.addEventListener('click', () => {
        line.qty += +b.dataset.q;
        if (line.qty <= 0) cart = cart.filter((l) => l !== line);
        saveCart();
      }));
      $('[data-remove]', row).addEventListener('click', () => { cart = cart.filter((l) => l !== line); saveCart(); });
    });
    const closeLink = $('[data-close-cart]', items);
    if (closeLink) closeLink.addEventListener('click', () => hideLayer($('#cartDrawer')));
  }

  function openCart() { showLayer($('#cartDrawer')); }
  $('#cartOpen').addEventListener('click', openCart);

  /* ---------------- Checkout (simulated) ---------------- */
  const co = { details: null };

  function renderSummary() {
    const t = totals();
    $('#coSummary').innerHTML = `<h4>Order summary</h4>
      <ul>${cart.map((l) => { const p = byId(l.id); return `<li><span>${l.qty} × ${p.name}<small>${l.color}${l.size ? ' · ' + l.size : ''}</small></span><span>${money(p.price * l.qty)}</span></li>`; }).join('')}</ul>
      <div class="totals">
        <div><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
        <div><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : money(t.shipping)}</span></div>
        <div class="totals__grand"><span>Total</span><span>${money(t.total)}</span></div>
      </div>`;
  }

  function setStep(n) {
    $$('#coSteps li').forEach((li, i) => { li.classList.toggle('is-active', i === n); li.classList.toggle('is-done', i < n); });
    $('#coDetails').hidden = n !== 0;
    $('#coPayment').hidden = n !== 1;
    $('#coDone').hidden = n !== 2;
    $('#coSummary').hidden = n === 2;
  }

  $('#checkoutBtn').addEventListener('click', () => {
    if (!cart.length) return;
    renderSummary();
    setStep(0);
    showLayer($('#checkoutModal'));
  });

  function fieldError(input, msg) {
    const field = input.closest('.field');
    field.classList.toggle('has-error', !!msg);
    const err = $('.field__error', field);
    if (err) err.textContent = msg || '';
    return !msg;
  }
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  $('#coDetails').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    let ok = true;
    $$('input[required]', f).forEach((i) => {
      let msg = i.value.trim() ? '' : 'Required';
      if (!msg && i.type === 'email' && !emailOk(i.value.trim())) msg = 'Enter a valid email';
      ok = fieldError(i, msg) && ok;
    });
    if (!ok) { $('.has-error input', f).focus(); return; }
    co.details = Object.fromEntries(new FormData(f));
    setStep(1);
    $('#co-card').focus();
  });

  $('#coBack').addEventListener('click', () => setStep(0));

  // light input formatting
  $('#co-card').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); });
  $('#co-exp').addEventListener('input', (e) => { const d = e.target.value.replace(/\D/g, '').slice(0, 4); e.target.value = d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; });
  $('#co-cvc').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); });

  $('#coPayment').addEventListener('submit', (e) => {
    e.preventDefault();
    const card = $('#co-card'), exp = $('#co-exp'), cvc = $('#co-cvc');
    let ok = true;
    const digits = card.value.replace(/\s/g, '');
    ok = fieldError(card, digits.length < 16 ? 'Enter the 16-digit test card' : digits !== '4242424242424242' ? 'Test mode: use 4242 4242 4242 4242' : '') && ok;
    const m = exp.value.match(/^(\d{2}) \/ (\d{2})$/);
    let expMsg = 'Use MM / YY';
    if (m) {
      const mm = +m[1], yy = 2000 + +m[2];
      const now = new Date();
      expMsg = mm < 1 || mm > 12 ? 'Invalid month' : (yy < now.getFullYear() || (yy === now.getFullYear() && mm < now.getMonth() + 1)) ? 'Card expired' : '';
    }
    ok = fieldError(exp, expMsg) && ok;
    ok = fieldError(cvc, cvc.value.length < 3 ? 'Enter 3–4 digits' : '') && ok;
    if (!ok) return;

    const btn = $('#coPay');
    btn.disabled = true; btn.textContent = 'Processing…';
    setTimeout(() => {
      const order = 'KR-' + Date.now().toString(36).toUpperCase().slice(-6);
      const orders = store.get('kurent_test_orders', []);
      orders.push({ order, at: new Date().toISOString(), customer: co.details, lines: cart, totals: totals() });
      store.set('kurent_test_orders', orders);
      $('[data-co-name]').textContent = co.details.first;
      $('[data-co-email]').textContent = co.details.email;
      $('[data-co-order]').textContent = order;
      cart = []; saveCart();
      $('#coPayment').reset(); $('#coDetails').reset();
      btn.disabled = false; btn.textContent = 'Pay';
      setStep(2);
    }, 1200);
  });

  // show total on the Pay button
  const observer = new MutationObserver(() => { if (!$('#coPayment').hidden) $('#coPay').textContent = `Pay ${money(totals().total)}`; });
  observer.observe($('#coPayment'), { attributes: true, attributeFilter: ['hidden'] });

  /* ---------------- Waitlist ---------------- */
  const wl = $('#waitlistForm');
  wl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#wl-name'), email = $('#wl-email');
    let ok = fieldError(name, name.value.trim() ? '' : 'Tell us your first name');
    ok = fieldError(email, !email.value.trim() ? 'Email is required' : !emailOk(email.value.trim()) ? 'Enter a valid email' : '') && ok;
    if (!ok) { $('.has-error input', wl).focus(); return; }

    const ig = $('#wl-ig').value.trim().replace(/^@?/, '@');
    const entry = {
      firstName: name.value.trim(),
      email: email.value.trim().toLowerCase(),
      interest: (new FormData(wl)).get('interest') || 'Movement',
      instagram: ig === '@' ? '' : ig,
      createdAt: new Date().toISOString(),
      source: 'kurent-site'
    };

    const btn = $('button[type=submit]', wl);
    btn.disabled = true; btn.textContent = 'Joining…';

    const list = store.get('kurent_waitlist', []);
    if (!list.some((x) => x.email === entry.email)) list.push(entry);
    store.set('kurent_waitlist', list);

    if (CFG.waitlistEndpoint) {
      try {
        const res = await fetch(CFG.waitlistEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(entry)
        });
        if (!res.ok) throw new Error(res.status);
      } catch (err) {
        btn.disabled = false; btn.textContent = 'Join the waitlist';
        toast('Something went wrong. Please try again.');
        return;
      }
    }

    $('[data-name]', $('#waitlistSuccess')).textContent = entry.firstName;
    wl.hidden = true;
    $('#waitlistSuccess').hidden = false;
    $('#waitlistSuccess').classList.add('is-visible');
  });

  // Dev helper: in the browser console run kurentExportWaitlist() to download a CSV
  window.kurentExportWaitlist = function () {
    const list = store.get('kurent_waitlist', []);
    const cols = ['firstName', 'email', 'interest', 'instagram', 'createdAt'];
    const csv = [cols.join(',')].concat(list.map((r) => cols.map((c) => `"${String(r[c] || '').replace(/"/g, '""')}"`).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'kurent-waitlist.csv';
    a.click();
    return list.length + ' entries';
  };

  /* ---------------- Countdown ---------------- */
  function startCountdown() {
    const el = $('[data-countdown]');
    if (!el) return;
    const target = new Date(CFG.nextDropDate).getTime();
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      let diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 864e5); diff -= d * 864e5;
      const h = Math.floor(diff / 36e5); diff -= h * 36e5;
      const m = Math.floor(diff / 6e4); diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);
      $('[data-unit=d]', el).textContent = pad(d);
      $('[data-unit=h]', el).textContent = pad(h);
      $('[data-unit=m]', el).textContent = pad(m);
      $('[data-unit=s]', el).textContent = pad(s);
      if (target - Date.now() <= 0) { $('.drop__label', $('#krtpDrop')).innerHTML = '<span class="badge badge--limited">Live</span> The drop is open'; clearInterval(timer); }
    };
    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ---------------- Muted videos: play only while visible ---------------- */
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const videoIO = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting && !reduceMotion) { v.muted = true; const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
      else v.pause();
    });
  }, { threshold: 0.25 }) : null;
  function wireVideos(scope = document) {
    $$('video.media-video', scope).forEach((v) => {
      v.muted = true; v.defaultMuted = true; v.setAttribute('muted', '');
      if (v.dataset.wired) return;
      v.dataset.wired = '1';
      if (videoIO) videoIO.observe(v);
    });
  }

  /* ---------------- Carousel (stories) ---------------- */
  function wireCarousels() {
    $$('[data-carousel]').forEach((c) => {
      const track = $('[data-track]', c), prev = $('[data-prev]', c), next = $('[data-next]', c), bar = $('[data-progress]', c);
      const step = () => { const first = track.firstElementChild; return first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16) : 300; };
      const update = () => {
        const max = track.scrollWidth - track.clientWidth;
        const ratio = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
        bar.style.width = Math.max(ratio * 100, 8) + '%';
        bar.style.transform = `translateX(${max > 0 ? (track.scrollLeft / max) * ((1 / Math.max(ratio, .08)) - 1) * 100 : 0}%)`;
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= max - 2;
      };
      prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
      next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }

  /* ---------------- Media ---------------- */
  function renderVideo() {
    const slot = $('#videoSlot');
    if (CFG.youtubeId) {
      slot.hidden = false;
      slot.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(CFG.youtubeId)}?rel=0" title="Kurent featured video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      slot.hidden = true;
      return;
    }
  }
  function wireSocials() {
    $$('[data-social]').forEach((a) => {
      const url = CFG.socials[a.dataset.social];
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    });
  }

  /* ---------------- Athletes ---------------- */
  function renderAthletes() {
    $('#athletesGrid').innerHTML = ATHLETES.map((a, i) => `
      <article class="tile tile--athlete reveal">
        <div class="tile__media">
          ${a.photo ? `<img src="${a.photo}" alt="${a.name}" loading="lazy">` : `<span class="tile__mono" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>`}
        </div>
        <span class="tile__text">
          <span class="tile__title">${a.name}</span>
          <span class="tile__sub">${a.discipline} · ${a.base}</span>
        </span>
      </article>`).join('');
  }

  /* ---------------- Header / nav ---------------- */
  function wireHeader() {
    const header = $('.header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    const btn = $('#menuBtn'), nav = $('#nav'), side = $('#sideMenu');
    btn.addEventListener('click', () => { showLayer(side); btn.setAttribute('aria-expanded', 'true'); });
    $$('[data-menu-link]', side).forEach((l) => l.addEventListener('click', () => hideLayer(side)));
    new MutationObserver(() => { if (!side.classList.contains('is-open')) btn.setAttribute('aria-expanded', 'false'); })
      .observe(side, { attributes: true, attributeFilter: ['class'] });

    // active section highlight + dark-section header theme
    const links = $$('a', nav);
    const sections = ['movement', 'media', 'mission', 'athletes', 'join'].map((id) => document.getElementById(id));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
          document.body.dataset.section = en.target.id;
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => s && io.observe(s));
  }

  /* ---------------- Reveal on scroll ---------------- */
  function wireReveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-in')); return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('is-visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('is-visible'), 2400);
  }

  /* ---------------- Init ---------------- */
  renderProducts();
  renderAthletes();
  renderVideo();
  wireSocials();
  renderCart();
  wireVideos();
  wireCarousels();
  startCountdown();
  wireHeader();
  wireReveal();
  $('#year').textContent = new Date().getFullYear();
})();
