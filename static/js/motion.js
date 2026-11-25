/* ─────────────────────────────────────────────────────────────
   Crispin Lab — scroll motion
   No libraries. Everything is driven by one requestAnimationFrame
   pass per scroll event.

   Hooks you can use in templates/Markdown:
     data-reveal            fade/slide in once when scrolled into view
                            (add style="--i: N" to stagger items in a grid)
     data-parallax="0.5"    drift vertically at the given strength while in view
     data-count="400"       count up from 0 when in view (data-suffix="+")
     data-scroll="view"     sets --p (0→1) as the element crosses the screen
     data-scroll="pin"      sets --p (0→1) while a tall section is pinned

   Respects "reduce motion" in the visitor's OS settings.
   ───────────────────────────────────────────────────────────── */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ── Reveal on scroll ─────────────────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const countEls = document.querySelectorAll('[data-count]');

  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target + suffix; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const k = clamp((t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * eased) + (k === 1 ? suffix : '');
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));

    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        countUp(e.target);
        cio.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    countEls.forEach((el) => { el.textContent = '0'; cio.observe(el); });
  }

  /* ── Hero: pathology → imaging → genomics cards ─────────────
     p (0→1) comes from scroll while pinned, or from a timer on phones. */
  const hero = document.getElementById('hero');
  const tiles = hero ? [...hero.querySelectorAll('.tile')].map((t) => ({ el: t, y: +t.dataset.y, on: false })) : [];
  const mods = hero ? [...hero.querySelectorAll('.modality')] : [];
  const modSteps = hero ? [...hero.querySelectorAll('.hero-steps [data-mod]')] : [];
  const slideFrame = hero && hero.querySelector('.hero-visual');
  const heroInner = hero && hero.querySelector('.hero');
  const PHASES = [0, 0.36, 0.7];          // where imaging and genomics take over
  const STATES = ['active', 'next', 'next2'];
  let heroPhase = -1;
  // Short landscape screens (phones on their side) never pin; everything else pins if it fits
  const stackedMQ = window.matchMedia('(orientation: landscape) and (max-height: 599px)');
  const portraitMQ = window.matchMedia('(orientation: portrait)');
  const isStacked = () => !hero || hero.classList.contains('no-pin');

  // Pin the hero only if its content actually fits in the window; re-check on resize/rotate
  const fitHero = () => {
    if (!hero || !heroInner) return;
    hero.classList.remove('no-pin');
    if (stackedMQ.matches) { hero.classList.add('no-pin'); return; }
    hero.classList.toggle('no-pin', heroInner.scrollHeight > window.innerHeight);
  };
  fitHero();

  const setHero = (p) => {
    if (!hero) return;
    // 1) pathology: tiles light up as the scan line passes
    const scan = clamp(p / (PHASES[1] - 0.04));
    hero.style.setProperty('--scan', scan.toFixed(4));
    for (const t of tiles) {
      const on = t.y <= scan;
      if (on !== t.on) { t.el.classList.toggle('on', on); t.on = on; }
    }
    // 2) imaging: contrast-enhanced CT is scanned into non-contrast CT, then the tumour is 'detected'
    const ct = clamp((p - PHASES[1] - 0.02) / 0.24);
    hero.style.setProperty('--ct', ct.toFixed(4));
    hero.classList.toggle('ct-done', ct >= 0.98);
    // 3) genomics: the HRD score panel is highlighted
    hero.style.setProperty('--gx', clamp((p - PHASES[2]) / 0.18).toFixed(4));
    // which card is in front
    let phase = 0;
    PHASES.forEach((t, i) => { if (p >= t) phase = i; });
    if (phase === heroPhase) return;
    heroPhase = phase;
    mods.forEach((m, i) => {
      const rel = i - phase;
      m.dataset.state = rel < 0 ? 'prev' : STATES[rel];
    });
    modSteps.forEach((s, i) => {
      s.classList.toggle('active', i === phase);
      s.classList.toggle('done', i < phase);
    });
  };

  if (reduce) {
    if (hero) setHero(0.2);
    return; // no scroll-linked motion at all
  }

  // Phones / unpinned hero: play the cycle automatically while the hero is on screen
  let heroVisible = true, autoStart = performance.now();
  const AUTO_MS = 11000;
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }, { threshold: 0.15 }).observe(hero);
  }
  const autoTick = (t) => {
    if (hero && isStacked() && heroVisible) setHero(((t - autoStart) % AUTO_MS) / AUTO_MS);
    requestAnimationFrame(autoTick);
  };
  requestAnimationFrame(autoTick);

  /* ── Scroll-linked progress ───────────────────────────────── */
  const scrollEls = [...document.querySelectorAll('[data-scroll]')];
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
  const bar = document.querySelector('.scroll-progress');
  const bandTracks = [...document.querySelectorAll('.band-track')];
  const steps = [...document.querySelectorAll('.story-step')];
  const frames = [...document.querySelectorAll('.story-frame')];
  const tabs = [...document.querySelectorAll('.story-nav [data-goto]')];
  const stage = document.querySelector('.story-stage');
  let activeStep = -1;

  const viewProgress = (r, vh) => clamp((vh - r.top) / (vh + r.height));

  const update = () => {
    const vh = window.innerHeight;
    const max = root.scrollHeight - vh;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;

    for (const el of scrollEls) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue; // off-screen, skip
      let p;
      if (el.dataset.scroll === 'pin' && !isStacked()) {
        const total = r.height - vh;
        p = total > 0 ? clamp(-r.top / total) : 0;
      } else {
        p = viewProgress(r, vh);
      }
      el.style.setProperty('--p', p.toFixed(4));
      if (el === hero && !isStacked()) setHero(p);   // unpinned hero is driven by autoTick
      if (el.classList.contains('band')) {
        // Slide both strips left together, locked to scroll
        for (const t of bandTracks) {
          const shift = Math.max(0, t.scrollWidth - window.innerWidth + 32);
          t.style.transform = `translate3d(${(-shift * p).toFixed(1)}px,0,0)`;
        }
      }
    }

    for (const el of parallaxEls) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const k = parseFloat(el.dataset.parallax) || 0.3;
      const p = viewProgress(r, vh);
      el.style.setProperty('--py', `${((0.5 - p) * k * 60).toFixed(1)}px`);
    }

    // Story: the active step is the last one whose top has passed 40% of the screen
    if (steps.length) {
      let best = 0;
      steps.forEach((st, i) => { if (st.getBoundingClientRect().top < vh * 0.4) best = i; });
      if (best !== activeStep) {
        activeStep = best;
        steps.forEach((s, i) => s.classList.toggle('is-active', i === best));
        frames.forEach((f, i) => f.classList.toggle('is-active', i === best));
        tabs.forEach((t, i) => {
          t.classList.toggle('is-active', i === best);
          t.classList.toggle('is-done', i < best);
        });
        // keep the active tab visible if the tab row scrolls sideways (portrait phones)
        const nav = tabs[best] && tabs[best].parentElement;
        if (nav && nav.scrollWidth > nav.clientWidth) {
          const t = tabs[best];
          nav.scrollTo({ left: t.offsetLeft - (nav.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
        }
      }
    }
  };

  // Tapping a tab scrolls its text step into the reading area
  tabs.forEach((t) => t.querySelector('a').addEventListener('click', (e) => {
    const step = steps[+t.dataset.goto];
    if (!step) return;
    e.preventDefault();
    step.scrollIntoView({ behavior: 'smooth', block: 'start' });   // scroll-margin-top keeps it below the bars
  }));

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  };
  // Resizing the window or rotating a phone/tablet re-measures everything
  let resizeTimer;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { fitHero(); activeStep = -1; update(); }, 120);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  stackedMQ.addEventListener('change', onResize);
  portraitMQ.addEventListener('change', onResize);
  if (document.fonts) document.fonts.ready.then(onResize); // text size changes once web fonts load
  window.addEventListener('load', () => { fitHero(); update(); });
  update();
})();
