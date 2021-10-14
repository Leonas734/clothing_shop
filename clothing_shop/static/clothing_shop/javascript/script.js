// HELPER FUNCTIONS
function addActiveClassNameToElement(element, className) {
  const parentEl = element.parentElement;
  const elementSiblings = [...parentEl.children];
  elementSiblings.forEach((el) => {
    el.classList.remove(className);
  });
  element.classList.add(className);
}

function addImageSliderToProducts() {
  offsetEachImage();
  const productsDivs = document.querySelectorAll(".shop-outfit__products");

  productsDivs.forEach((productDiv) => {
    productDiv.addEventListener("click", (e) => {
      let arrowSvgEl;
      // Slight chance of user clicking 'use' element inside the 'svg' element
      // If statement checks for it below and sets correct element to arrowSvgEl
      if (e.target.tagName === "use") {
        arrowSvgEl = e.target.parentElement;
      } else {
        arrowSvgEl = e.target;
      }

      const arrowClassNames = arrowSvgEl.classList.value;
      const imgContainer = arrowSvgEl.parentElement;
      const productImgs = [...imgContainer.getElementsByTagName("img")];
      const totalSlides = productImgs.length;
      let currSlide = +imgContainer.dataset.slide;

      if (arrowClassNames.includes("arrow-right")) {
        currSlide -= 1;
      }
      if (arrowClassNames.includes("arrow-left")) {
        currSlide += 1;
      }
      // End of slide reached, reset currSlide
      if (currSlide === 1) {
        currSlide = -totalSlides + 1;
      }
      if (currSlide === -totalSlides) {
        currSlide = 0;
      }
      imgContainer.dataset.slide = currSlide;

      slideImages(productImgs, currSlide);
    });
  });

  function offsetEachImage(productImgs) {
    const allImgContainers = document.querySelectorAll(
      ".shop-outfit__product-image-container"
    );
    allImgContainers.forEach((imgContainer) => {
      productImgs = [...imgContainer.getElementsByTagName("img")];
      productImgs.forEach((img, index) => {
        img.style.left = `${100 * index}%`;
      });
    });
  }

  function slideImages(images, currSlide) {
    images.forEach((img) => {
      img.style.transform = `translateX(${currSlide * 100}%)`;
    });
  }
}

function showCartOnProductHover() {
  const shopOutfitProductImgContainers = document.querySelectorAll(
    ".shop-outfit__product-image-container"
  );

  shopOutfitProductImgContainers.forEach((imgContainer) => {
    imgContainer.addEventListener("mouseenter", (e) => {
      imgContainer.querySelector(".shop-outfit__product-cart").style.display =
        "initial";
    });
    imgContainer.addEventListener("mouseleave", (e) => {
      imgContainer.querySelector(".shop-outfit__product-cart").style.display =
        "none";
    });
  });
}

// MAIN FUNCTIONS
function mainSectionClickEventHandler() {
  document
    .querySelector(".section-main__links")
    .addEventListener("click", (e) => {
      e.preventDefault();
      const targetClassNames = e.target.classList.value;
      const mainSectionEl = document.querySelector(".section-main");
      const mainSectionTitleEl = document.querySelector(".section-main__title");
      let newTitle;
      let newImgURL;

      if (targetClassNames.includes("women")) {
        newImgURL = `${NG_STATIC_FILES.STATIC_URL}/img/model-image-1.jpg`;
        newTitle = "Simplify<br>Everything";
      } else if (targetClassNames.includes("men")) {
        newImgURL = `${NG_STATIC_FILES.STATIC_URL}/img/model-image-2.jpg`;
        newTitle = "Recycled<br>Sweaters";
      } else if (targetClassNames.includes("sale")) {
        newImgURL = `${NG_STATIC_FILES.STATIC_URL}/img/sale-image-1.jpg`;
        newTitle = "Autumn<br>Sale";
      } else {
        return;
      }
      mainSectionEl.style.backgroundImage = `url(${newImgURL})`;
      mainSectionTitleEl.innerHTML = newTitle;
      addActiveClassNameToElement(e.target, "link--active");
    });
}

function initProductEvents() {
  addImageSliderToProducts();
  showCartOnProductHover();
}

function addSaleSectionHoverEffect() {
  const saleDiv = document.querySelector(".section-sale");
  const manSaleSection = document.querySelector(".section-sale__man");
  const womanSaleSection = document.querySelector(".section-sale__woman");

  saleDiv.addEventListener("mouseover", (e) => {
    const divClassNames = e.target.classList.value;
    if (divClassNames.includes("section-sale__man")) {
      womanSaleSection.style.opacity = "50%";
      manSaleSection.style.transform = "scale(1.1)";
      womanSaleSection.style.transform = "scale(0.95)";
    }
    if (divClassNames.includes("section-sale__woman")) {
      manSaleSection.style.opacity = "50%";
      womanSaleSection.style.transform = "scale(1.1)";
      manSaleSection.style.transform = "scale(0.95)";
    }
  });

  saleDiv.addEventListener("mouseout", (e) => {
    const divClassNames = e.target.classList.value;
    if (
      divClassNames.includes("section-sale__man") ||
      divClassNames.includes("section-sale__woman")
    ) {
      womanSaleSection.style.opacity = "100%";
      manSaleSection.style.opacity = "100%";
      manSaleSection.style.transform = "scale(1)";
      womanSaleSection.style.transform = "scale(1)";
    }
  });
}

function init() {
  mainSectionClickEventHandler();
  initProductEvents();
  addSaleSectionHoverEffect();
}

init();
