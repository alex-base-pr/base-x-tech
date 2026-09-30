import './component-accordion.js';
import Flickity from 'flickity';
import { LanguageSwitcher, pageAlternates, detectLang } from './language-switcher.js';
import { initializeTimezone } from './utils/timezone.js';

function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn(...args);
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  new LanguageSwitcher();
  initializeTimezone();
});

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


// document.addEventListener('DOMContentLoaded', () => {
//   const header = document.querySelector('.site-header');
//   let lastScrollY = window.scrollY;
//   let scrollUpDistance = 0;
//   const scrollThreshold = 50;
//   const offsetThreshold = 10;
//   const throttleDelay = 25;

//   function checkTopPosition() {
//     if (window.scrollY <= offsetThreshold && header.classList.contains('in-scroll')) {
//       header.classList.remove('in-scroll');
//       scrollUpDistance = 0;
//     }
//   }

//   function handleScroll() {
//     const currentScrollY = window.scrollY;

//     if (currentScrollY > lastScrollY) {
//       header.classList.remove('in-scroll');
//       scrollUpDistance = 0;
//     } else if (currentScrollY < lastScrollY) {
//       scrollUpDistance += lastScrollY - currentScrollY;
//       if (scrollUpDistance >= scrollThreshold) {
//         header.classList.add('in-scroll');
//       }
//     }

//     lastScrollY = currentScrollY;
//   }

//   const throttledHandleScroll = throttle(handleScroll, throttleDelay);

//   window.addEventListener('scroll', throttledHandleScroll);
//   window.addEventListener('scroll', checkTopPosition);

//   checkTopPosition();
//   handleScroll();
// });


document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const trigger = document.querySelector('.trigger-submenu-1');
  if (!header) return; // design-v2 pages use their own header (src/v2.js)
  let lastScrollY = window.scrollY;
  let scrollUpDistance = 0;
  const scrollThreshold = 50;
  const offsetThreshold = 10;
  const throttleDelay = 25;

  function checkTopPosition() {
    if (window.scrollY <= offsetThreshold && header.classList.contains('in-scroll')) {
      header.classList.remove('in-scroll');
      scrollUpDistance = 0;
    }
  }

  function handleScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      header.classList.remove('in-scroll');
      header.classList.remove('submenu-opened');
      scrollUpDistance = 0;
    } else if (currentScrollY < lastScrollY) {
      scrollUpDistance += lastScrollY - currentScrollY;
      if (scrollUpDistance >= scrollThreshold) {
        header.classList.add('in-scroll');
      }
    }

    lastScrollY = currentScrollY;
  }

  function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  const throttledHandleScroll = throttle(handleScroll, throttleDelay);

  window.addEventListener('scroll', throttledHandleScroll);
  window.addEventListener('scroll', checkTopPosition);

  checkTopPosition();
  handleScroll();

  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      header.classList.add('in-scroll');
      header.classList.add('submenu-opened');
    });
  }

  document.addEventListener('click', (e) => {
    const isClickInside = header.contains(e.target);
    const isOpened = header.classList.contains('submenu-opened');

    if (!isClickInside && isOpened) {
      header.classList.remove('submenu-opened');
    }
  });
});



document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn--primary, .btn--dark');

  buttons.forEach(button => {
    let leaveTimeout = null;

    button.addEventListener('mouseenter', () => {
      if (leaveTimeout) {
        clearTimeout(leaveTimeout);
      }
      button.classList.remove('leave');
      button.classList.add('hover');
    });

    button.addEventListener('mouseleave', () => {
      button.classList.add('leave');

      leaveTimeout = setTimeout(() => {
        button.classList.remove('hover', 'leave');
        leaveTimeout = null;
      }, 200);
    });
  });
});


document.addEventListener("click", function (event) {
  const header = event.target.closest(".faq-header");
  if (!header) return;

  const article = header.closest("article");
  if (!article) return;

  const toggleButton = article.querySelector(".toggle-button");

  article.classList.toggle("active");
  article.dataset.accordionItem =
    article.dataset.accordionItem === "visible" ? "hidden" : "visible";

  if (toggleButton) {
    toggleButton.classList.toggle("active");

  }
});


