'use strict'

/* Humberger menu */
function humburgerMenu(menuSelector, openBtnSelector,closeBtnSelector){
	const hamburgerMenu = document.querySelector(menuSelector);
	const hamburgerOpenBtn = document.querySelector(openBtnSelector);
	const hamburgerCloseBtn = document.querySelector(closeBtnSelector);

	hamburgerOpenBtn.addEventListener('click', () => {
		hamburgerOpenBtn.classList.add('vision');
		hamburgerCloseBtn.classList.add('vision');
		hamburgerMenu.classList.add('open');
	});

	hamburgerCloseBtn.addEventListener('click', () => {
		hamburgerOpenBtn.classList.remove('vision');
		hamburgerCloseBtn.classList.remove('vision');
		hamburgerMenu.classList.remove('open');
	});

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 27) {
			if (hamburgerMenu.classList.contains('open')) {
				hamburgerOpenBtn.classList.remove('vision');
				hamburgerCloseBtn.classList.remove('vision');
				hamburgerMenu.classList.remove('open');
				enableScroll();
			}
		}
	});

	document.addEventListener('mousedown', (e) => {
	const hamburgerMissClick = e.composedPath().includes(hamburgerMenu);
	if (!hamburgerMissClick && hamburgerMenu.classList.contains('open')
			&& hamburgerOpenBtn.classList.contains('vision')) {
			hamburgerOpenBtn.classList.remove('vision');
			hamburgerMenu.classList.remove('open');
			enableScroll();
		}
	});
}
humburgerMenu('.humburger-menu','.humburger-btn-open','.humburger-btn-close');





/* Popup */
function initializePopup(openSelector, closeSelector, popupSelector) {
  /* Open event */
  document.querySelectorAll(openSelector).forEach(button => {
    button.addEventListener('click', function() {
      const popupName = this.getAttribute('data-panel-popupBtn');
      const popup = document.querySelector(`${popupSelector}[data-panel-popupItem="${popupName}"]`);
      if (popup) {
        popup.classList.add('active');
        document.body.classList.add('no-scroll');
      }
    });
  });

  /* Process close event */
  document.querySelectorAll(closeSelector).forEach(button => {
    button.addEventListener('click', function() {
      const popup = this.closest(popupSelector);
      if (popup) {
        popup.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  });

  /* Close for Esc */
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const activePopup = document.querySelector(`${popupSelector}.active`);
      if (activePopup) {
        activePopup.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    }
  });
}

initializePopup('.panel-popup-openBtn', '.panel-popup-closeBtn', '.panel-popup');






/* Slider */
let slideIndex = {};
let isMouseDown = false;

function moveSlide(sliderId, n) {
  let slider = document.getElementById(sliderId);
  let slides = slider.querySelectorAll('.slide');
  let currentSlideElement = slider.querySelector('.current-slide');
  let totalSlidesElement = slider.querySelector('.total-slides');

  /* Initialize slide index if not present */
  if (!slideIndex[sliderId]) {
    slideIndex[sliderId] = 1;
  }

  /* Update slide index */
  slideIndex[sliderId] += n;

  /* Loop slides */
  if (slideIndex[sliderId] > slides.length) {
    slideIndex[sliderId] = 1;
  } else if (slideIndex[sliderId] < 1) {
    slideIndex[sliderId] = slides.length;
  }

  /* Update slide position */
  let offset = (slideIndex[sliderId] - 1) * -100;
  slider.querySelector('.slides').style.transform = `translateX(${offset}%)`;

  /* Update current slide display */
  currentSlideElement.textContent = slideIndex[sliderId];
  totalSlidesElement.textContent = slides.length;
}

/* Mouse drag functionality */
function initMouseDrag(sliderId) {
  const slider = document.getElementById(sliderId);
  let startX, endX;

  slider.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startX = e.pageX || e.touches[0].pageX;
    slider.style.cursor = 'grabbing';
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    endX = e.pageX || e.touches[0].pageX;
    let distance = startX - endX;
    
    if (distance > 50) {
      moveSlide(sliderId, 1);
      isMouseDown = false;
    } else if (distance < -50) {
      moveSlide(sliderId, -1);
      isMouseDown = false;
    }
  });

  slider.addEventListener('mouseup', () => {
    isMouseDown = false;
    slider.style.cursor = 'grab';
  });

  slider.addEventListener('mouseleave', () => {
    isMouseDown = false;
    slider.style.cursor = 'grab';
  });
}

/* Initialize all sliders */
document.querySelectorAll('.slider').forEach(slider => {
  const sliderId = slider.id;
  slider.querySelector('.prev').addEventListener('click', () => moveSlide(sliderId, -1));
  slider.querySelector('.next').addEventListener('click', () => moveSlide(sliderId, 1));
  initMouseDrag(sliderId);
});






/* Accordion menu */
function accordionMenu(menuSelectorAll, btnlSelector, contentSelector) {
  const accordions = document.querySelectorAll(menuSelectorAll);

  accordions.forEach(element => {
    const btn = element.querySelector(btnlSelector);
    const content = element.querySelector(contentSelector);

    // Учитываем padding, добавляя его к scrollHeight
    const originalHeight = content.scrollHeight + 
      parseInt(getComputedStyle(content).paddingTop) + 
      parseInt(getComputedStyle(content).paddingBottom) + 'px';

    content.style.setProperty('--accordion-height', '0');
    content.style.transition = 'height ease-out 300ms';

    btn.addEventListener('click', () => {
      const isActive = btn.classList.toggle('active');
      accordions.forEach(item => {
        if (item !== element) {
          const otherBtn = item.querySelector(btnlSelector);
          const otherContent = item.querySelector(contentSelector);
          otherBtn.classList.remove('active');
          otherContent.dataset.ariaExpanded = 'false';
          // // Убираем margin, если требуется
          // otherContent.style.setProperty('--accordion-height', '0');
        }
      });

      if (isActive) {
        // Если содержимое слишком большое, анимация будет длиться дольше
        const accordionTimeAnimate = content.scrollHeight <= 300 ? '300ms' : (content.scrollHeight * 1.2) + 'ms';
        content.style.setProperty('--accordion-height', originalHeight);
        content.style.setProperty('--accordion-time', accordionTimeAnimate);
        content.dataset.ariaExpanded = 'true';
      } else {
        content.style.setProperty('--accordion-height', '0');
        content.dataset.ariaExpanded = 'false';
      }
    });
  });
}

accordionMenu('.sidebar__item', '.sidebar-button', '.sidebar__item-wrapper');
