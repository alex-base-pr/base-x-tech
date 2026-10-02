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

// Roadmap titles: letter-stagger roll on hover/focus (Figma #114/#115, Ira, ref: Webflow letter stagger).
// The h3 keeps its text for screen readers (aria-label); the letters are a decorative copy.
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.h-step__title').forEach((h) => {
    const text = h.textContent.trim();
    h.setAttribute('aria-label', text);
    const wrap = document.createElement('span');
    wrap.className = 'h-ltrs'; wrap.setAttribute('aria-hidden', 'true');
    [...text].forEach((ch, i) => {
      const c = ch === ' ' ? ' ' : ch;
      const outer = document.createElement('span'); outer.className = 'h-ltr'; outer.style.setProperty('--i', i);
      const inner = document.createElement('span'); inner.textContent = c; inner.dataset.c = c;
      outer.appendChild(inner); wrap.appendChild(outer);
    });
    h.textContent = ''; h.appendChild(wrap);
  });
});

// "Numbers that matter" (Figma #116, Ira): on scroll the heading and closing line spread apart and blur,
// then the three stat tiles appear between them. Without JS or with reduced motion everything is static and sharp.
document.addEventListener('DOMContentLoaded', () => {
  const sec = document.querySelector('.h-stats');
  if (!sec || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const title = sec.querySelector('.h-stats__title'), list = sec.querySelector('.h-stats__list'), closing = sec.querySelector('.h-stats__closing');
  if (!title || !list || !closing) return;
  sec.classList.add('is-motion');
  const ease = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = sec.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9)));      // 0 when the section enters, 1 when it is well in view
    const gap = list.offsetHeight / 2 + 16;
    const spread = ease(0.15, 0.6, p), show = ease(0.55, 0.9, p);
    const blur = (spread * (1 - show) * 4).toFixed(2); // blur peaks while the lines spread, sharp again once the stats are in
    title.style.transform = `translateY(${(1 - spread) * gap}px)`;
    closing.style.transform = `translateY(${-(1 - spread) * gap}px)`;
    title.style.filter = closing.style.filter = `blur(${blur}px)`;
    list.style.opacity = show.toFixed(3);
    list.style.transform = `translateY(${(1 - show) * 24}px) scale(${(0.94 + show * 0.06).toFixed(3)})`;
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
});
