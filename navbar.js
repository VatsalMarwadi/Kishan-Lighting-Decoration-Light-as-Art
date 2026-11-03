/* ============================================================
   KISHAN LIGHTING DECORATION — INTERACTIVE SERVICES SHOWCASE
   ============================================================ */
(function () {
  'use strict';
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if (loader) setTimeout(() => loader.classList.add('done'), 800);
  });

  /* ---------- Cursor ---------- */
  const cursor = $('#cursor');
  const cursorDot = $('#cursorDot');
  const isHover = window.matchMedia('(hover:hover)').matches;
  if (cursor && cursorDot && isHover) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top  = my + 'px';
    });
    (function loop() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .g-item, .tc-card, .feature-card, .sc-menu-item, .sc-slide-link, input, textarea, label')) cursor.classList.add('grow');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .g-item, .tc-card, .feature-card, .sc-menu-item, .sc-slide-link, input, textarea, label')) cursor.classList.remove('grow');
    });
  }

  /* ---------- Scroll progress, header, back-to-top ---------- */
  const bar = $('#scrollBar');
  const header = $('#header');
  const btt = $('#btt');
  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = h > 0 ? (y / h) * 100 + '%' : '0%';
    if (header) header.classList.toggle('scrolled', y > 40);
    if (btt) btt.classList.toggle('visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Nav active state ---------- */
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Mobile menu ---------- */
  const menuToggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  function openMobile() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMobile() : openMobile();
    });
    $$('#mobileMenu a').forEach((a) => a.addEventListener('click', closeMobile));
  }

  /* ---------- Smooth scroll ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const headerOffset = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  /* ---------- Quote modal ---------- */
  const quoteModal = $('#quoteModal');
  function openQuote() {
    if (!quoteModal) return;
    quoteModal.classList.add('open');
    quoteModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#qFirst')?.focus(), 300);
  }
  function closeQuote() {
    if (!quoteModal) return;
    quoteModal.classList.remove('open');
    quoteModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  $$('[data-open-quote]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    closeMobile();
    openQuote();
  }));
  $$('[data-close-quote]').forEach((b) => b.addEventListener('click', closeQuote));

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbCount = $('#lbCount');
  const galleryItems = $$('.g-item');
  let lbIndex = 0;
  function showLightbox(i) {
    if (!lb || !galleryItems.length) return;
    lbIndex = (i + galleryItems.length) % galleryItems.length;
    const src = galleryItems[lbIndex].dataset.src || galleryItems[lbIndex].querySelector('img')?.src;
    const alt = galleryItems[lbIndex].querySelector('img')?.alt || '';
    lbImg.src = src; lbImg.alt = alt;
    lbCount.textContent = `${lbIndex + 1} / ${galleryItems.length}`;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => showLightbox(i));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showLightbox(i); }
    });
  });
  if (lb) {
    $('#lbClose')?.addEventListener('click', closeLb);
    $('#lbNext')?.addEventListener('click', () => showLightbox(lbIndex + 1));
    $('#lbPrev')?.addEventListener('click', () => showLightbox(lbIndex - 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  }

  document.addEventListener('keydown', (e) => {
    if (lb && lb.classList.contains('open')) {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
      if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
    }
    if (quoteModal && quoteModal.classList.contains('open') && e.key === 'Escape') closeQuote();
  });

  /* ---------- SERVICES INTERACTIVE PANEL ---------- */
  const scMenuItems = $$('.sc-menu-item');
  const scSlides = $$('.sc-slide');

  if (scMenuItems.length && scSlides.length) {
    let currentService = 0;
    let autoTimer = null;

    function activateService(index) {
      if (index === currentService) return;
      currentService = index;
      scMenuItems.forEach((item, i) => {
        const isActive = i === index;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      scSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    scMenuItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        activateService(i);
        resetAuto();
      });
      if (isHover) {
        item.addEventListener('mouseenter', () => {
          activateService(i);
          resetAuto();
        });
      }
    });

    function startAuto() {
      autoTimer = setInterval(() => {
        const nextIdx = (currentService + 1) % scSlides.length;
        activateService(nextIdx);
      }, 6000);
    }
    function resetAuto() {
      if (autoTimer) clearInterval(autoTimer);
      startAuto();
    }

    const showcaseEl = $('.services-showcase');
    if (showcaseEl) {
      showcaseEl.addEventListener('mouseenter', () => {
        if (autoTimer) clearInterval(autoTimer);
      });
      showcaseEl.addEventListener('mouseleave', () => {
        resetAuto();
      });
    }

    startAuto();
  }

  /* ---------- TESTIMONIALS CAROUSEL ---------- */
  const tcTrack = $('#tcTrack');
  const tcDots  = $('#tcDots');
  const tcPrev  = $('#tcPrev');
  const tcNext  = $('#tcNext');

  if (tcTrack) {
    const cards = Array.from(tcTrack.children);
    const total = cards.length;
    let perView = 3;
    let index = 0;

    function calcPerView() {
      const w = window.innerWidth;
      if (w <= 768) return 1;
      if (w <= 1200) return 2;
      return 3;
    }
    function maxIndex() { return Math.max(0, total - perView); }

    function renderDots() {
      if (!tcDots) return;
      tcDots.innerHTML = '';
      for (let i = 0; i <= maxIndex(); i++) {
        const b = document.createElement('button');
        b.className = 'tc-dot' + (i === index ? ' active' : '');
        b.type = 'button';
        b.setAttribute('aria-label', `Go to slide ${i + 1}`);
        b.addEventListener('click', () => { index = i; update(); });
        tcDots.appendChild(b);
      }
    }

    function update() {
      perView = calcPerView();
      if (index > maxIndex()) index = maxIndex();
      const gap = 20;
      const cardW = cards[0].getBoundingClientRect().width;
      const shift = index * (cardW + gap);
      tcTrack.style.transform = `translateX(-${shift}px)`;
      if (tcPrev) tcPrev.disabled = index <= 0;
      if (tcNext) tcNext.disabled = index >= maxIndex();
      if (tcDots) {
        Array.from(tcDots.children).forEach((d, i) => d.classList.toggle('active', i === index));
      }
    }

    function next() { if (index < maxIndex()) { index++; update(); } }
    function prev() { if (index > 0) { index--; update(); } }

    if (tcNext) tcNext.addEventListener('click', next);
    if (tcPrev) tcPrev.addEventListener('click', prev);

    let timer = setInterval(() => {
      if (index >= maxIndex()) index = 0; else index++;
      update();
    }, 6000);
    tcTrack.addEventListener('mouseenter', () => clearInterval(timer));

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { renderDots(); update(); }, 150);
    });

    renderDots();
    setTimeout(update, 100);
  }

  /* ---------- Forms ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function fieldError(input, msg) {
    const field = input.closest('.cf-field');
    const err = field?.querySelector('.cf-err');
    if (field) field.classList.toggle('error', !!msg);
    if (err) err.textContent = msg || '';
  }
  function clearFormErrors(form) {
    $$('.cf-field.error', form).forEach((f) => f.classList.remove('error'));
    $$('.cf-err', form).forEach((e) => (e.textContent = ''));
  }
  function validDate(d, m, y) {
    const day = parseInt(d, 10), mon = parseInt(m, 10), yr = parseInt(y, 10);
    if (!day || !mon || !yr || yr < 2024 || yr > 2100) return false;
    if (mon < 1 || mon > 12 || day < 1 || day > 31) return false;
    const dt = new Date(yr, mon - 1, day);
    return dt.getDate() === day && dt.getMonth() === mon - 1 && dt.getFullYear() === yr;
  }
  async function submitToWeb3(form, statusEl, btn, okMsg) {
    if (!form || form.dataset.busy === '1') return;
    form.dataset.busy = '1';
    clearFormErrors(form);
    const originalHTML = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = '<span>Sending…</span>'; }
    if (statusEl) { statusEl.className = 'cf-status'; statusEl.textContent = ''; }
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        if (statusEl) { statusEl.className = 'cf-status ok'; statusEl.textContent = okMsg; }
        form.reset();
      } else {
        throw new Error(data.message || 'Failed');
      }
    } catch (err) {
      if (statusEl) {
        statusEl.className = 'cf-status err';
        statusEl.textContent = 'Something went wrong. Please try again or call us directly.';
      }
    } finally {
      form.dataset.busy = '0';
      if (btn) { btn.disabled = false; btn.innerHTML = originalHTML; }
    }
  }

  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      const name = $('#cName'), email = $('#cEmail'), msg = $('#cMsg');
      if (!name.value.trim()) { fieldError(name, 'Please enter your name.'); ok = false; }
      if (!EMAIL_RE.test(email.value.trim())) { fieldError(email, 'Enter a valid email.'); ok = false; }
      if (!msg.value.trim()) { fieldError(msg, 'Please enter a message.'); ok = false; }
      if (!ok) return;
      submitToWeb3(contactForm, $('#contactStatus'), $('#contactBtn'), 'Thank you! Your message has been sent.');
    });
  }

  const quoteForm = $('#quoteForm');
  if (quoteForm) {
    const qPhone = $('#qPhone');
    if (qPhone) qPhone.addEventListener('input', () => {
      qPhone.value = qPhone.value.replace(/\D/g, '').slice(0, 10);
    });
    [['#qDay', 2], ['#qMonth', 2], ['#qYear', 4]].forEach(([sel, max]) => {
      const el = $(sel);
      if (el) el.addEventListener('input', () => { el.value = el.value.replace(/\D/g, '').slice(0, max); });
    });

    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      const first = $('#qFirst'), last = $('#qLast'), email = $('#qEmail');
      const phone = $('#qPhone'), event = $('#qEvent');
      const day = $('#qDay'), mon = $('#qMonth'), yr = $('#qYear');
      if (!first.value.trim()) { fieldError(first, 'Required.'); ok = false; }
      if (!last.value.trim())  { fieldError(last, 'Required.'); ok = false; }
      if (!EMAIL_RE.test(email.value.trim())) { fieldError(email, 'Invalid email.'); ok = false; }
      if (!/^\d{10}$/.test(phone.value.trim())) { fieldError(phone, '10-digit number required.'); ok = false; }
      if (!event.value.trim()) { fieldError(event, 'Required.'); ok = false; }
      const dateErr = $('#qDateErr');
      if (!validDate(day.value, mon.value, yr.value)) {
        if (dateErr) dateErr.textContent = 'Enter a valid future date (DD/MM/YYYY).';
        ok = false;
      } else if (dateErr) {
        dateErr.textContent = '';
      }
      if (!ok) return;
      submitToWeb3(quoteForm, $('#quoteStatus'), $('#quoteBtn'),
        "Thank you! Your inquiry has been submitted. We'll respond within 24 hours.");
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(
    '.features, .about-grid, .services-head, .services-showcase, .process-head, .process-step, ' +
    '.testimonials-head, .testimonials-carousel, .gallery-head, .g-item, ' +
    '.contact-h, .contact-grid, .image-break-text'
  );
  if (reveals.length && 'IntersectionObserver' in window) {
    reveals.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1)';
    });
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 60);
          ro.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach((el) => ro.observe(el));
  }
})();