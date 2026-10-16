(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const html = document.documentElement;

  /* ---------- Theme ---------- */
  const toggle = $('#themeToggle');
  const setTheme = t => { html.dataset.theme = t; try { localStorage.setItem('theme', t); } catch (e) {} };
  if (!html.dataset.theme) setTheme(matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  toggle.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    if (document.startViewTransition && !reduce) document.startViewTransition(() => setTheme(next));
    else setTheme(next);
  });

  /* ---------- Nav ---------- */
  const nav = $('#nav'), burger = $('#burger'), menu = $('#mobileMenu');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 8);
    const h = document.documentElement.scrollHeight - innerHeight;
    $('#progress').style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', () => { const open = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', open); });
  $$('a', menu).forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }));

  // Active section link
  const links = $$('.nav-links a');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const navIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => navIO.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible'); io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(countUp);
  }), { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Counters ---------- */
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const end = +el.dataset.count, suffix = el.dataset.suffix || '', t0 = performance.now(), dur = reduce ? 0 : 1600;
    const fmt = n => n.toLocaleString('en-US') + suffix;
    if (!dur) { el.textContent = fmt(end); return; }
    (function f(t) { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(Math.round(end * e)); if (p < 1) requestAnimationFrame(f); })(t0);
  }

  /* ---------- Timeline progress ---------- */
  const tl = $('#timeline');
  if (tl) {
    const line = $('.timeline-line i', tl);
    const upd = () => { const r = tl.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height)); line.style.setProperty('--p', (p * 100) + '%'); };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ---------- Spotlight & card shine ---------- */
  const spot = $('#spotlight');
  if (!reduce && matchMedia('(hover: hover)').matches) {
    addEventListener('pointermove', e => {
      spot.style.setProperty('--mx', e.clientX + 'px'); spot.style.setProperty('--my', e.clientY + 'px');
    }, { passive: true });
    $$('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--sx', x * 100 + '%'); card.style.setProperty('--sy', y * 100 + '%');
        card.style.transform = `perspective(900px) rotateY(${(x - .5) * 6}deg) rotateX(${(.5 - y) * 6}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
    // Magnetic buttons
    $$('.magnetic').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .25}px)`; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  $('#year').textContent = new Date().getFullYear();
})();
