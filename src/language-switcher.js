// Language switcher driven by the page's own hreflang links: a language is offered only where this page
// has a version in it (e.g. DE exists only for /pages/complex-solutions/). Pages without any hreflang fall
// back to the old /uk prefix rule.
// Owner 2026-09-25 (reverses A10): switcher = EN | DE | UK again, each only where this page has that version.
// The v2 globe is rendered hidden and shown here once at least two languages are available; German pages
// and v2 pages without hreflang (Impressum, 404) never fall back to the legacy /uk prefix rule.
const PREFIX = { uk: '/uk', de: '/de' };
const SUGGEST = {
  uk: 'Перейти до української версії?',
  de: 'Zur deutschen Version wechseln?',
  en: 'Switch to English version?',
};

export function pageAlternates() {
  const map = {};
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((l) => {
    const lang = l.getAttribute('hreflang');
    if (lang === 'x-default') return;
    try { map[lang] = new URL(l.href, location.origin).pathname; } catch (e) { /* ignore malformed */ }
  });
  return map;
}

export function detectLang(path = location.pathname) {
  if (path.startsWith(PREFIX.uk + '/') || path === PREFIX.uk) return 'uk';
  if (path.startsWith(PREFIX.de + '/') || path === PREFIX.de) return 'de';
  return 'en';
}

export class LanguageSwitcher {
  constructor({ selector = '.language-switcher', mobileSelector = '.language-switcher-mobile', storageKey = 'preferredLang' } = {}) {
    this.storageKey = storageKey;
    this.wrapper = document.querySelector(selector);
    this.mobileWrapper = document.querySelector(mobileSelector);
    if (!this.wrapper && !this.mobileWrapper) return;

    this.currentLang = detectLang();
    this.alternates = pageAlternates();
    this.hasAlternates = Object.keys(this.alternates).length > 0;
    this.savedLang = this.readSaved();

    if (this.wrapper) {
      this.links = [...this.wrapper.querySelectorAll('[data-lang]')];
      this.prepare(this.links);
      this.links.forEach((link) => link.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchLanguage(link.dataset.lang);
      }));
      (this.wrapper.closest('.v2-lang') || this.wrapper).hidden = this.links.filter((l) => !l.hidden).length < 2;
    }

    if (this.mobileWrapper) {
      this.mobileLinks = [...this.mobileWrapper.querySelectorAll('[data-lang]')];
      this.mobileToggleBtn = this.mobileWrapper.querySelector('#mobileLangToggle');
      this.mobileDropdown = this.mobileWrapper.querySelector('#mobileLangDropdown');
      this.prepare(this.mobileLinks);
      // The dropdown overlays the toggle: 1st item = current language (transparent), the rest below it.
      // Drop languages this page lacks and put the current one first, so :first-child/:last-child styles hold.
      this.mobileLinks.filter((l) => l.hidden).forEach((l) => l.remove());
      this.mobileLinks = this.mobileLinks.filter((l) => !l.hidden);
      const current = this.mobileLinks.find((l) => l.dataset.lang === this.currentLang);
      if (current && this.mobileDropdown) this.mobileDropdown.prepend(current);
      if (this.mobileDropdown) this.mobileDropdown.style.height = `${this.mobileLinks.length * 100}%`;
      const active = this.mobileLinks.find((l) => l.classList.contains('is-active'));
      if (active && this.mobileToggleBtn) this.mobileToggleBtn.textContent = active.textContent;
      this.bindMobile();
      if (this.mobileLinks.length < 2) (this.mobileWrapper.closest('.lang-switcher-mobile') || this.mobileWrapper).hidden = true;
    }

    this.suggestSavedLanguage();
  }

  readSaved() {
    try { return localStorage.getItem(this.storageKey); } catch (e) { return null; }
  }

  save(lang) {
    try { localStorage.setItem(this.storageKey, lang); } catch (e) { /* private mode */ }
  }

  // Where does `lang` live for this page? null = no version in that language.
  targetFor(lang) {
    if (lang === this.currentLang) return location.pathname;
    if (this.hasAlternates) return this.alternates[lang] || null;
    // v2 pages always declare their versions via hreflang; none = single-language page (Impressum, 404).
    if (document.body.classList.contains('v2') || this.currentLang === 'de') return null;
    // Legacy pages without hreflang: EN ↔ UK by prefix only.
    const path = location.pathname;
    if (lang === 'uk') return path.startsWith('/uk') ? path : ('/uk' + path).replace(/\/{2,}/g, '/');
    if (lang === 'en') return path.replace(/^\/(uk|de)(?=\/|$)/, '') || '/';
    return null;
  }

  isAvailable(lang) {
    return this.targetFor(lang) !== null;
  }

  prepare(links) {
    links.forEach((link) => {
      const lang = link.dataset.lang;
      link.hidden = !this.isAvailable(lang);
      link.classList.toggle('is-active', lang === this.currentLang);
      const target = this.targetFor(lang);
      if (target) {
        link.setAttribute('href', target);
        link.setAttribute('hreflang', lang);
      }
    });
  }

  bindMobile() {
    if (!this.mobileToggleBtn || !this.mobileDropdown) return;
    this.mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.mobileDropdown.classList.toggle('hidden');
    });
    this.mobileLinks.forEach((link) => link.addEventListener('click', (e) => {
      e.preventDefault();
      this.mobileDropdown.classList.add('hidden');
      this.switchLanguage(link.dataset.lang);
    }));
    document.addEventListener('click', () => this.mobileDropdown.classList.add('hidden'));
  }

  switchLanguage(lang) {
    const target = this.targetFor(lang);
    if (!target) return;
    this.save(lang);
    if (target !== location.pathname) window.location.href = target;
  }

  // Offer the saved language only when this page actually exists in it.
  suggestSavedLanguage() {
    const saved = this.savedLang;
    if (!saved || saved === this.currentLang || !this.isAvailable(saved)) return;
    const ask = () => { if (confirm(SUGGEST[saved] || SUGGEST.en)) this.switchLanguage(saved); };
    if (document.readyState === 'complete') ask(); else window.addEventListener('load', ask, { once: true });
  }
}
