// src/custom-accordion.js
import { animate, press, scroll, stagger } from 'motion';

(function() {
  let butn = document.querySelectorAll('.btn--primary');
  if (!butn.length) return;
  press(".btn--primary", (element) => {
    animate(element, { scale: 0.98 }, { type: "spring", stiffness: 1000 })

    return () =>
        animate(element, { scale: 1 }, { type: "spring", stiffness: 500 })
  })
})();

(function() {
  const items = document.querySelectorAll(
    '[data-accordion-item], .section-works .card'
  );

  if(!items.length) return;

  items.forEach(item => {
    item.dataset.animated = 'false';
  });

  items.forEach((item) => {
    scroll(
      ({ y }) => {
        const rect = item.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const isVisible = rect.top < windowHeight && rect.bottom > 0;

        if (isVisible && item.dataset.animated === 'false') {
          animate(item,
            {
              opacity: [0, 1],
              y: [100, 0]
            },
            {
              duration: 0.7,
              ease: 'easeOut'
            }
          );
          item.dataset.animated = 'true';
        }
      },
      {
        target: item,
        offset: ["start end", "end start"]
      }
    );
  });

  const numberCards = document.querySelectorAll(".section-numbers .card");
  if (numberCards.length) {
    animate(numberCards, { opacity: 1 }, { delay: stagger(0.1) });
  }

})();
