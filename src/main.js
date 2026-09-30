import './component-accordion.js';
import Flickity from 'flickity';
import { LanguageSwitcher, pageAlternates, detectLang } from './language-switcher.js';
import { initializeTimezone } from './utils/timezone.js';
import './drawers.js';
import './lead-form.js';

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
