/* Job advert pop-up.
   - First visit: slides in after 2 s or a little scrolling.
   - Later visits: shown straight away.
   - Clicking × hides it for the rest of this visit (browser session) only, so it
     comes back next time. (Older versions hid it forever; that key is ignored now.)
   - Hidden automatically after the closing date.
   The box is fully visible by default; the slide-in is only a CSS animation on top,
   so it still appears if animations or timers are throttled by the browser. */
(() => {
  const box = document.getElementById('vacancy');
  if (!box) return;

  const ref = box.dataset.ref;
  const closedKey = 'vacancy-closed-session-' + ref;
  const seenKey = 'vacancy-seen-' + ref;
  if (Date.now() > new Date(box.dataset.closes + 'T23:59:59').getTime()) return;

  const mk = (area) => ({
    get: (k) => { try { return window[area].getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { window[area].setItem(k, v); } catch (e) { /* storage blocked */ } },
  });
  const store = mk('localStorage');      // remembers that the visitor has seen it
  const session = mk('sessionStorage');  // remembers × for this visit only
  if (session.get(closedKey) === '1') return;

  let shown = false;
  const show = (instant) => {
    if (shown) return;
    shown = true;
    if (instant) box.classList.add('no-anim');
    box.hidden = false;
    store.set(seenKey, '1');
  };

  if (store.get(seenKey) === '1') {
    show(true);
  } else {
    const timer = setTimeout(() => show(false), 2000);
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.3) {
        clearTimeout(timer); window.removeEventListener('scroll', onScroll); show(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  box.querySelector('.vacancy-close').addEventListener('click', () => {
    box.classList.remove('no-anim');
    box.classList.add('is-leaving');
    setTimeout(() => { box.hidden = true; box.classList.remove('is-leaving'); }, 400);
    session.set(closedKey, '1');
  });
})();
