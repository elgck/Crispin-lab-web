/* Shows a small notice ONLY if a browser extension (e.g. OneScholar or a Sci-Hub
   redirector) changes the paper links on the page. Visitors without such an
   extension never see anything.
   How it detects: it records every paper link (doi.org) when the page loads and
   checks a few times over the next ~10 s whether any were rewritten, or whether
   elements naming such an extension were added to the page.
   Closing the notice hides it for the rest of the visit. */
(() => {
  const KEY = 'ext-notice-dismissed';
  try { if (sessionStorage.getItem(KEY) === '1') return; } catch (e) { /* storage blocked */ }

  const original = new Map();
  document.querySelectorAll('a[href*="doi.org/"]').forEach((a) => original.set(a, a.getAttribute('href')));

  const SUSPECT = /one-?scholar|sci-?hub/i;
  const markerSelector = ['onescholar', 'one-scholar', 'scihub', 'sci-hub']
    .map((n) => `[id*="${n}" i], [class*="${n}" i]`).join(', ');

  const detected = () => {
    for (const [a, href] of original) {
      const now = a.getAttribute('href');
      if (a.isConnected && now !== href) return true;          // link rewritten
    }
    if (document.querySelector(markerSelector)) return true;    // extension's own elements
    return [...document.querySelectorAll('a[href]')].some((a) => SUSPECT.test(a.getAttribute('href')));
  };

  let shown = false;
  const show = () => {
    if (shown) return; shown = true;
    const box = document.createElement('aside');
    box.className = 'ext-notice';
    box.setAttribute('role', 'status');
    box.innerHTML = '<strong>A browser extension is changing links on this page</strong>' +
      'An extension such as OneScholar seems to be rewriting the links to our papers, so some links and figures may not work. ' +
      'For the best experience, pause it for this site.' +
      '<button type="button" aria-label="Dismiss">×</button>';
    box.querySelector('button').addEventListener('click', () => {
      box.hidden = true;
      try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* storage blocked */ }
    });
    document.body.appendChild(box);
  };

  const check = () => { if (!shown && detected()) show(); };
  [800, 2500, 6000, 10000].forEach((t) => setTimeout(check, t));
  if ('MutationObserver' in window) {
    let pending = false;
    const mo = new MutationObserver(() => {
      if (pending || shown) return; pending = true;
      setTimeout(() => { pending = false; check(); }, 300);
    });
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['href', 'class', 'id'] });
    setTimeout(() => mo.disconnect(), 12000);
  }
})();
