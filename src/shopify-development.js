import { initializeTimezone } from './utils/timezone.js';

document.addEventListener('DOMContentLoaded', function () {
  initializeTimezone();
  
  const cardsContainer = document.querySelector('.cards');
  if (!cardsContainer) return;

  const originalOrder = Array.from(cardsContainer.children);

  const showMoreButton = document.createElement('button');
  showMoreButton.textContent = 'Переглянути більше кейсів';
  showMoreButton.className = 'btn btn--light';
  cardsContainer.parentNode.insertBefore(showMoreButton, cardsContainer.nextSibling);

  const moveLastToThird = () => {
    const cards = Array.from(cardsContainer.querySelectorAll('.card'));
    const lastCard = cards[cards.length - 1];
    const thirdCard = cards[2];
    if (lastCard && thirdCard && lastCard !== thirdCard) {
      cardsContainer.insertBefore(lastCard, thirdCard);
    }
  };

  const restoreOriginalOrder = () => {
    cardsContainer.innerHTML = '';
    originalOrder.forEach(card => cardsContainer.appendChild(card));
  };

  const updateView = () => {
    restoreOriginalOrder();
    let isMobile = window.innerWidth <= 768;

    if (isMobile) {
      moveLastToThird();
      const updatedCards = Array.from(cardsContainer.querySelectorAll('.card'));

      updatedCards.forEach((card, index) => {
        card.style.display = index < 3 ? 'block' : 'none';
      });

      showMoreButton.style.display = 'block';
    } else {
      originalOrder.forEach(card => (card.style.display = 'block'));
      showMoreButton.style.display = 'none';
    }
  };

  showMoreButton.addEventListener('click', () => {
    const updatedCards = Array.from(cardsContainer.querySelectorAll('.card'));
    updatedCards.forEach(card => (card.style.display = 'block'));
    showMoreButton.style.display = 'none';
  });

  updateView();
  window.addEventListener('resize', updateView);
});


