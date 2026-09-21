(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // Живе превʼю: якщо скріншота в images/ немає, у картку вантажиться сам сайт,
  // зменшений до розміру картки (десктопна версія 1440x900). Поки вантажиться – видно намальовану мініатюру.
  function live(shot) {
    var url = shot.getAttribute('data-live');
    if (!url || !/^https:\/\/apstudio21\.github\.io\//.test(url)) return;
    var f = document.createElement('iframe');
    f.src = url; f.loading = 'lazy'; f.title = ''; f.tabIndex = -1;
    f.setAttribute('aria-hidden', 'true'); f.setAttribute('scrolling', 'no');
    f.addEventListener('load', function () { f.classList.add('on'); });
    function fit() { shot.style.setProperty('--s', (shot.clientWidth / 1440).toFixed(4)); }
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(shot); else window.addEventListener('resize', fit);
    shot.appendChild(f);
  }

  // Якщо картинки ще не покладено в images/ – сторінка однаково виглядає цілою
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    function fail() {
      if (img.dataset.fallback === 'text') {
        var t = img.parentNode.querySelector('.brand__text');
        if (t) t.hidden = false;
      }
      var shot = img.closest('.shot');
      if (shot) live(shot);
      var ab = img.closest('.about');
      if (ab) ab.classList.add('nophoto');
      img.remove();
    }
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener('error', fail, { once: true });
  });

  var els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
  setTimeout(function () { els.forEach(function (e) { e.classList.add('in'); }); }, 3000); // запобіжник
})();
