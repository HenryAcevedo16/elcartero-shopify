/* =============================================
   CONTACT DRAWER JS — El Cartero RD
   ============================================= */

(function () {
  'use strict';

  function init() {
    var drawer   = document.getElementById('contactDrawer');
    var backdrop = document.getElementById('cdBackdrop');
    var closeBtn = document.getElementById('cdClose');
    var fab      = document.getElementById('floatHelpBtn');
    var form     = document.getElementById('cdContactForm');
    var grid     = document.getElementById('cdFormGrid');
    var footer   = document.getElementById('cdFooter');
    var success  = document.getElementById('cdSuccess');

    if (!drawer || !backdrop || !fab) return;

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var tl = null;
    var isOpen = false;

    /* ── OPEN ── */
    function openDrawer() {
      if (isOpen) return;
      isOpen = true;
      document.body.style.overflow = 'hidden';

      var animEls = drawer.querySelectorAll('[data-animate]');

      if (reducedMotion || typeof gsap === 'undefined') {
        backdrop.style.opacity = '1';
        backdrop.style.pointerEvents = 'auto';
        drawer.style.transform = 'translateX(0)';
        return;
      }

      backdrop.style.pointerEvents = 'auto';

      tl = gsap.timeline();
      tl.fromTo(backdrop,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 })
        .fromTo(drawer,
          { x: '120%' },
          { x: '0%', duration: 0.75, ease: 'power4.out' },
          '-=0.15')
        .fromTo(animEls,
          { opacity: 0, x: 24 },
          { opacity: 1, x: 0, stagger: 0.08, ease: 'power4.out', duration: 0.5 },
          '-=0.45');
    }

    /* ── CLOSE ── */
    function closeDrawer() {
      if (!isOpen) return;

      if (reducedMotion || typeof gsap === 'undefined' || !tl) {
        backdrop.style.opacity = '0';
        backdrop.style.pointerEvents = 'none';
        drawer.style.transform = 'translateX(120%)';
        document.body.style.overflow = '';
        isOpen = false;
        return;
      }

      tl.reverse().then(function () {
        backdrop.style.pointerEvents = 'none';
        document.body.style.overflow = '';
        isOpen = false;
      });
    }

    /* ── BOTÓN FLOTANTE ── */
    fab.addEventListener('click', function (e) {
      e.preventDefault();
      openDrawer();
    });

    /* ── CERRAR ── */
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });

    /* ═══════════════════════════════
       VALIDACIÓN
    ═══════════════════════════════ */
    var emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function getField(input) {
      return input ? input.closest('.cd-field') : null;
    }

    function setError(input, show) {
      var field = getField(input);
      if (!input || !field) return;

      if (show) {
        field.classList.add('has-error');
        input.classList.add('has-error');
        if (typeof gsap !== 'undefined') {
          gsap.timeline()
            .to(input, { x: -7, duration: 0.07 })
            .to(input, { x: 7,  duration: 0.07 })
            .to(input, { x: -5, duration: 0.07 })
            .to(input, { x: 5,  duration: 0.07 })
            .to(input, { x: 0,  duration: 0.07 });
        }
      } else {
        field.classList.remove('has-error');
        input.classList.remove('has-error');
      }
    }

    function validateForm() {
      var nameInput  = document.getElementById('cdName');
      var emailInput = document.getElementById('cdEmail');
      var bodyInput  = document.getElementById('cdBody');
      var ok = true;

      if (!nameInput.value.trim()) { setError(nameInput, true);  ok = false; }
      else                          { setError(nameInput, false); }

      if (!emailRx.test(emailInput.value.trim())) { setError(emailInput, true);  ok = false; }
      else                                          { setError(emailInput, false); }

      if (!bodyInput.value.trim()) { setError(bodyInput, true);  ok = false; }
      else                          { setError(bodyInput, false); }

      return ok;
    }

    /* Limpiar error al escribir */
    ['cdName', 'cdEmail', 'cdBody'].forEach(function (id) {
      var inp = document.getElementById(id);
      if (!inp) return;
      inp.addEventListener('input', function () {
        inp.classList.remove('has-error');
        var f = inp.closest('.cd-field');
        if (f) f.classList.remove('has-error');
      });
    });

    /* ═══════════════════════════════
       ENVÍO DEL FORMULARIO (AJAX)
    ═══════════════════════════════ */
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) return;

        /* Concatenar checkboxes al body */
        var checked = Array.prototype.slice
          .call(form.querySelectorAll('.cd-check-raw:checked'))
          .map(function (cb) { return cb.value; });

        var bodyInput = document.getElementById('cdBody');
        if (checked.length) {
          bodyInput.value = 'Tipo de consulta: ' + checked.join(', ') + '\n\n' + bodyInput.value;
        }

        /* Loading */
        var btn     = document.getElementById('cdSubmit');
        var btnSpan = btn ? btn.querySelector('span') : null;
        if (btn) btn.disabled = true;
        if (btnSpan) btnSpan.textContent = 'Enviando…';

        var formData = new FormData(form);

        fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'text/html' }
        })
        .then(function (res) {
          if (res.ok) {
            showSuccess();
          } else {
            if (btn) btn.disabled = false;
            if (btnSpan) btnSpan.textContent = 'Enviar mensaje';
          }
        })
        .catch(function () {
          if (btn) btn.disabled = false;
          if (btnSpan) btnSpan.textContent = 'Enviar consulta';
          alert('Ocurrió un error al enviar el mensaje. Por favor intenta de nuevo o escríbenos por WhatsApp.');
        });
      });
    }

    /* ── ÉXITO ── */
    function showSuccess() {
      if (!grid || !footer || !success) return;

      if (typeof gsap !== 'undefined') {
        gsap.to([grid, footer], {
          opacity: 0, y: -10, duration: 0.3,
          onComplete: revealSuccess
        });
      } else {
        revealSuccess();
      }
    }

    function revealSuccess() {
      if (grid)    grid.style.display = 'none';
      if (footer)  footer.style.display = 'none';
      if (success) {
        success.classList.add('cd-visible');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(success, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
        }
      }
      setTimeout(closeDrawer, 2500);
    }
  }

  /* Ejecutar cuando el DOM esté listo */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
