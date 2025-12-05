
// scroll reveal
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
