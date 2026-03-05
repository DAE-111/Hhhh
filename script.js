/* ============================================================
   ConsBlock – script.js
   ============================================================ */

/* ---------- Navbar scroll behaviour ---------- */
(function () {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ---------- Mobile menu toggle ---------- */
(function () {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });
})();

/* ---------- Copy server IP ---------- */
function copyIP() {
  const ip = document.getElementById('serverIP').textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(ip).then(showToast).catch(() => fallbackCopy(ip));
  } else {
    fallbackCopy(ip);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast();
}

function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ---------- Simulated player count ---------- */
(function () {
  const el = document.getElementById('playerCount');
  if (!el) return;

  function randomPlayers() {
    return Math.floor(Math.random() * 300) + 850;
  }

  function updateCount() {
    el.textContent = randomPlayers().toLocaleString('id-ID') + ' online';
  }

  updateCount();
  setInterval(updateCount, 15000);
})();

/* ---------- Animated counter (stats bar) ---------- */
(function () {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  let started = false;

  function easeOutQuad(t) { return t * (2 - t); }

  function animateCounters() {
    if (started) return;
    started = true;

    counters.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || (target >= 99 ? '%' : '+');
      const duration = 1800;
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const val = Math.floor(easeOutQuad(progress) * target);
        el.textContent = val >= 1000
          ? val.toLocaleString('id-ID') + suffix
          : val + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) animateCounters(); });
  }, { threshold: 0.4 });

  const bar = document.querySelector('.stats-bar');
  if (bar) observer.observe(bar);
})();

/* ---------- Floating particles in hero ---------- */
(function () {
  const container = document.getElementById('particles');
  if (!container) return;

  const emojis = ['⛏', '🧱', '💎', '🪙', '⭐', '🌿', '🔥', '❄️', '🏹', '⚔️'];
  const count  = 22;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className  = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const size  = Math.random() * 1.2 + 0.6;
    const tx    = (Math.random() - 0.5) * 60;
    const ty    = -(Math.random() * 50 + 10);
    const rot   = (Math.random() - 0.5) * 60;
    const dur   = Math.random() * 6 + 6;
    const delay = Math.random() * 8;

    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      font-size: ${size}rem;
      --tx: ${tx}px;
      --ty: ${ty}px;
      --rot: ${rot}deg;
      --dur: ${dur}s;
      --delay: ${delay}s;
    `;
    container.appendChild(p);
  }
})();

/* ---------- Intersection observer – fade-in ---------- */
(function () {
  const targets = document.querySelectorAll(
    '.mode-card, .feature-card, .step, .rank-card, .vote__text, .vote__image, .discord-cta__text'
  );

  targets.forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();

/* ---------- Smooth active nav highlight ---------- */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__menu .nav-link:not(.btn)');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}`
        ? 'var(--accent)'
        : '';
    });
  }, { passive: true });
})();
