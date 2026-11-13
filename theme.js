/* Hope Buds Club — runs before the page is drawn (loaded in <head>).
   1. Anti-clickjacking: the site refuses to be shown inside another website's frame.
      (GitHub Pages cannot send the X-Frame-Options header, so this is done here.)
   2. Applies the saved theme and language at once, to avoid a flash of the wrong ones. */
if (window.top !== window.self) {
  document.documentElement.style.display = 'none';
  try { window.top.location.replace(window.self.location.href); } catch (e) {}
}
try { var t = localStorage.getItem('hbc-theme'); if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t); } catch (e) {}
try { var l = localStorage.getItem('hbc-lang'); if (l !== 'fr' && l !== 'en') l = /^fr/i.test(navigator.language || '') ? 'fr' : 'en'; document.documentElement.lang = l; } catch (e) {}
