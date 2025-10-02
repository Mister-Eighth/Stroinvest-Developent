'use strict'

/* Menu */
function toggleMenu(menuSelector, openBtnSelector, closeBtnSelector) {
  const menu = document.querySelector(menuSelector);
  const openBtn = document.querySelector(openBtnSelector);
  const closeBtn = document.querySelector(closeBtnSelector);

  function openMenu() {
    openBtn.classList.add('active');
    menu.classList.add('open');
    disableScroll();
  }

  function closeMenu() {
    openBtn.classList.remove('active');
    menu.classList.remove('open');
    enableScroll();
  }

  openBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  // Закрытие меню на Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Закрытие меню при клике вне окна
  document.addEventListener('mousedown', (e) => {
    const isClickInside = e.composedPath().includes(menu);
    if (!isClickInside && menu.classList.contains('open') && openBtn.classList.contains('active')) {
      closeMenu();
    }
  });
}
toggleMenu('.header-wrapper', '.hamburger-button--open', '.hamburger-button--close');





/* Accordion menu */
document.addEventListener('DOMContentLoaded', () => {
	const accordions = document.querySelectorAll('.sidebar__item');

	accordions.forEach(element => {
		element.addEventListener('click', (el) => {
			let tgEl = el.currentTarget;
			const control = tgEl.querySelector('.sidebar-button');
			const content = tgEl.querySelector('.sidebar__item-wrapper');
			control.classList.toggle('active');

			// если аккордеон открыт
			let accordionTimeAnimate = content.scrollHeight;
			if (control.classList.contains('active')) {
				if(accordionTimeAnimate <= 300 && accordionTimeAnimate <= 600){
					accordionTimeAnimate = (300 + 'ms');
				} else if (accordionTimeAnimate <= 650){
					accordionTimeAnimate = content.scrollHeight * 1.5 + 'ms';
				} else if (accordionTimeAnimate <= 1000) {
					accordionTimeAnimate = (900 + 'ms');
				}
				else{
					accordionTimeAnimate = (1000 + 'ms');
				}
				content.style.setProperty('--accordion-height', content.scrollHeight + 'px'); //Высота меню
				content.style.setProperty('--accordion-time', accordionTimeAnimate); //Время анимации
				content.dataset.ariaExpanded = 'true'
			} else {
				content.dataset.ariaExpanded = 'false'
			}
		});
	});
});