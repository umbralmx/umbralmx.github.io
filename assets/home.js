/*
 * umbral_ — comportamiento de la portada. Sin dependencias.
 *
 *  1. Titular tecleado: letra por letra, cada una entra en color signal y
 *     decanta a tinta (CSS: .tw-char). Un solo pase, cursor de bloque.
 *  2. Acordeón de proyectos: una fila abierta a la vez. Sin JS los paneles
 *     quedan visibles (home.css); este script los colapsa y hace el toggle.
 *     El panel cerrado queda `inert`: fuera del foco y de los lectores.
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

    out.textContent = '';
    out.appendChild(caret);

    function addChar(k) {
      var s = document.createElement('span');
      s.className = 'tw-char';
      s.textContent = full.charAt(k);
      out.insertBefore(s, caret);
    }

    if (reduceMotion) {
      for (var k = 0; k < full.length; k++) addChar(k);
      return;
    }

    h1.classList.add('is-typing');

    var i = 0;
    function tick() {
      addChar(i);
      i += 1;
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

    function head(item) { return item.querySelector('.proyecto-cab'); }
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