document.addEventListener('DOMContentLoaded', () => {
  const carouselElem = document.querySelector('#reviews-carousel');
  const prevBtn = document.querySelector('.slider-nav-btn.prev');
  const nextBtn = document.querySelector('.slider-nav-btn.next');

  if(!carouselElem && !prevBtn && !nextBtn) return

  const flkty = new Flickity(carouselElem, {
    cellAlign: 'left',
    contain: false,
    prevNextButtons: false,
    pageDots: false,
    wrapAround: false,
    adaptiveHeight: true
  });

  const updateNavButtons = () => {
    const selectedIndex = flkty.selectedIndex;
    const lastIndex = flkty.slides.length - 1;

    prevBtn.classList.toggle('disabled', selectedIndex === 0);
    nextBtn.classList.toggle('disabled', selectedIndex === lastIndex);
  };

  updateNavButtons();

  flkty.on('change', updateNavButtons);

  prevBtn.addEventListener('click', () => {
    flkty.previous();
  });

  nextBtn.addEventListener('click', () => {
    flkty.next();
  });
});



// First touch of this visit (sessionStorage, so it survives page-to-page navigation until the tab closes):
// landing page, external referrer and campaign parameters. Added to the lead description on submit.
const FIRST_TOUCH_KEY = 'bxt_first_touch';
const TRACKED_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
function readFirstTouch() {
  try { return JSON.parse(sessionStorage.getItem(FIRST_TOUCH_KEY) || 'null'); } catch (e) { return null; }
}
// Campaign history (localStorage, 90 days, last 10): every visit that arrives with a campaign (utm_source, gclid or
// fbclid) is appended, so a lead that comes back days later, from another tab or another campaign, still carries
// every campaign that brought them (owner 2026-09-30: UTMs must always reach the lead, keep the history).
// The same campaign again (same utm_source/medium/campaign/content/term and click id) only refreshes its date.
const CAMPAIGN_KEY = 'bxt_campaigns';
const CAMPAIGN_TTL = 90 * 24 * 3600 * 1000;
const CAMPAIGN_MAX = 10;
function readCampaigns() {
  try {
    const list = JSON.parse(localStorage.getItem(CAMPAIGN_KEY) || '[]');
    return Array.isArray(list) ? list.filter((c) => c && c.utm && Date.now() - c.at < CAMPAIGN_TTL) : [];
  } catch (e) { return []; }
}
(function captureFirstTouch() {
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  TRACKED_PARAMS.forEach((p) => { if (params.has(p)) utm[p] = params.get(p); });
  try {
    if (utm.utm_source || utm.gclid || utm.fbclid) { // utm_content alone on an internal link is not a campaign
      const key = JSON.stringify(utm);
      const list = readCampaigns().filter((c) => JSON.stringify(c.utm) !== key);
      list.push({ utm, landing: window.location.pathname + window.location.search, referrer: document.referrer || '', at: Date.now() });
      localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(list.slice(-CAMPAIGN_MAX)));
    }
  } catch (e) { /* storage blocked */ }
  try {
    if (sessionStorage.getItem(FIRST_TOUCH_KEY)) return;
    sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify({
      landing: window.location.pathname + window.location.search,
      referrer: document.referrer || '',
      utm,
    }));
  } catch (e) { /* storage blocked (private mode, cookies off): the lead still sends without first-touch data */ }
})();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const successMsg = document.getElementById('success-msg');
  const errorMsg = document.getElementById('error-msg'); // design-v2 modal only
  const sourceForm = document.getElementById('source-form'); // design-v2 success state: "How did you find us?"
  if (!form) return;
  let lastLead = null; // for the follow-up source task

  // GA4: first interaction with the form (form_open is sent from src/v2.js).
  let started = false;
  form.addEventListener('focusin', () => {
      if (started) return;
      started = true;
      if (typeof gtag === 'function') gtag('event', 'form_start', { page_path: window.location.pathname });
  });

  // Owner 2026-09-30: the source question is a second, separate ClickUp task sent after the lead
  // ("Source: … - <email>"), matched to the lead by email and time. Later: write it into the lead itself.
  sourceForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const value = e.submitter?.value;
      if (!value) return;
      sourceForm.querySelectorAll('button').forEach((b) => { b.disabled = true; b.classList.toggle('is-picked', b === e.submitter); });
      const thanks = sourceForm.querySelector('.v2-source__thanks');
      if (thanks) thanks.hidden = false;
      if (typeof gtag === 'function') gtag('event', 'lead_source', { source: value });
      const lead = lastLead || {};
      const taskData = {
          name: `${getCurrentDateTime()} - ${lead.email || 'No Email'} - Source: ${value}`,
          description: [
              `Source (answer after the lead): ${value}`,
              formatToDescription('Lead email', lead.email),
              formatToDescription('Lead name', lead.name),
              formatToDescription('Lead sent', lead.time),
              formatToDescription('Lead UTM', lead.utm),
              formatToDescription('Page', window.location.pathname),
          ].filter(Boolean).join('\n'),
      };
      if (__DEPLOY_ENV__ === 'dev') { console.info('[dev] source answer not sent', taskData); return; }
      try {
          await fetch('https://clickup.base-xtech.com', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(taskData) });
      } catch (err) { console.error('Source answer not sent:', err); }
  });

  document.querySelector('[data-form-retry]')?.addEventListener('click', () => {
      errorMsg.classList.remove('error');
      form.classList.remove('hide');
  });

  function getUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const trackedParams = [
          'gclid',
          'fbclid',
          'utm_source',
          'utm_medium',
          'utm_campaign',
          'utm_content',
          'utm_term'
      ];

      const result = {};
      trackedParams.forEach(param => {
          if (params.has(param)) {
              result[param] = params.get(param);
          }
      });
      return result;
  }

  function formatToDescription(label, value) {
      return value ? `${label}: ${value}` : '';
  }

  function formatUrlParamsToDescription(params) {
      const entries = Object.entries(params);
      if (entries.length === 0) return '';
      return '\n\nURL Parameters:\n' + entries.map(([key, value]) => `${key}: ${value}`).join('\n');
  }

  // Approximate location for the lead (contact-form review 2026-09-30): country from Cloudflare's /cdn-cgi/trace
  // (same origin on prod and dev, derived from the IP address, no browser prompt) plus the browser time zone.
  // Never blocks the send: 1.5 s timeout, empty on localhost or any error.
  async function getApproxLocation() {
      let tz = '';
      try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* old browser */ }
      let country = '';
      try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 1500);
          const res = await fetch('/cdn-cgi/trace', { signal: ctrl.signal, cache: 'no-store' });
          clearTimeout(timer);
          const code = res.ok ? ((await res.text()).match(/^loc=([A-Z]{2})$/m) || [])[1] : '';
          if (code && code !== 'XX' && code !== 'T1') {
              try { country = new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code; } catch (e) { country = code; }
          }
      } catch (e) { /* not behind Cloudflare (localhost) or blocked */ }
      return { country, tz };
  }

  function getCurrentDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      form.classList.add('unactive');

      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const company = formData.get('company');
      // v2 options carry the English label in data-lead (DE page shows German text); legacy drawers use the text.
      const serviceOption = form.querySelector('.form-select')?.selectedOptions[0];
      const service = serviceOption ? (serviceOption.dataset.lead || serviceOption.text) : '';
      const budget = formData.get('budget');
      const source = formData.get('source'); // "How did you find us?" (v2 modal only)
      const tellUsMore = formData.get('tell_us_more') || '';
      const firstTouch = readFirstTouch();
      const firstUtm = firstTouch && firstTouch.utm ? Object.entries(firstTouch.utm).map(([k, v]) => `${k}=${v}`).join(', ') : '';
      const utmText = (u) => Object.entries(u).map(([k, v]) => `${k}=${v}`).join(', ');
      const campaigns = readCampaigns();
      const campaign = campaigns[campaigns.length - 1] || null; // the latest campaign
      const campaignUtm = campaign ? utmText(campaign.utm) : '';
      const campaignHistory = campaigns.length > 1 || (campaign && campaignUtm !== firstUtm)
          ? 'Campaign history (oldest first):\n' + campaigns.map((c) => `- ${new Date(c.at).toISOString().slice(0, 16).replace('T', ' ')} UTC · ${utmText(c.utm)} · landed ${c.landing}${c.referrer ? ' · from ' + c.referrer : ''}`).join('\n')
          : '';
      let sent = false;

      const currentDateTime = getCurrentDateTime();
      const siteLang = (document.documentElement.lang || document.body.lang || 'en').slice(0, 2).toUpperCase();
      const loc = await getApproxLocation();
      const locationText = [loc.country, loc.tz].filter(Boolean).join(', ');
      // One-line summary for sales triage, also appended to the task name: DE · service · budget · website · country
      const anyUtm = { ...(campaign ? campaign.utm : {}), ...getUrlParams(), ...(firstTouch && firstTouch.utm ? firstTouch.utm : {}) };
      const utmTag = anyUtm.utm_source ? `utm: ${anyUtm.utm_source}${anyUtm.utm_campaign ? '/' + anyUtm.utm_campaign : ''}` : (anyUtm.gclid ? 'utm: google ads (gclid)' : '');
      const summary = [siteLang, service, budget, company, loc.country, utmTag].filter(Boolean).join(' · ');
      const taskName = `${currentDateTime} - ${email || 'No Email'} - ${name || 'No Name'}` + (summary ? ` · ${summary}` : '');

      const browserLanguage = navigator.language || navigator.languages[0] || 'unknown';

      const descriptionParts = [
          summary,
          '',
          formatToDescription('Name', name),
          formatToDescription('Email', email),
          formatToDescription('Phone', phone),
          formatToDescription(sourceForm ? 'Website / company' : 'Company', company),
          formatToDescription('Service required', service),
          formatToDescription('Budget', budget),
          formatToDescription('Source', source),
          formatToDescription('Site language', siteLang),
          formatToDescription('Location (approx.)', locationText),
          formatToDescription('Browser language', browserLanguage),
          formatToDescription('Page', window.location.pathname),
          firstTouch ? formatToDescription('First landing page', firstTouch.landing) : '',
          firstTouch ? formatToDescription('First referrer', firstTouch.referrer || '(direct)') : '',
          formatToDescription('First-touch UTM', firstUtm),
          campaign && campaignUtm !== firstUtm ? formatToDescription('Last campaign UTM', campaignUtm) : '',
          campaignHistory,
          tellUsMore ? `Tell us more:\n${tellUsMore}` : ''
      ].filter((part, i) => part || (i === 1 && summary));

      let description = descriptionParts.join('\n');

      const urlParams = getUrlParams();
      const paramsDescription = formatUrlParamsToDescription(urlParams);
      if (paramsDescription) {
          description += paramsDescription;
      }

      const taskData = {
          name: taskName,
          description: description
      };

      lastLead = { email, name, time: currentDateTime, utm: firstUtm || campaignUtm };

      if (!email || !name) {
          console.error('Error: Email and Name are required');
          form.classList.remove('unactive');
          return;
      }

      try {
          // Dev/preview builds never send real leads (spec REQ-025); the success state still shows.
          if (__DEPLOY_ENV__ === 'dev') {
              console.info('[dev] contact form not sent', taskData);
              form.reset();
              sent = true;
              return;
          }
          const response = await fetch('https://clickup.base-xtech.com', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(taskData)
          });

          const responseText = await response.text();

          if (!response.ok) {
              throw new Error(`Server error: ${response.status} - ${responseText}`);
          }

          const result = responseText ? JSON.parse(responseText) : {};


          if (result.success) {
              sent = true;
              form.reset();
              form.classList.add('unactive');
              if (typeof gtag === 'function') {
                  gtag('event', 'generate_lead');
              }
          } else {
              console.error('Server error:', result.error || 'Unknown error');
          }
      } catch (error) {
          console.error('Error:', error);
      } finally {
          form.classList.remove('unactive');
          form.classList.add('hide');
          // Legacy drawers have no error panel and keep showing the thank-you state.
          if (!sent && errorMsg) errorMsg.classList.add('error');
          else successMsg.classList.add('success');
      }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector('.drawer-nav');
  if (!nav) return; // design-v2 pages use layout/v2/nav.ejs
  const firstLevelBlocks = nav.querySelectorAll('[data-level-first]');
  const submenus = nav.querySelectorAll('[data-level="submenu"]');
  const triggers = nav.querySelectorAll('[data-submenu-tirger]');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = trigger.getAttribute('data-submenu-tirger');


      firstLevelBlocks.forEach(block => {
        block.classList.add('is-sliding-out');
        block.classList.remove('is-hidden');
      });


      setTimeout(() => {
        firstLevelBlocks.forEach(block => {
          block.classList.remove('is-sliding-out');
          block.classList.add('is-hidden');
        });

        submenus.forEach(sub => {
          const match = sub.getAttribute('data-submenu') === target;
          if (match) {
            sub.style.display = 'block';
            sub.offsetHeight;
            sub.classList.add('is-active');
            sub.classList.remove('is-leaving');
          }
        });
      }, 400);
    });
  });


  nav.addEventListener('click', (e) => {
    const back = e.target.closest('.back-link');
    if (!back) return;
    e.preventDefault();


    submenus.forEach(sub => {
      sub.classList.remove('is-active');
      sub.classList.add('is-leaving');
    });


    setTimeout(() => {
      submenus.forEach(sub => {
        sub.classList.remove('is-leaving');
        sub.style.display = 'none';
      });


      firstLevelBlocks.forEach(block => {
        block.classList.remove('is-hidden');
        block.classList.add('is-sliding-in');
        block.offsetWidth;
        block.classList.add('is-visible');
      });


      setTimeout(() => {
        firstLevelBlocks.forEach(block => {
          block.classList.remove('is-sliding-in', 'is-visible');
        });
      }, 400);
    }, 400);
  });
});

