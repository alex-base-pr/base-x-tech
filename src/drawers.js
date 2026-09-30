// Contact modal + mobile menu open/close (shared by the site and the Ghost blog theme, see scripts/ghost-shell.mjs).
const drawerState = new Proxy({}, {
  set(target, prop, value) {
    target[prop] = value;
    DrawerManager.updateUI(prop, value);
    return true;
  }
});

class DrawerManager {
  constructor(config) {
    this.drawers = config;
    this.initListeners();
  }

  initListeners() {
    document.addEventListener('click', (event) => {
      for (const [key, { openTrigger, closeTrigger }] of Object.entries(this.drawers)) {
        const openElement = event.target.closest(openTrigger);
        const closeElement = event.target.closest(closeTrigger);

        if (openElement && openElement === closeElement) {
          this.toggleDrawer(key, !drawerState[key]);
        } else if (openElement) {
          this.toggleDrawer(key, true);
        } else if (closeElement) {
          this.toggleDrawer(key, false);
        }
      }
    });
  }

  toggleDrawer(name, state) {
    drawerState[name] = state;
  }

  static updateUI(name, isOpen) {
    const { selector, bodyClass } = drawerConfig[name] || {};
    if (!selector) return;

    document.querySelector(selector)?.classList.toggle('active', isOpen);
    document.body.classList.toggle(bodyClass, isOpen);
  }
}

const drawerConfig = {
  nav: {
    selector: '.nav-drawer--wrapper',
    bodyClass: 'nav-active',
    openTrigger: '[data-nav-trigger]',
    closeTrigger: '[data-nav-trigger]'
  },
  form: {
    selector: '.drawer-form--wrapper, .v2-modal',
    bodyClass: 'block-scroll',
    openTrigger: '[data-form-trigger]',
    closeTrigger: '[data-form-close]'
  }
};

document.body.addEventListener('click', (event) => {
  if (document.body.classList.contains('block-scroll')) {
      if (event.target === document.body || !event.target.closest('.drawer-form--wrapper, .v2-modal__panel')) {
          let drawer = document.querySelector('.drawer-form--wrapper, .v2-modal');
          let closeBtn = document.querySelector('[data-form-close]');
          if (drawer && closeBtn) {
              drawer.classList.remove('active');
              closeBtn.classList.remove('active');
          }
          document.body.classList.remove('block-scroll');
      }
  }
});

document.addEventListener('DOMContentLoaded', () => new DrawerManager(drawerConfig));
