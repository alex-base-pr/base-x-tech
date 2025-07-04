import Flickity from 'flickity';

document.addEventListener('DOMContentLoaded', () => {
  const breakpoint = 768;

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

  function updateCarousels() {
    const isMobile = window.innerWidth < breakpoint;

    carousels.forEach((carousel) => {
      const el = document.querySelector(carousel.selector);
      if (!el) return;

      const shouldInit = !carousel.responsive || isMobile;

      if (shouldInit && !carousel.instance) {
        if (carousel.selector === '#service-type-of-apps .cards' && isMobile) {
          const firstSlide = el.querySelector('.card');
          console.log(firstSlide.parentElement)
          firstSlide.parentElement.removeChild(firstSlide);
        }

        carousel.instance = new Flickity(el, carousel.options);

      }

      if (!shouldInit && carousel.instance) {
        carousel.instance.destroy();
        carousel.instance = null;
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
