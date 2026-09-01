(() => {
  'use strict';

  /* ---------------------------------------------------------
     Scroll reveal
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-child');

  document.querySelectorAll('.dish-list').forEach(list => {
    [...list.children].forEach((el, i) => el.style.setProperty('--i', i));
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------------------------------------------------
     Scrollspy — highlight active category in nav
  --------------------------------------------------------- */
  const navLinks = [...document.querySelectorAll('.menu-nav a')];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(sec => spy.observe(sec));
  }

  /* ---------------------------------------------------------
     Scroll progress bar + back-to-top visibility
  --------------------------------------------------------- */
  const bar = document.getElementById('scrollBar');
  const toTopBtn = document.getElementById('toTop');
  const heroEl = document.getElementById('hero');

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (scrollTop / max) * 100 : 0;
      if (bar) bar.style.width = pct + '%';

      const heroHeight = heroEl ? heroEl.offsetHeight : 400;
      if (toTopBtn) toTopBtn.classList.toggle('visible', scrollTop > heroHeight * 0.6);

      ticking = false;
    });
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     Keep the tapped nav pill centered in view (mobile)
  --------------------------------------------------------- */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });
})();
