(function() {
    "use strict";

    window.addEventListener('resize', setTransform);

    /*
    function showNextSlider() {
      if (sliderChevs[1]) {
       // sliderChevs[1].click();
      }
    }
    setInterval(showNextSlider, 2000);
    */

    const NAMES = {
        navigationItemClassName: 'navigation__item',
        categoryClassName: 'category',
        portfolioImageClassName: 'portfolio__image'
    }

    var linksToAnchors = document.querySelectorAll('.navigation__item a[href^="#"]'),
        phonesImages = document.querySelectorAll('.phone__image'),
        categories = document.querySelectorAll('.category'),
        portfolioImages = document.querySelectorAll('.portfolio__image'),
        slides = document.querySelector('.slider-wrapper'),
        sliderChevs = document.querySelectorAll('.slider-chev'),
        formPopupOverlay = document.querySelector('.get-quote__form .overlay');

    var itemCount = document.querySelectorAll('.slide').length,
        portfolioImagesOrders = Array.from({
            length: portfolioImages.length
        }, (v, k) => k),
        pos = 0;

    linksToAnchors.forEach(function(anchor) {
        anchor.addEventListener("click", anchorLinkHandler);
    });

    function setTransform() {
        var transformed = 'translate3d(' + (-pos * slides.offsetWidth) + 'px,0,0)';
        slides.style.WebkitTransform = transformed;
        slides.style.msTransform = transformed;
        slides.style.transform = transformed;
    }

    sliderChevs.forEach(function(chev) {
        chev.addEventListener("click", nextSlider);
    });

    function currentSlide(i) {
      return (i + itemCount) % itemCount;
    }

    function nextSlider(e) {
        e.preventDefault();
        if (this.classList.contains('slider-chev_left')) {
            pos = currentSlide(pos - 1);
        }
        if (this.classList.contains('slider-chev_right')) {
            pos = currentSlide(pos + 1);
        }

        setTransform();
    }

    phonesImages.forEach(function(image) {
        image.addEventListener("click", phoneImageClick);
    });

    portfolioImages.forEach(function(image) {
        image.addEventListener("click", portfolioImageClick);
    });

    categories.forEach(function(category) {
        category.addEventListener("click", categoryClick);
    });

    document.querySelector('.get-quote__form form').addEventListener('submit', function(e) {
        e.preventDefault();

        let sbjElement = formPopupOverlay.querySelector(".popup__subject span"),
            messageElement = formPopupOverlay.querySelector(".popup__message span");

        sbjElement.innerText = this.elements['subject'].value || sbjElement.getAttribute("data-default-value");
        messageElement.innerText = this.elements['message'].value || messageElement.getAttribute("data-default-value");

        this.reset();

        formPopupOverlay.classList.remove('fade');
    }, false);

    document.querySelector('.close-popup').addEventListener('click', function() {
        formPopupOverlay.classList.add('fade');
    });

    document.querySelector('.popup__button').addEventListener('click', function() {
        formPopupOverlay.classList.add('fade');
    });

    document.addEventListener('mouseup', function() {
        formPopupOverlay.classList.add('fade');
        portfolioImages.forEach(element => element.classList.remove(NAMES.portfolioImageClassName + '_highlighted'));
    });

    function anchorLinkHandler(e) {
        e.preventDefault();

        if (!this.parentNode.classList.contains(NAMES.navigationItemClassName + '_selected')) {
            linksToAnchors.forEach(element => element.parentNode.classList.remove(NAMES.navigationItemClassName + '_selected'));
            this.parentNode.classList.toggle(NAMES.navigationItemClassName + '_selected');
        }
        let targetID = this.getAttribute('href');
        let target = document.querySelector(targetID);

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        history.pushState(null, null, targetID);
    }

    function phoneImageClick(e) {
        e.preventDefault();
        this.style.opacity = this.style.opacity === "0" ? "1" : "0";
    }

    function portfolioImageClick(e) {
        e.preventDefault();

        if (!this.classList.contains(NAMES.portfolioImageClassName + '_highlighted')) {

            portfolioImages.forEach(element => element.classList.remove(NAMES.portfolioImageClassName + '_highlighted'));
            this.classList.toggle(NAMES.portfolioImageClassName + '_highlighted');
        }
    }

    function categoryClick(e) {
        e.preventDefault();

        let category = e.target.textContent;

        if (!this.classList.contains(NAMES.categoryClassName + '_selected')) {

            categories.forEach(element => element.classList.remove(NAMES.categoryClassName + '_selected'));
            this.classList.toggle(NAMES.categoryClassName + '_selected');

            portfolioImages.forEach(function(image) {
                image.style.display = 'none';
            });

            animate(portfolioImages);
        }
    }

    function animate(item) {
       portfolioImagesOrders.sort(function() { return 0.5 - Math.random() });

        (function show(counter) {
            setTimeout(function() {
                if (item[counter]) {
                    item[counter].style.display = null;
                    item[counter].style.order = portfolioImagesOrders[counter];
                    counter++;
                    if (counter < item.length) {
                        show(counter);
                    }
                }
            }, 30);
        })(0);
    }

})();
