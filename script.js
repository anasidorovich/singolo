(function() {
    "use strict";

    window.addEventListener('scroll', onScroll);

    const NAMES = {
        navigationItemClassName: 'navigation__item',
        categoryClassName: 'category',
        portfolioImageClassName: 'portfolio__image'
    }

    const OFFSET_HEIGHT = 70;

    var header = document.querySelector('.header'),
        menu = document.querySelector('.menu'),
        menuButton = document.querySelector('.menu-btn'),
        menuOverlay = document.querySelector('.menu-overlay'),
        linksToAnchors = document.querySelectorAll('.navigation__item a[href^="#"]'),
        phonesImages = document.querySelectorAll('.phone__image'),
        categories = document.querySelectorAll('.category'),
        portfolioImages = document.querySelectorAll('.portfolio__image'),
        portfolioImagesOrders = Array.from({
            length: portfolioImages.length
        }, (v, k) => k),
        portfolio = portfolioImages[0].parentNode,
        sliderItems = document.querySelectorAll('.slide'),
        sliderChevs = document.querySelectorAll('.slider-chev'),
        formPopupOverlay = document.querySelector('.get-quote__form .overlay'),
        slidesCount = sliderItems.length,
        section = document.querySelectorAll("section"),
        lasSectionKey = section[section.length - 1].id,
        sections = {},
        position = 0,
        sectionKey = 0,
        move = true;

    sections[header.id] = header.offsetTop - OFFSET_HEIGHT;

    Array.prototype.forEach.call(section, function(e) {
        sections[e.id] = e.offsetTop - OFFSET_HEIGHT;
    });

    linksToAnchors.forEach(function(anchor) {
        anchor.addEventListener("click", anchorLinkHandler);
    });

    sliderChevs.forEach(function(chev) {
        chev.addEventListener("click", nextSlide);
    });

    function currentSlide(index) {
        return (index + slidesCount) % slidesCount;
    }

    function nextSlide(e) {
        e.preventDefault();
        if (move) {
          if (this.classList.contains('slider-chev_left')) {
              hideSlide('move-to-right');
              position = currentSlide(position - 1);
              showSlide('move-from-left');
          }
          if (this.classList.contains('slider-chev_right')) {
              hideSlide('move-to-left');
              position = currentSlide(position + 1);
              showSlide('move-from-right');
          }
        }
    }

    function hideSlide(direction) {
        move = false;
        sliderItems[position].classList.add(direction);
        sliderItems[position].addEventListener('animationend', function() {
            this.classList.remove('slide_active', direction);
        });
    }

    function showSlide(direction) {
        sliderItems[position].classList.add('slide_next', direction);
        sliderItems[position].addEventListener('animationend', function() {
            this.classList.remove('slide_next', direction);
            this.classList.add('slide_active');
            move = true;
        });
    }

    menuButton.addEventListener('click', function() {
        this.classList.toggle('open');
        menu.classList.toggle('open');
        menuOverlay.classList.toggle('open');
    });

    menuOverlay.addEventListener('click', function() {
        hideMenu();
    });

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
            messageElement = formPopupOverlay.querySelector(".popup__message span"),
            subject = this.elements['subject'].value,
            message = this.elements['message'].value;

        sbjElement.innerText = subject ? 'Subject: ' +  subject : sbjElement.getAttribute("data-default-value");
        messageElement.innerText = message ? 'Description: ' + message : messageElement.getAttribute("data-default-value");

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

        hideMenu();

        let targetID = this.getAttribute('href');
        let target = document.querySelector(targetID);

        window.scrollTo({
            top: target.offsetTop - OFFSET_HEIGHT,
            behavior: "smooth"
        });

        history.pushState(null, null, targetID);
    }

    function hideMenu(e) {
        menu.classList.remove('open');
        menuButton.classList.remove('open');
        menuOverlay.classList.remove('open');
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
        portfolioImagesOrders.sort(function() {
            return 0.5 - Math.random();
        });
        for (let i = portfolioImages.length - 1; i >= 0; i--) {
            portfolio.appendChild(portfolioImages[portfolioImagesOrders[i]]);
        }
    }

    function markSelected(sectionKey) {
        linksToAnchors.forEach(element => {
            if (element.getAttribute('href') == '#' + sectionKey) {
                element.parentNode.classList.add(NAMES.navigationItemClassName + '_selected');
            } else {
                element.parentNode.classList.remove(NAMES.navigationItemClassName + '_selected');
            }
        });
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
            markSelected(lasSectionKey);
        } else {
            for (sectionKey in sections) {
                if (sections[sectionKey] <= scrollPosition) {
                    markSelected(sectionKey);
                }
            }
        }
    }
})();
