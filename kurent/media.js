/* =========================================================
   KURENT MEDIA — feed logic
   ========================================================= */
(function () {
  'use strict';
  const CFG = window.KURENT_CONFIG || { socials: {} };
  const ITEMS = window.KURENT_MEDIA || [];
  const BRANDS = window.KURENT_BRANDS || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (t) => String(t || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const feed = $('#feed');

  /* ---------- Render ---------- */
  const slidesHTML = ITEMS.map((it, i) => {
    const bg = it.poster || it.src;
    const media = it.type === 'video'
      ? `<video src="${esc(it.src)}" poster="${esc(it.poster)}" muted loop playsinline preload="${i < 2 ? 'auto' : 'metadata'}" aria-label="${esc(it.title)}"></video>`
      : `<img src="${esc(it.src)}" alt="${esc(it.title)}" ${i < 2 ? '' : 'loading="lazy"'}>`;
    return `
    <section class="slide" id="${esc(it.id)}" data-index="${i}" data-type="${it.type}" style="--ratio:${it.ratio || 0.5625};--focus:${it.focus || '50% 50%'}" aria-label="${i + 1} of ${ITEMS.length}: ${esc(it.title)}">
      <div class="slide__bg" style="background-image:url('${esc(bg)}')" aria-hidden="true"></div>
      <div class="slide__frame">
        <div class="slide__media">${media}</div>
        ${it.type === 'video' ? '<span class="slide__state" aria-hidden="true"></span>' : ''}
        <div class="slide__info">
          ${it.brand && BRANDS[it.brand] ? `<p class="slide__tag slide__tag--mark"><img src="${esc(BRANDS[it.brand].white)}" alt="${esc(BRANDS[it.brand].name)}"></p>` : `<p class="slide__tag">${esc(it.tag)}</p>`}
          <h2 class="slide__title">${esc(it.title)}</h2>
          ${it.link ? `<a class="slide__link" href="${esc(it.link.href)}">${esc(it.link.label)} <span aria-hidden="true">&rarr;</span></a>` : ''}
          ${i === 0 ? '<span class="slide__hint" aria-hidden="true"><i></i></span>' : ''}
        </div>
      </div>
    </section>`;
  }).join('');

  const s = CFG.socials || {};
  const endHTML = `
    <section class="slide slide--end" id="more" data-index="${ITEMS.length}" aria-label="End of feed">
      <div class="end slide__info" style="position:relative;left:auto;right:auto;bottom:auto;width:auto;max-width:none">
        <img class="end__mono" src="assets/krt-monogram-white.png" alt="" aria-hidden="true">
        <h2 class="slide__title">Move with us.</h2>
        <div class="end__actions">
          <a class="end__btn end__btn--solid" href="index.html#join">Join the waitlist</a>
          <a class="end__btn" href="index.html#movement">Shop Movement</a>
        </div>
      </div>
    </section>`;

  feed.innerHTML = slidesHTML + endHTML;
  const slides = $$('.slide', feed);
  const total = slides.length;
  $('#mTotal').textContent = pad(ITEMS.length);

  // dots
  $('#mDots').innerHTML = slides.map((sl, i) => `<li><button data-go="${i}" aria-label="Go to ${i < ITEMS.length ? esc(ITEMS[i].title) : 'end'}"></button></li>`).join('');
  const dots = $$('#mDots button');

  /* ---------- Active slide ---------- */
  let active = -1;
  function setActive(i) {
    if (i === active) return;
    active = i;
    slides.forEach((sl, k) => {
      sl.classList.toggle('is-active', k === i);
      sl.classList.toggle('is-near', Math.abs(k - i) <= 1);
      const v = $('video', sl);
      if (!v) return;
      if (Math.abs(k - i) <= 1) v.preload = 'auto';
      if (k === i && !reduce && !sl.classList.contains('is-paused')) {
        v.muted = true;
        const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
      } else {
        v.pause();
        if (k !== i) { try { v.currentTime = 0; } catch (e) { /* not loaded yet */ } sl.classList.remove('is-paused'); }
      }
    });
    const shown = Math.min(i + 1, ITEMS.length);
    $('#mCurrent').textContent = pad(shown);
    $('#mProgress').style.width = ((i + 1) / total) * 100 + '%';
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
    $('#mPrev').disabled = i === 0;
    $('#mNext').disabled = i === total - 1;
    const id = slides[i].id;
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) setActive(+en.target.dataset.index); });
  }, { root: feed, threshold: 0.6 });
  slides.forEach((sl) => io.observe(sl));

  /* ---------- Navigation ---------- */
  function go(i, instant) {
    i = Math.max(0, Math.min(total - 1, i));
    feed.scrollTo({ top: slides[i].offsetTop, behavior: instant || reduce ? 'auto' : 'smooth' });
  }
  $('#mPrev').addEventListener('click', () => go(active - 1));
  $('#mNext').addEventListener('click', () => go(active + 1));
  dots.forEach((d) => d.addEventListener('click', () => go(+d.dataset.go)));

  document.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('a, button, input, textarea')) { if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return; }
    const k = e.key;
    if (k === 'ArrowDown' || k === 'PageDown' || k === 'j' || (k === ' ' && !e.shiftKey)) { e.preventDefault(); go(active + 1); }
    else if (k === 'ArrowUp' || k === 'PageUp' || k === 'k' || (k === ' ' && e.shiftKey)) { e.preventDefault(); go(active - 1); }
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(total - 1); }
  });

  // tap / click a video to pause or resume
  slides.forEach((sl) => {
    const v = $('video', sl);
    if (!v) return;
    $('.slide__media', sl).addEventListener('click', () => {
      if (v.paused) { sl.classList.remove('is-paused'); const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
      else { v.pause(); sl.classList.add('is-paused'); }
    });
  });

  // keep the current slide in place when the viewport changes (rotation, URL bar)
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (active >= 0) go(active, true); }, 120); });

  /* ---------- Start ---------- */
  const startId = decodeURIComponent((location.hash || '').slice(1));
  const start = Math.max(0, slides.findIndex((sl) => sl.id === startId));
  requestAnimationFrame(() => { go(start, true); setActive(start); feed.focus({ preventScroll: true }); });
})();
