/* Job advert pop-up.
   - First visit: slides in after 4 s or a little scrolling.
   - After that it stays on screen on every page (no delay) until the visitor clicks ×.
   - Clicking × hides it on this device for good. Hidden automatically after the closing date. */
(() => {
  const box = document.getElementById('vacancy');
  if (!box) return;

  const ref = box.dataset.ref;
  const closedKey = 'vacancy-dismissed-' + ref;
  const seenKey = 'vacancy-seen-' + ref;
  if (Date.now() > new Date(box.dataset.closes + 'T23:59:59').getTime()) return;

  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
  };
  if (store.get(closedKey) === '1') return;

  let shown = false;
  const show = (instant) => {
    if (shown) return;
    shown = true;
    box.hidden = false;
    if (instant) box.classList.add('no-anim');
    requestAnimationFrame(() => box.classList.add('is-visible'));
    store.set(seenKey, '1');
  };

  if (store.get(seenKey) === '1') {
    show(true);                         // already seen: keep it persistently on screen
  } else {
    const timer = setTimeout(() => show(false), 4000);
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.3) {
        clearTimeout(timer); window.removeEventListener('scroll', onScroll); show(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Only the × button dismisses it
  box.querySelector('.vacancy-close').addEventListener('click', () => {
    box.classList.remove('is-visible', 'no-anim');
    setTimeout(() => { box.hidden = true; }, 400);
    store.set(closedKey, '1');
  });
})();
