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

/* Init popup */
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

/* Init sliders */
document.querySelectorAll('.slider').forEach(slider => {
  const sliderId = slider.id;
  slider.querySelector('.prev').addEventListener('click', () => moveSlide(sliderId, -1));
  slider.querySelector('.next').addEventListener('click', () => moveSlide(sliderId, 1));
  initMouseDrag(sliderId);
});






/* Accordion menu */
function accordionMenu(btnSelector, wrapperSelector, contentSelector) {
  const button = document.querySelector(btnSelector);
  const wrapper = document.querySelector(wrapperSelector);
  const content = document.querySelector(contentSelector);

  button.addEventListener('click', () => {
    if (wrapper.getAttribute('data-aria-expanded') === 'true') {
      button.classList.remove('active');
      content.classList.remove('expand');
      wrapper.setAttribute('data-aria-expanded', 'false');
    } else {
      button.classList.add('active');
      content.classList.add('expand');
      wrapper.setAttribute('data-aria-expanded', 'true');
    }
  });

}

/* Init accordion menu */
accordionMenu('.sidebar-button', '.sidebar__items-wrapper', '.sidebar__items');






/* Card slider */
function createSlider(container) {
  let isDragging = false;
  let startX;
  let scrollLeft;

  const sliderContainer = container.querySelector('[data-wrapper]');
  const nextButton = container.querySelector('[data-button="next"]');
  const prevButton = container.querySelector('[data-button="prev"]');

  function containerWidth() {return sliderContainer.offsetWidth;}

  /* Resize Fn */
  function observerResizeElement(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  let res = containerWidth();
  window.addEventListener('resize', observerResizeElement(() => { res = containerWidth(); }, 250));

  /* Event: Start dragging */
  sliderContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - sliderContainer.offsetLeft;
    scrollLeft = sliderContainer.scrollLeft;
  });

  /* Event: Stop dragging */
  sliderContainer.addEventListener('mouseleave', () => { isDragging = false; });
  sliderContainer.addEventListener('mouseup', () => { isDragging = false; });

  /* Event: Mouse move */
  sliderContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderContainer.offsetLeft;
    const walk = (x - startX) * 2;
    sliderContainer.scrollLeft = scrollLeft - walk;
  });

  /* Touch events */
  sliderContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - sliderContainer.offsetLeft;
    scrollLeft = sliderContainer.scrollLeft;
  });

  sliderContainer.addEventListener('touchend', () => { isDragging = false; });

  sliderContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - sliderContainer.offsetLeft;
    const walk = (x - startX) * 2;
    sliderContainer.scrollLeft = scrollLeft - walk;
  });

  /* Scroll buttons */
  nextButton.addEventListener('click', () => { sliderContainer.scrollLeft += Math.ceil(res/3); });	
  prevButton.addEventListener('click', () => { sliderContainer.scrollLeft -= Math.ceil(res/3); });
}

/* Init card slider */
const sliders = document.querySelectorAll('.partners-container');
sliders.forEach(slider => createSlider(slider));
