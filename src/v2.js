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
  // Mobile menu (layout/v2/nav.ejs): main.js toggles body.nav-active; here only ARIA state and the Services level.
  const burger = document.querySelector('.v2-header__burger');
  const mnav = document.getElementById('v2-mnav');
  if (burger && mnav) {
    const main = mnav.querySelector('[data-v2-mnav-main]');
    const sub = mnav.querySelector('[data-v2-mnav-sub]');
    const opener = mnav.querySelector('[data-v2-mnav-open]');
    const showSub = (on) => {
      main.hidden = on; sub.hidden = !on;
      opener.setAttribute('aria-expanded', String(on));
      (on ? sub.querySelector('a, button') : opener).focus();
    };
    opener.addEventListener('click', () => showSub(true));
    mnav.querySelector('[data-v2-mnav-back]').addEventListener('click', () => showSub(false));
    burger.setAttribute('aria-controls', 'v2-mnav');
    burger.setAttribute('aria-expanded', 'false');
    new MutationObserver(() => {
      const open = document.body.classList.contains('nav-active');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', (open ? burger.dataset.labelClose : burger.dataset.labelOpen) || (open ? 'Close menu' : 'Menu'));
      if (!open && !sub.hidden) { main.hidden = false; sub.hidden = true; opener.setAttribute('aria-expanded', 'false'); }
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) document.body.classList.remove('nav-active'); });
  }

  // Contact modal (layout/v2/form.ejs): focus the first field on open, Escape closes, focus returns to the trigger.
  // Triggers carry href="#contact" as a no-JS fallback; preventDefault keeps the page from jumping.
  // The service select is pre-set from <main data-service> (exact option value) each time the modal opens.
  const modal = document.querySelector('.v2-modal');
  if (modal) {
    let lastTrigger = null;
    const serviceSelect = modal.querySelector('select[name="service"]');
    const pageService = document.querySelector('main[data-service]')?.dataset.service;
    let picked = false; // the visitor's own choice wins over the page default
    serviceSelect?.addEventListener('change', () => { picked = true; });
    const preselect = () => {
      if (!serviceSelect || !pageService || picked) return;
      if ([...serviceSelect.options].some((o) => o.value === pageService)) serviceSelect.value = pageService;
    };
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-form-trigger]');
      if (!t) return;
      e.preventDefault();
      if (!modal.classList.contains('active')) preselect();
      lastTrigger = t;
      setTimeout(() => modal.querySelector('input:not([type=hidden]), .v2-modal__close')?.focus(), 50);
    });
    preselect();
    // A shared link to …#contact opens the form instead of looking for an anchor.
    if (location.hash === '#contact') {
      document.querySelector('.v2-header [data-form-trigger]')?.click();
      try { history.replaceState(null, '', location.pathname + location.search); } catch (err) { /* ignore */ }
    }
    new MutationObserver(() => {
      if (!modal.classList.contains('active') && lastTrigger && modal.contains(document.activeElement)) { lastTrigger.focus(); lastTrigger = null; }
    }).observe(modal, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) modal.querySelector('.v2-modal__close').click();
    });
  }
});
