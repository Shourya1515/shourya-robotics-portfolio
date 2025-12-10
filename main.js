// =========================
// Scroll reveal
// =========================
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// =========================
// Theme + motion switcher
// =========================
const body = document.body;
document.querySelectorAll('.switch-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    const motion = btn.dataset.motion;

    if (theme) {
      body.classList.remove('theme-clean', 'theme-neon', 'theme-ai');
      body.classList.add(theme);
      document.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    if (motion) {
      body.classList.remove('anim-soft', 'anim-medium', 'anim-high');
      body.classList.add(motion);
      document.querySelectorAll('[data-motion]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  });
});

// =========================
// Lightbox for galleries
// =========================
(function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  const items = Array.from(document.querySelectorAll('[data-lightbox-item]'));
  if (!items.length) return;

  const contentEl  = modal.querySelector('.lightbox-content');
  const captionEl  = modal.querySelector('.lightbox-caption');
  const prevBtn    = modal.querySelector('[data-lightbox-prev]');
  const nextBtn    = modal.querySelector('[data-lightbox-next]');
  const closeEls   = modal.querySelectorAll('[data-lightbox-close]');

  let currentIndex = 0;

  function openAt(index) {
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;

    const item    = items[currentIndex];
    const type    = item.dataset.type || 'image';
    const src     = item.dataset.src;
    const caption = item.dataset.caption || '';

    // Clear old media
    contentEl.innerHTML = '';

    if (type === 'video') {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.playsInline = true;
      // Do NOT autoplay – user controls play/pause
      contentEl.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = caption || '';
      contentEl.appendChild(img);
    }

    captionEl.textContent = caption;
    modal.classList.add('is-open');
  }

  function closeLightbox() {
    modal.classList.remove('is-open');
    contentEl.innerHTML = '';
  }

  items.forEach((btn, index) => {
    btn.addEventListener('click', () => openAt(index));
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => openAt(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => openAt(currentIndex + 1));
  }

  closeEls.forEach(el => {
    el.addEventListener('click', closeLightbox);
  });

  modal.addEventListener('click', e => {
    if (e.target.classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      openAt(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      openAt(currentIndex - 1);
    }
  });
})();
