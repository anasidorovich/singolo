(function() {
    "use strict";

    const NAMES = {
        navigationItemClassName: 'navigation__item',
        categoryClassName: 'category',
        portfolioImageClassName: 'portfolio__image'
    }

    const linksToAnchors = document.querySelectorAll('.navigation__item a[href^="#"]'),
        categories = document.querySelectorAll('.category'),
        portfolioImages = document.querySelectorAll('.portfolio__image');

    linksToAnchors.forEach(function(anchor) {
      anchor.addEventListener("click", anchorLinkHandler);
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
