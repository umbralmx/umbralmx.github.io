/*
 * umbral_ — comportamiento de la portada. Sin dependencias.
 *
 *  1. Titular con efecto de tecleo (un solo pase, cursor guion bajo).
 *  2. Acordeón de proyectos: un panel abierto a la vez. Sin JS los paneles
 *     quedan visibles (home.css los deja abiertos); este script los colapsa y
 *     hace el toggle. El panel cerrado queda `inert`: fuera del orden de
 *     tabulación y de los lectores de pantalla mientras está oculto.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Titular tecleado ─────────────────────────────── */
  (function typewriter() {
    var h1 = document.querySelector('.intro-headline');
    if (!h1) return;

    var sizer = h1.querySelector('.tw-sizer');
    var out = h1.querySelector('.tw');
    if (!sizer || !out) return;

    var full = sizer.textContent.replace(/\s+/g, ' ').trim();

    var caret = document.createElement('span');
    caret.className = 'tw-caret';
    caret.setAttribute('aria-hidden', 'true');
    caret.textContent = '_';

    function render(n) {
      out.textContent = full.slice(0, n);
      out.appendChild(caret);
    }

    if (reduceMotion) {
      render(full.length);
      return;
    }

    h1.classList.add('is-typing');
    render(0);

    var i = 0;
    function tick() {
      i += 1;
      render(i);
      if (i < full.length) {
        var prev = full.charAt(i - 1);
        var delay = prev === ' ' ? 90 : 30 + Math.random() * 42;
        setTimeout(tick, delay);
      } else {
        h1.classList.remove('is-typing');
      }
    }
    setTimeout(tick, 350);
  })();

  /* ── 2. Acordeón de proyectos ────────────────────────── */
  (function acordeon() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.proyecto'));
    if (!items.length) return;

    function head(item) { return item.querySelector('.proyecto-head'); }
    function panel(item) { return item.querySelector('.proyecto-panel'); }

    function close(item) {
      item.classList.remove('abierto');
      head(item).setAttribute('aria-expanded', 'false');
      panel(item).setAttribute('inert', '');
    }

    function open(item) {
      items.forEach(function (other) { if (other !== item) close(other); });
      item.classList.add('abierto');
      head(item).setAttribute('aria-expanded', 'true');
      panel(item).removeAttribute('inert');
    }

    items.forEach(function (item) {
      close(item);
      head(item).addEventListener('click', function () {
        if (item.classList.contains('abierto')) close(item);
        else open(item);
      });
    });
  })();
})();
