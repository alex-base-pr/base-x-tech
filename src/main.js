import './component-accordion.js';
import Flickity from 'flickity';

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
    selector: '.drawer-form--wrapper',
    bodyClass: 'block-scroll',
    openTrigger: '[data-form-trigger]',
    closeTrigger: '[data-form-close]'
  }
};

document.body.addEventListener('click', (event) => {
  if (document.body.classList.contains('block-scroll')) {
      if (event.target === document.body || !event.target.closest('.drawer-form--wrapper')) {
          let drawer = document.querySelector('.drawer-form--wrapper');
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
//   const scrollThreshold = 40;

//   function handleScroll() {
//     if (window.scrollY >= scrollThreshold) {
//       header.classList.add('in-scroll');
//     } else {
//       header.classList.remove('in-scroll');
//     }
//   }

//   window.addEventListener('scroll', handleScroll);
//   handleScroll();
// });

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
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
      scrollUpDistance = 0;
    } else if (currentScrollY < lastScrollY) {
      scrollUpDistance += lastScrollY - currentScrollY;
      if (scrollUpDistance >= scrollThreshold) {
        header.classList.add('in-scroll');
      }
    }

    lastScrollY = currentScrollY;
  }

  const throttledHandleScroll = throttle(handleScroll, throttleDelay);

  window.addEventListener('scroll', throttledHandleScroll);
  window.addEventListener('scroll', checkTopPosition);

  checkTopPosition();
  handleScroll();
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



document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const successMsg = document.getElementById('success-msg');

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
      const service = form.querySelector('.form-select').selectedOptions[0].text;
      const budget = formData.get('budget');
      const tellUsMore = formData.get('tell_us_more') || '';

      const currentDateTime = getCurrentDateTime();
      const taskName = `${currentDateTime} - ${email || 'No Email'} - ${name || 'No Name'}`;

      const browserLanguage = navigator.language || navigator.languages[0] || 'unknown';

      const descriptionParts = [
          formatToDescription('Name', name),
          formatToDescription('Email', email),
          formatToDescription('Phone', phone),
          formatToDescription('Company', company),
          formatToDescription('Service required', service),
          formatToDescription('Budget', budget),
          formatToDescription('lang', browserLanguage),
          tellUsMore ? `Tell us more:\n${tellUsMore}` : ''
      ].filter(Boolean);

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

      if (!email || !name) {
          console.error('Error: Email and Name are required');
          form.classList.remove('unactive');
          return;
      }

      try {
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
              form.reset();
              form.classList.add('unactive');
          } else {
              console.error('Server error:', result.error || 'Unknown error');
          }
      } catch (error) {
          console.error('Error:', error);
      } finally {
          form.classList.remove('unactive');
          form.classList.add('hide');
          successMsg.classList.add('success');
      }
  });
});
