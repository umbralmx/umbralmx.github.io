/*
 * umbral_ — comportamiento de la portada. Sin dependencias.
 *
 *  1. Titular tecleado: letra por letra, cada una entra en color signal y
 *     decanta a tinta (CSS: .tw-char). Un solo pase, cursor de bloque.
 *  2. Encabezado «proyectos»: un botón pliega toda la lista. Empieza
 *     abierta; al cerrar, la lista queda `inert` (fuera del foco).
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

  /* ── 2. Plegado de la lista de proyectos ─────────────── */
  (function proyectos() {
    var sec = document.querySelector('.proyectos-seccion');
    if (!sec) return;

    var btn = sec.querySelector('.proyectos-toggle');
    var lista = document.getElementById('proyectos-lista');
    if (!btn || !lista) return;

    // Empieza abierta: el estado por defecto del DOM ya es el correcto.
    btn.addEventListener('click', function () {
      var abrir = sec.classList.contains('cerrada');
      sec.classList.toggle('cerrada', !abrir);
      btn.setAttribute('aria-expanded', String(abrir));
      if (abrir) lista.removeAttribute('inert');
      else lista.setAttribute('inert', '');
    });
  })();
})();
