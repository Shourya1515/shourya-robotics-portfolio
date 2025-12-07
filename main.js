// --------------------------------------------------
// Scroll reveal
// --------------------------------------------------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// --------------------------------------------------
// Theme / motion switcher
// --------------------------------------------------
const body = document.body;

document.querySelectorAll(".switch-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    const motion = btn.dataset.motion;

    if (theme) {
      body.classList.remove("theme-clean", "theme-neon", "theme-ai");
      body.classList.add(theme);
      document
        .querySelectorAll("[data-theme]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }

    if (motion) {
      body.classList.remove("anim-soft", "anim-medium", "anim-high");
      body.classList.add(motion);
      document
        .querySelectorAll("[data-motion]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }
  });
});

// --------------------------------------------------
// Lightbox (images + videos, shared on all pages)
// --------------------------------------------------
(function initLightbox() {
  const items = Array.from(document.querySelectorAll("[data-lightbox-item]"));
  const modal = document.getElementById("lightbox-modal");
  if (!modal || items.length === 0) return;

  const contentEl = modal.querySelector(".lightbox-content");
  const captionEl = modal.querySelector(".lightbox-caption");
  const closeEls = modal.querySelectorAll("[data-lightbox-close]");
  const prevBtn = modal.querySelector("[data-lightbox-prev]");
  const nextBtn = modal.querySelector("[data-lightbox-next]");

  const gallery = items.map((el) => ({
    type: el.dataset.type,
    src: el.dataset.src,
    caption: el.dataset.caption || "",
  }));

  let currentIndex = 0;

  function openAt(index) {
    currentIndex = ((index % gallery.length) + gallery.length) % gallery.length;
    const item = gallery[currentIndex];

    // Clear previous
    contentEl.innerHTML = "";

    if (item.type === "video") {
      const vid = document.createElement("video");
      vid.src = item.src;
      vid.controls = true;
      vid.autoplay = false; // user starts playback
      contentEl.appendChild(vid);
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.caption || "Gallery image";
      contentEl.appendChild(img);
    }

    captionEl.textContent = item.caption || "";
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    const vid = contentEl.querySelector("video");
    if (vid) vid.pause();
  }

  function next() {
    openAt(currentIndex + 1);
  }
  function prev() {
    openAt(currentIndex - 1);
  }

  items.forEach((el, index) => {
    el.addEventListener("click", () => openAt(index));
  });

  closeEls.forEach((el) =>
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      close();
    })
  );

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });

  modal
    .querySelector(".lightbox-backdrop")
    .addEventListener("click", () => close());

  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
})();
