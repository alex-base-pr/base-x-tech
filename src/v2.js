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
    // GA4 funnel (contact-form review 2026-09-30): form_open → form_start (src/main.js) → generate_lead.
    // Sent when the modal becomes active (main.js opens it; the click handlers run in either order).
    let wasOpen = false;
    new MutationObserver(() => {
      const isOpen = modal.classList.contains('active');
      if (isOpen && !wasOpen && typeof gtag === 'function') gtag('event', 'form_open', { page_path: location.pathname, trigger: ((lastTrigger && lastTrigger.textContent) || '').trim().slice(0, 40) });
      wasOpen = isOpen;
    }).observe(modal, { attributes: true, attributeFilter: ['class'] });
    new MutationObserver(() => {
      if (!modal.classList.contains('active') && lastTrigger && modal.contains(document.activeElement)) { lastTrigger.focus(); lastTrigger = null; }
    }).observe(modal, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) modal.querySelector('.v2-modal__close').click();
    });

    // WebMCP (2026-10-01): lets a browser AI agent open the contact form already filled in for its user. The agent never
    // sends it: the visitor reviews and presses Send. The form also carries declarative toolname/toolparam attributes.
    const mc = document.modelContext || navigator.modelContext;
    const form = modal.querySelector('#task-form');
    if (mc && typeof mc.registerTool === 'function' && form) {
      const services = [...form.querySelectorAll('select[name="service"] option')].map((o) => o.value);
      const budgets = [...form.querySelectorAll('input[name="budget"]')].map((i) => i.value);
      try {
        mc.registerTool({
          name: 'open_project_inquiry',
          description: 'Open the Base X Tech contact form pre-filled with a project inquiry (Shopify development, integrations, migrations, apps, design, CRO, ERP/POS systems). The visitor reviews it and presses Send; a person replies within 1 working day.',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Full name' },
              email: { type: 'string', format: 'email', description: 'Work email for the reply' },
              website: { type: 'string', description: 'Website or Shopify store URL (optional)' },
              service: { type: 'string', enum: services, description: 'Service the project needs' },
              budget: { type: 'string', enum: budgets, description: 'Budget in EUR (optional)' },
              message: { type: 'string', description: 'Project details: platform, systems, goal, deadline' },
            },
            required: ['name', 'email', 'message'],
          },
          async execute(input = {}) {
            const set = (sel, v) => { const el = form.querySelector(sel); if (el && v) el.value = v; };
            set('input[name="name"]', input.name);
            set('input[name="email"]', input.email);
            set('input[name="company"]', input.website);
            set('textarea[name="tell_us_more"]', input.message);
            if (input.service && services.includes(input.service)) form.querySelector('select[name="service"]').value = input.service;
            if (input.budget) { const r = [...form.querySelectorAll('input[name="budget"]')].find((i) => i.value === input.budget); if (r) r.checked = true; }
            if (!modal.classList.contains('active')) document.querySelector('[data-form-trigger]')?.click();
            return { content: [{ type: 'text', text: 'The Base X Tech contact form is open and filled in. Ask the user to review it and press "Send project details".' }] };
          },
        });
      } catch (err) { /* WebMCP not available or tool already registered */ }
    }
  }
});
