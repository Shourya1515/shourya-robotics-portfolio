(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================
  // Header: scrolled state + mobile menu
  // =========================
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (header && navToggle && nav) {
    const setOpen = open => {
      header.classList.toggle('nav-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    };
    navToggle.addEventListener('click', () => setOpen(!header.classList.contains('nav-open')));
    nav.addEventListener('click', e => {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', e => {
      if (!header.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // =========================
  // Scroll reveal
  // =========================
  document.querySelectorAll('[data-stagger]').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--delay', `${Math.min(i, 6) * 70}ms`);
    });
  });

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    // threshold 0 so tall elements still trigger on small screens
    const revealer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -6% 0px' }
    );
    revealEls.forEach(el => revealer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // =========================
  // Active nav link while scrolling (home page)
  // =========================
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach(s => spy.observe(s));
  }

  // =========================
  // Project filters (home page)
  // =========================
  const filterBtns = Array.from(document.querySelectorAll('[data-filter]'));
  const cards = Array.from(document.querySelectorAll('.project-card[data-category]'));

  if (filterBtns.length && cards.length) {
    const matches = (card, filter) =>
      filter === 'all' || card.dataset.category.split(' ').includes(filter);

    filterBtns.forEach(btn => {
      const count = btn.querySelector('.filter-count');
      if (count) count.textContent = cards.filter(c => matches(c, btn.dataset.filter)).length;

      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        cards.forEach(card => {
          const show = matches(card, btn.dataset.filter);
          card.classList.toggle('is-hidden', !show);
          if (show) card.classList.add('is-visible');
        });
      });
    });
  }

  // =========================
  // Only one video plays at a time
  // =========================
  const videos = () => Array.from(document.querySelectorAll('video'));
  document.addEventListener(
    'play',
    e => {
      if (e.target.tagName !== 'VIDEO') return;
      videos().forEach(v => {
        if (v !== e.target) v.pause();
      });
    },
    true
  );

  // =========================
  // Lightbox for galleries
  // =========================
  const modal = document.getElementById('lightbox-modal');
  const items = Array.from(document.querySelectorAll('[data-lightbox-item]'));

  if (modal && items.length) {
    const contentEl = modal.querySelector('.lightbox-content');
    const textEl = modal.querySelector('.lightbox-text');
    const counterEl = modal.querySelector('.lightbox-counter');
    const prevBtn = modal.querySelector('[data-lightbox-prev]');
    const nextBtn = modal.querySelector('[data-lightbox-next]');
    const closeBtn = modal.querySelector('.lightbox-close');
    const single = items.length < 2;
    let index = 0;
    let lastFocus = null;

    if (single) {
      prevBtn.hidden = true;
      nextBtn.hidden = true;
    }

    const render = () => {
      const item = items[index];
      const type = item.dataset.type || 'image';
      const caption = item.dataset.caption || '';
      let media;

      if (type === 'video') {
        media = document.createElement('video');
        media.controls = true;
        media.playsInline = true;
        media.preload = 'metadata';
        if (item.dataset.poster) media.poster = item.dataset.poster;
        media.src = item.dataset.src;
      } else {
        media = document.createElement('img');
        media.alt = caption;
        media.decoding = 'async';
        media.src = item.dataset.src;
      }

      contentEl.replaceChildren(media);
      textEl.textContent = caption;
      counterEl.textContent = single ? '' : `${index + 1} / ${items.length}`;
    };

    const open = i => {
      index = i;
      lastFocus = document.activeElement;
      render();
      modal.classList.add('is-open');
      root.classList.add('lightbox-open');
      closeBtn.focus({ preventScroll: true });
    };

    const close = () => {
      modal.classList.remove('is-open');
      root.classList.remove('lightbox-open');
      contentEl.replaceChildren();
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };

    const step = delta => {
      if (single) return;
      index = (index + delta + items.length) % items.length;
      render();
    };

    items.forEach((item, i) => item.addEventListener('click', () => open(i)));
    prevBtn.addEventListener('click', () => step(-1));
    nextBtn.addEventListener('click', () => step(1));
    modal.querySelectorAll('[data-lightbox-close]').forEach(el => el.addEventListener('click', close));

    // Clicking the empty space around the media also closes
    modal.addEventListener('click', e => {
      if (e.target === modal || e.target.classList.contains('lightbox-inner') || e.target === contentEl) close();
    });

    document.addEventListener('keydown', e => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') {
        // keep focus inside the dialog
        const focusable = Array.from(modal.querySelectorAll('button, video')).filter(
          el => !el.hidden && el.offsetParent !== null
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Swipe left / right on touch screens
    let touchX = null;
    modal.addEventListener('touchstart', e => {
      touchX = e.touches[0].clientX;
    }, { passive: true });
    modal.addEventListener('touchend', e => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      touchX = null;
    });
  }
})();
