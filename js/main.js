/* =====================================================
   SafeWebsite — main.js
   Shared JavaScript across all pages
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Page load fade-in
  requestAnimationFrame(() => document.body.classList.add('loaded'));

  initNavbar();
  initScrollAnimations();
  initStatsCounters();
  initCyclingText();
  initGalleryFilter();
  initBeforeAfterSliders();
});

/* ── Navbar: scroll opacity + mobile menu ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ── Intersection Observer: scroll-triggered fade-in ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));
}

/* ── Stats counter animation ── */
function initStatsCounters() {
  const statEls = document.querySelectorAll('.stat-number[data-target]');
  if (!statEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    el.textContent = prefix + Math.floor(current) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ── Cycling text (home page) ── */
function initCyclingText() {
  const el = document.getElementById('cycling-text');
  if (!el) return;

  const phrases = [
    'Expert technicians with years of hands-on experience.',
    'Factory-grade protection for every vehicle.',
    'Precision craftsmanship on every single car.',
    'Trusted by car enthusiasts and fleet owners alike.'
  ];

  let index = 0;
  el.textContent = phrases[0];

  setInterval(() => {
    el.classList.add('fade-text');
    setTimeout(() => {
      index = (index + 1) % phrases.length;
      el.textContent = phrases[index];
      el.classList.remove('fade-text');
    }, 600);
  }, 3400);
}

/* ── Gallery filter ── */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        if (match) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          });
        } else {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

/* ── Before/After image slider ── */
function initBeforeAfterSliders() {
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const handle = slider.querySelector('.ba-handle');
    const before = slider.querySelector('.ba-before');
    if (!handle || !before) return;

    let isDragging = false;

    function setPosition(clientX) {
      const rect = slider.getBoundingClientRect();
      let pos = (clientX - rect.left) / rect.width;
      pos = Math.max(0.03, Math.min(0.97, pos));
      const pct = pos * 100;
      handle.style.left = `${pct}%`;
      before.style.clipPath = `inset(0 ${(100 - pct).toFixed(2)}% 0 0)`;
    }

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) setPosition(e.clientX);
    });

    document.addEventListener('mouseup', () => { isDragging = false; });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (isDragging) setPosition(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('touchend', () => { isDragging = false; });
  });
}
