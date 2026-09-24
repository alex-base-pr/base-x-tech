// Home (design v2): roadmap emphasis follows hover / focus / scroll. All step text is already in the HTML.
document.addEventListener('DOMContentLoaded', () => {
  const steps = [...document.querySelectorAll('.h-step')];
  if (!steps.length) return;
  const activate = (step) => steps.forEach((s) => s.classList.toggle('is-active', s === step));
  steps.forEach((s) => {
    s.addEventListener('mouseenter', () => activate(s));
    s.addEventListener('focus', () => activate(s));
  });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) activate(e.target); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    steps.forEach((s) => io.observe(s));
  }
});
