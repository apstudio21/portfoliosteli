(function () {
  'use strict';
  // Runs in <head> before first paint, so hidden [data-reveal] blocks never flash.
  document.documentElement.classList.add('js');

  function init() {
    var items = document.querySelectorAll('[data-reveal]');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    items.forEach(function (el) { io.observe(el); });
  }

  // pause looping animations (flame, shine, pulse) for cards that are off screen
  function watchLive() {
    if (!('IntersectionObserver' in window)) { return; }
    var lo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('live', e.isIntersecting); });
    }, { threshold: 0 });
    document.querySelectorAll('.card').forEach(function (el) { lo.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); watchLive(); });
  } else {
    init();
    watchLive();
  }
})();
