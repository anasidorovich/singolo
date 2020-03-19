(function() {
    "use strict";

    window.addEventListener('resize', setTransform);
    window.addEventListener('scroll', onScroll);

    const NAMES = {
        navigationItemClassName: 'navigation__item',
        categoryClassName: 'category',
        portfolioImageClassName: 'portfolio__image'
    }

    var header = document.querySelector('.header'),
        linksToAnchors = document.querySelectorAll('.navigation__item a[href^="#"]'),
        phonesImages = document.querySelectorAll('.phone__image'),
        categories = document.querySelectorAll('.category'),
        portfolioImages = document.querySelectorAll('.portfolio__image'),
        portfolioImagesOrders = Array.from({ length: portfolioImages.length }, (v, k) => k),
        portfolio = portfolioImages[0].parentNode,
        slides = document.querySelector('.slider-wrapper'),
        sliderChevs = document.querySelectorAll('.slider-chev'),
        formPopupOverlay = document.querySelector('.get-quote__form .overlay');

    var slidesCount = document.querySelectorAll('.slide').length,
        section = document.querySelectorAll("section"),
        sections = {},
        pos = 0,
        sectionKey = 0;
    sections[header.id] = header.offsetTop - header.offsetHeight;

    Array.prototype.forEach.call(section, function(e) {
        sections[e.id] = e.offsetTop - header.offsetHeight;
    });

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

    function currentSlide(index) {
        return (index + slidesCount) % slidesCount;
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

        let navItemClassList = this.parentNode.classList;
        if (!navItemClassList.contains(NAMES.navigationItemClassName + '_selected')) {
            linksToAnchors.forEach(element => element.parentNode.classList.remove(NAMES.navigationItemClassName + '_selected'));
            navItemClassList.toggle(NAMES.navigationItemClassName + '_selected');
        }
        let targetID = this.getAttribute('href');
        let target = document.querySelector(targetID);

        window.scrollTo({
            top: target.offsetTop - header.offsetHeight,
            behavior: "smooth"
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

        if (!this.classList.contains(NAMES.categoryClassName + '_selected')) {

            categories.forEach(element => element.classList.remove(NAMES.categoryClassName + '_selected'));
            this.classList.toggle(NAMES.categoryClassName + '_selected');

            shufflePortfolioImages();
        }
    }

    function shufflePortfolioImages() {
        portfolioImagesOrders.sort(function() { return 0.5 - Math.random(); });
        for (let i = portfolioImages.length - 1; i >= 0; i--) {
           portfolio.appendChild(portfolioImages[portfolioImagesOrders[i]]);
        }
    }

    function onScroll() {
        var scrollPosition = window.scrollY || window.pageYOffset;
        if (scrollPosition > header.offsetHeight) {
            header.classList.add("fixed-header_scrolled");
        } else {
            header.classList.remove("fixed-header_scrolled");
        }
        let scrollEnded = window.innerHeight + window.scrollY >= document.body.offsetHeight;
        if (scrollEnded) {
            linksToAnchors.forEach(element => element.parentNode.classList.remove(NAMES.navigationItemClassName + '_selected'));
            linksToAnchors[linksToAnchors.length - 1].parentNode.classList.add(NAMES.navigationItemClassName + '_selected');
        } else {
            for (sectionKey in sections) {
                if (sections[sectionKey] <= scrollPosition) {
                    linksToAnchors.forEach(element => {
                        if (element.getAttribute('href') == '#' + sectionKey) {
                            element.parentNode.classList.add(NAMES.navigationItemClassName + '_selected');
                        } else {
                            element.parentNode.classList.remove(NAMES.navigationItemClassName + '_selected');
                        }
                    })
                }
            }
        }
    }
})();