document.querySelectorAll('[data-collapse-trigger]').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();

    const item = trigger.closest('.has-collapse');
    const isOpen = item.classList.contains('is-open');

    document.querySelectorAll('.has-collapse.is-open').forEach(openItem => {
      openItem.classList.remove('is-open');
    });

    if (!isOpen) {
      item.classList.add('is-open');
    }
  });
});

// Saved-language redirect (was: always to /uk + path, which 404s on EN-only pages). Now only where the page
// declares that version via hreflang; the LanguageSwitcher offers the rest.
(function () {
  let saved = null;
  try { saved = localStorage.getItem('preferredLang'); } catch (e) { return; }
  if (saved !== 'uk' || detectLang() === 'uk') return;
  const target = pageAlternates().uk;
  if (target && target !== window.location.pathname) window.location.href = target;
})();

document.addEventListener("DOMContentLoaded", function () {
  var currentPath = window.location.pathname;
  var menuLinks = document.querySelectorAll('.desk-nav-menu a, .drawer-nav--wrapper a');

  menuLinks.forEach(function(link) {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});

// The Sortlist badge is injected by a third-party script without alt text or a link name (axe image-alt / link-name).
document.addEventListener('DOMContentLoaded', () => {
  const label = () => {
    document.querySelectorAll('a[href*="sortlist."]').forEach((a) => {
      if (!a.getAttribute('aria-label')) a.setAttribute('aria-label', 'Base X Tech on Sortlist: certified agency');
      a.querySelectorAll('img:not([alt])').forEach((img) => img.setAttribute('alt', 'Sortlist certified agency badge'));
    });
  };
  label();
  new MutationObserver(label).observe(document.body, { childList: true, subtree: true });
});
