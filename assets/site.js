/*
 * Umbral site behaviour. No dependencies.
 *
 * Eased scrolling for in-page anchor clicks only — wheel, trackpad, keyboard
 * and scrollbar stay native. Any of those during an animation aborts it, so
 * the page never fights the user for control of the scroll position.
 */
(function () {
  'use strict';

  var DURATION_MIN = 600;
  var DURATION_MAX = 1100;
  var PX_PER_MS = 1.6; // distance-scaled duration, clamped to the range above

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var animation = null;

  // easeOutExpo — fast departure, long settle. The Lenis feel.
  function ease(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function headerOffset() {
    var bar = document.querySelector('.header-bar');
    if (!bar) return 0;
    var rect = bar.getBoundingClientRect();
    // Header height plus twice any gap above it (breathing room below to match).
    // The bar is flush at top:0, so rect.top is 0 and this is just its height;
    // the term is kept so a re-inset header stays correct without a JS change.
    return rect.height + rect.top * 2;
  }

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function cancel() {
    if (animation === null) return;
    cancelAnimationFrame(animation);
    animation = null;
  }

  function scrollToTarget(target) {
    var start = window.scrollY;
    var end = Math.min(
      start + target.getBoundingClientRect().top - headerOffset() - 8,
      maxScroll()
    );
    end = Math.max(0, end);

    var distance = end - start;
    if (Math.abs(distance) < 2) return;

    var duration = Math.min(
      DURATION_MAX,
      Math.max(DURATION_MIN, Math.abs(distance) / PX_PER_MS)
    );
    var startedAt = null;

    cancel();

    function step(now) {
      if (startedAt === null) startedAt = now;
      var t = Math.min(1, (now - startedAt) / duration);
      // behavior:'instant' overrides the CSS `scroll-behavior: smooth`
      // fallback, which would otherwise smooth each frame of this animation.
      window.scrollTo({ top: start + distance * ease(t), behavior: 'instant' });
      animation = t < 1 ? requestAnimationFrame(step) : null;
    }

    animation = requestAnimationFrame(step);
  }

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    var link = event.target.closest('a[href^="#"]');
    if (!link) return;

    var hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    var target = document.getElementById(hash.slice(1));
    if (!target) return;

    event.preventDefault();

    if (prefersReducedMotion.matches) {
      target.scrollIntoView();
    } else {
      scrollToTarget(target);
    }

    // Keep the URL shareable without letting the browser jump to the anchor.
    if (window.history.pushState) {
      window.history.pushState(null, '', hash);
    }

    // Move keyboard focus along with the viewport.
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  // Any real user input hands control straight back.
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (type) {
    window.addEventListener(type, cancel, { passive: true });
  });
})();
