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

  const navEl = document.querySelector('.menu-nav');

  // Scrolls only the nav's own horizontal track — never the page — so the
  // active pill stays in view as the user scrolls, even without tapping it.
  const centerNavLink = (link) => {
    if (!navEl || !link) return;
    const navRect = navEl.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const delta = (linkRect.left + linkRect.width / 2) - (navRect.left + navRect.width / 2);
    if (Math.abs(delta) < 2) return;
    navEl.scrollTo({ left: navEl.scrollLeft + delta, behavior: 'smooth' });
  };

  const setActive = (id) => {
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      if (isActive) centerNavLink(link);
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
     Also center immediately on tap, without waiting for the
     scrollspy to catch up with the smooth-scroll animation
  --------------------------------------------------------- */
  navLinks.forEach(link => {
    link.addEventListener('click', () => centerNavLink(link));
  });
})();
