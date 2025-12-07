// ---------------------
// Scroll reveal
// ---------------------
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

// ---------------------
// Theme + motion switcher
// ---------------------
const body = document.body;
document.querySelectorAll('.switch-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    const motion = btn.dataset.motion;

    if (theme) {
      body.classList.remove('theme-clean', 'theme-neon', 'theme-ai');
      body.classList.add(theme);
      document
        .querySelectorAll('[data-theme]')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    if (motion) {
      body.classList.remove('anim-soft', 'anim-medium', 'anim-high');
      body.classList.add(motion);
      document
        .querySelectorAll('[data-motion]')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  });
});

// ---------------------
// Lightbox / gallery viewer
// ---------------------
(function () {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return; // if a page has no modal, skip

  const backdrop = modal.querySelector('[data-lightbox-close]');
  const closeBtn = modal.querySelector('.lightbox-close');
  const prevBtn = modal.querySelector('[data-lightbox-prev]');
  const nextBtn = modal.querySelector('[data-lightbox-next]');
  const content = modal.querySelector('.lightbox-content');
  const captionEl = modal.querySelector('.lightbox-caption');

  let galleryItems = [];
  let currentIndex = 0;

  function getVideoEl() {
    return content.querySelector('video');
  }

  function pauseVideo() {
    const v = getVideoEl();
    if (v && !v.paused) v.pause();
  }

  function openModal(items, index) {
    galleryItems = items;
    currentIndex = index;

    renderCurrent();
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeModal() {
    pauseVideo();
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    content.innerHTML = '';
    captionEl.textContent = '';
  }

  function renderCurrent() {
    const item = galleryItems[currentIndex];
    if (!item) return;

    const type = item.dataset.type || 'image';
    const src = item.dataset.src;
    const caption = item.dataset.caption || '';

    content.innerHTML = '';
    captionEl.textContent = caption;

    if (type === 'video') {
      const wrapper = document.createElement('div');
      wrapper.className = 'lightbox-video-wrapper';

      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.playsInline = true;

      wrapper.appendChild(video);
      content.appendChild(wrapper);
    } else {
      const img = new Image();
      img.src = src;
      img.alt = caption;
      img.className = 'lightbox-image';
      content.appendChild(img);
    }
  }

  function gotoNext() {
    if (!galleryItems.length) return;
    pauseVideo();
    currentIndex = (currentIndex + 1) % galleryItems.length;
    renderCurrent();
  }

  function gotoPrev() {
    if (!galleryItems.length) return;
    pauseVideo();
    currentIndex =
      (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    renderCurrent();
  }

  // Attach events for all galleries on the page
  document.querySelectorAll('.project-gallery').forEach(gallery => {
    const items = Array.from(
      gallery.querySelectorAll('[data-lightbox-item]')
    );

    items.forEach((el, idx) => {
      el.addEventListener('click', () => openModal(items, idx));
    });
  });

  // Modal controls
  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  nextBtn.addEventListener('click', gotoNext);
  prevBtn.addEventListener('click', gotoPrev);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      gotoNext();
    } else if (e.key === 'ArrowLeft') {
      gotoPrev();
    }
  });

  // Basic touch swipe (mobile)
  let startX = null;
  modal.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  modal.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx > 50) {
      gotoPrev();
    } else if (dx < -50) {
      gotoNext();
    }
    startX = null;
  });
})();
