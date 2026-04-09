import Flickity from 'flickity';
import { initializeTimezone } from './utils/timezone.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeTimezone();
  
  const breakpoint = 1024;

  const carousels = [
    {
      selector: '#service-type-of-apps .cards',
      options: {
        cellAlign: 'left',
        contain: true,
        prevNextButtons: false,
        pageDots: true,
        wrapAround: false,
        adaptiveHeight: false
      },
      instance: null,
      responsive: true
    },
    {
      selector: '#service-expertise .cards',
      options: {
        cellAlign: 'left',
        contain: true,
        prevNextButtons: false,
        pageDots: true,
        wrapAround: false,
        adaptiveHeight: false
      },
      instance: null,
      responsive: false
    }
  ];

  function equalizeCardHeights(container) {
    const cards = container.querySelectorAll('.card');
    let maxHeight = 0;


    cards.forEach(card => {
      card.style.minHeight = 'initial';
      const content = card.querySelector('.card-content');
      if (content) {
        content.style.height = 'auto';
      }
    });

    cards.forEach(card => {
      const content = card.querySelector('.card-content');
      if (content) {
        const height = content.getBoundingClientRect().height;
        if (height > maxHeight) {
          maxHeight = height;
        }
      }
    });

    cards.forEach(card => {
      card.style.minHeight = `${maxHeight}px`;
      const content = card.querySelector('.card-content');
      if (content) {
        content.style.height = '100%';
      }
    });
  }

  function updateCarousels() {
    const isMobile = window.innerWidth < breakpoint;

    carousels.forEach((carousel) => {
      const el = document.querySelector(carousel.selector);
      if (!el) return;

      const shouldInit = !carousel.responsive || isMobile;

      if (shouldInit && !carousel.instance) {
        if (carousel.selector === '#service-type-of-apps .cards' && isMobile) {
          const firstSlide = el.querySelector('.card');
          if (firstSlide) {
            firstSlide.parentElement.removeChild(firstSlide);
          }
        }

        carousel.instance = new Flickity(el, carousel.options);

        requestAnimationFrame(() => {
          equalizeCardHeights(el);
          carousel.instance.resize();
        });
      }

      if (!shouldInit && carousel.instance) {
        carousel.instance.destroy();
        carousel.instance = null;

        const cards = el.querySelectorAll('.card');
        cards.forEach(card => {
          card.style.minHeight = 'initial';
          const content = card.querySelector('.card-content');
          if (content) {
            content.style.height = 'auto';
          }
        });
      }

      if (shouldInit && carousel.instance) {
        requestAnimationFrame(() => {
          equalizeCardHeights(el);
          carousel.instance.resize();
        });
      }
    });
  }

  let resizeRAF = false;
  window.addEventListener('resize', () => {
    if (resizeRAF) return;
    resizeRAF = true;
    requestAnimationFrame(() => {
      updateCarousels();
      resizeRAF = false;
    });
  });

  updateCarousels();
});
