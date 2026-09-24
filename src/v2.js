// Design v2 interactions. Content is always in the HTML; JS only moves emphasis and opens menus.
document.addEventListener('DOMContentLoaded', () => {
  // Services dropdown and language menu in the header
  const toggle = (btn, panel) => {
    if (!btn || !panel) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (!panel.hidden && !panel.contains(e.target)) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
  };
  toggle(document.querySelector('[data-v2-services]'), document.getElementById('v2-services-menu'));
  toggle(document.querySelector('[data-v2-lang]'), document.querySelector('.v2-lang__menu'));

  // Emphasis follows hover/focus (capabilities rows, "when we can help" columns)
  const follow = (selector) => {
    const items = [...document.querySelectorAll(selector)];
    items.forEach((item) => {
      const activate = () => items.forEach((i) => i.classList.toggle('is-active', i === item));
      item.addEventListener('mouseenter', activate);
      item.addEventListener('focus', activate);
    });
  };
  follow('.v2-caps__item');
  follow('.v2-help__item');

  // Client stories tabs (WAI-ARIA tabs pattern)
  document.querySelectorAll('[data-v2-tabs]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (!next) return;
        e.preventDefault();
        const t = tabs[(i + next + tabs.length) % tabs.length];
        select(t); t.focus();
      });
    });
  });

  // Left rail: highlight the dot of the section in view
  const dots = [...document.querySelectorAll('.v2-rail span')];
  const sections = [...document.querySelectorAll('[data-v2-section]')];
  if (dots.length && sections.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = Math.min(dots.length - 1, Math.floor(sections.indexOf(entry.target) * dots.length / sections.length));
        dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }
});
