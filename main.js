/**********************************************
 *  SCROLL REVEAL ANIMATION
 **********************************************/
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

/**********************************************
 *  THEME + MOTION SWITCHING
 **********************************************/
const body = document.body;

document.querySelectorAll('.switch-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    const motion = btn.dataset.motion;

    if (theme) {
      body.classList.remove('theme-clean','theme-neon','theme-ai');
      body.classList.add(theme);
      document.querySelectorAll('[data-theme]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    }

    if (motion) {
      body.classList.remove('anim-soft','anim-medium','anim-high');
      body.classList.add(motion);
      document.querySelectorAll('[data-motion]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    }
  });
});


/**********************************************
 *  GLOBAL LIGHTBOX (Images + Videos)
 *  - Fullscreen viewer
 *  - Close button
 *  - Left/Right arrows
 *  - Swipe support
 *  - Videos DO NOT autoplay
 **********************************************/

let lightboxItems = [];
let lightboxIndex = 0;

function buildLightboxItems() {
  lightboxItems = Array.from(document.querySelectorAll(".gallery-item"));
  lightboxItems.forEach((el, idx) => {
    el.dataset.lbIndex = idx;
    el.addEventListener("click", () => openLightbox(idx));
  });
}

function openLightbox(index) {
  lightboxIndex = index;
  const item = lightboxItems[index];
  if (!item) return;

  const src = item.getAttribute("data-src");
  const type = item.getAttribute("data-type");

  const modal = document.createElement("div");
  modal.id = "lightbox-modal";
  modal.classList.add("lightbox-modal");

  let content = "";
  if (type === "image") {
    content = `<img src="${src}" class="lightbox-content" />`;
  } else {
    content = `
      <video class="lightbox-content" controls>
        <source src="${src}" type="video/mp4">
        Your browser does not support the video tag.
      </video>`;
  }

  modal.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <button id="lightbox-close" class="lightbox-close">×</button>
    <button id="lightbox-prev" class="lightbox-arrow left">‹</button>
    <button id="lightbox-next" class="lightbox-arrow right">›</button>
    <div class="lightbox-container">
      ${content}
    </div>
  `;

  document.body.appendChild(modal);

  // Close
  document.getElementById("lightbox-close").onclick = closeLightbox;
  modal.querySelector(".lightbox-backdrop").onclick = closeLightbox;

  // Arrows
  document.getElementById("lightbox-prev").onclick = () => navigateLightbox(-1);
  document.getElementById("lightbox-next").onclick = () => navigateLightbox(1);

  // ESC key closes
  document.addEventListener("keydown", escListener);

  // Mobile swipe support
  let startX = 0;
  modal.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  modal.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) navigateLightbox(-1);
    if (startX - endX > 50) navigateLightbox(1);
  });
}

function escListener(e) {
  if (e.key === "Escape") closeLightbox();
}

function closeLightbox() {
  const modal = document.getElementById("lightbox-modal");
  if (modal) modal.remove();
  document.removeEventListener("keydown", escListener);
}

function navigateLightbox(direction) {
  if (!lightboxItems.length) return;

  lightboxIndex += direction;
  if (lightboxIndex < 0) lightboxIndex = lightboxItems.length - 1;
  if (lightboxIndex >= lightboxItems.length) lightboxIndex = 0;

  closeLightbox();
  openLightbox(lightboxIndex);
}

document.addEventListener("DOMContentLoaded", buildLightboxItems);
