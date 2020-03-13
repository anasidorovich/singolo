(function() {
    "use strict";

    window.addEventListener('resize', setTransform);

    const NAMES = {
        navigationItemClassName: 'navigation__item',
        categoryClassName: 'category',
        portfolioImageClassName: 'portfolio__image'
    }

    const linksToAnchors = document.querySelectorAll('.navigation__item a[href^="#"]'),
        phonesImages = document.querySelectorAll('.phone__image'),
        categories = document.querySelectorAll('.category'),
        portfolioImages = document.querySelectorAll('.portfolio__image'),
        slides = document.querySelector('.slider-wrapper'),
        sliderChevs = document.querySelectorAll('.slider-chev');

    var itemCount = document.querySelectorAll('.slide').length, pos = 0;

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

    function nextSlider(e) {
        e.preventDefault();
        if (this.classList.contains('slider-chev_left')) {
            pos--;
        }
        if (this.classList.contains('slider-chev_right')) {
            pos++;
        }
        if (pos < 0 || pos == itemCount) {
            pos = 0;
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

            if (category === 'All') {
                animate(portfolioImages);
            } else {
                filterItems(this.id);
            }
        }
    }

    function filterItems(category) {
        var filteredPortfolioImages = [];
        portfolioImages.forEach(item => {
            if (category == item.getAttribute("data-category-type")) {
                filteredPortfolioImages.push(item);
            } else {
                item.style.display = 'none';
                item.classList.remove(NAMES.portfolioImageClassName + '_highlighted');
            }
        });
        animate(filteredPortfolioImages);
    }

    function animate(item) {
        (function show(counter) {
            setTimeout(function() {
                if (item[counter]) {
                    item[counter].style.display = null;
                    counter++;
                    if (counter < item.length) {
                        show(counter);
                    }
                }
            }, 50);
        })(0);
    }

})();
