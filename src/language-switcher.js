export class LanguageSwitcher {
  constructor({
    selector = '.language-switcher',
    mobileSelector = '.language-switcher-mobile',
    storageKey = 'preferredLang',
    defaultLang = 'en',
    altLangPrefix = '/uk'
  } = {}) {
    this.selector = selector;
    this.mobileSelector = mobileSelector;
    this.storageKey = storageKey;
    this.defaultLang = defaultLang;
    this.altLangPrefix = altLangPrefix;

    this.wrapper = document.querySelector(this.selector);
    this.mobileWrapper = document.querySelector(this.mobileSelector);

    if (!this.wrapper && !this.mobileWrapper) return;

    this.currentPath = window.location.pathname;
    this.currentLang = this.detectCurrentLang();
    this.savedLang = localStorage.getItem(this.storageKey);

    if (this.wrapper) {
      this.links = this.wrapper.querySelectorAll('[data-lang]');
      this.highlightActiveLink();
      this.bindEvents();
    }

    if (this.mobileWrapper) {
      this.mobileLinks = this.mobileWrapper.querySelectorAll('[data-lang]');
      this.mobileToggleBtn = this.mobileWrapper.querySelector('#mobileLangToggle');
      this.mobileDropdown = this.mobileWrapper.querySelector('#mobileLangDropdown');

      this.highlightActiveMobileLink();
      this.bindMobileEvents();
    }
    this.showLanguageSuggestion();
  }

  detectCurrentLang() {
    return this.currentPath.startsWith(this.altLangPrefix) ? 'uk' : this.defaultLang;
  }

  showLanguageSuggestion() {
    if (!this.savedLang || this.savedLang === this.currentLang) return;

    if (!window.localStorage) return;

    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => this.showLanguageSuggestion());
      return;
    }

    const message = this.savedLang === 'uk'
      ? 'Перейти до української версії?'
      : 'Switch to English version?';

    if (confirm(message)) {
      this.switchLanguage(this.savedLang);
    }
  }

  highlightActiveLink() {
    this.links.forEach(link => {
      const lang = link.getAttribute('data-lang');
      link.classList.toggle('is-active', lang === this.currentLang);
    });
  }

  highlightActiveMobileLink() {
    this.mobileLinks.forEach(link => {
      const lang = link.getAttribute('data-lang');
      link.classList.toggle('is-active', lang === this.currentLang);
    });
    const activeLink = Array.from(this.mobileLinks).find(l => l.classList.contains('is-active'));
    if (activeLink) {
      this.mobileToggleBtn.textContent = activeLink.textContent;
    }
  }

  bindEvents() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedLang = link.getAttribute('data-lang');
        this.switchLanguage(selectedLang);
      });
    });
  }

  bindMobileEvents() {
    this.mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.mobileDropdown.classList.toggle('hidden');
    });

    this.mobileLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedLang = link.getAttribute('data-lang');
        this.mobileDropdown.classList.add('hidden');
        this.switchLanguage(selectedLang);
      });
    });
    document.addEventListener('click', () => {
      this.mobileDropdown.classList.add('hidden');
    });
  }

  switchLanguage(lang) {
    localStorage.setItem(this.storageKey, lang);

    let targetPath = this.currentPath;

    if (lang === 'uk') {
      if (!this.currentPath.startsWith(this.altLangPrefix)) {
        targetPath = this.altLangPrefix + this.currentPath;
      }
    } else {
      if (this.currentPath.startsWith(this.altLangPrefix)) {
        targetPath = this.currentPath.replace(this.altLangPrefix, '') || '/';
      }
    }

    targetPath = targetPath.replace(/\/{2,}/g, '/');
    window.location.href = targetPath;
  }

  // handleRedirect() {
  //   const navType = performance.getEntriesByType('navigation')[0]?.type;
  //   const isFromHistory = navType === 'back_forward';
  //
  //   if (isFromHistory) return;
  //
  //   if (!this.savedLang || this.savedLang === this.currentLang) return;
  //
  //   if (this.savedLang === 'uk' && this.currentLang !== 'uk') {
  //     window.location.assign(this.altLangPrefix + this.currentPath);
  //   } else if (this.savedLang === 'en' && this.currentLang !== 'en') {
  //     const path = this.currentPath.replace(this.altLangPrefix, '') || '/';
  //     window.location.assign(path);
  //   }
  // }
}
