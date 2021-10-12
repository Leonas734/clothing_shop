function mainSectionEventHandler() {
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
function addActiveClassNameToElement(element, className) {
  const parentEl = element.parentElement;
  const elementSiblings = [...parentEl.children];
  elementSiblings.forEach((el) => {
    el.classList.remove(className);
  });
  element.classList.add(className);
}

function addImageSliderToProducts(parentEl) {
  let products = [...parentEl.children];
  products.forEach((productDiv) => {
    const productChildElms = [...productDiv.children];
    productChildElms.forEach((productEl) => {
      if (!isImgContainer(productEl)) return;
      const imgContainerDiv = productEl;
      const productImgs = [...imgContainerDiv.getElementsByTagName("img")];
      if (productImgs.length === 0) return;
      offsetEachImage(productImgs);
      addEvListenerToImgContainer(imgContainerDiv, productImgs);
    });
  });

  function isImgContainer(element) {
    const result = element.classList.value.includes("image-container")
      ? true
      : false;
    return result;
  }
  function offsetEachImage(productImgs) {
    productImgs.forEach((img, index) => {
      img.style.left = `${100 * index}%`;
    });
  }
  function addEvListenerToImgContainer(imgContainerDiv, productImgs) {
    let currSlide = 0;

    imgContainerDiv.addEventListener("click", function (e) {
      const eventClassNames = e.target.classList.value;
      const totalSlides = productImgs.length;

      if (eventClassNames.includes("arrow-left")) {
        currSlide += 1;
      } else if (eventClassNames.includes("arrow-right")) {
        currSlide -= 1;
      } else {
        return; // User clicked inside img container, but not either arrow.
      }
      // User reached end
      if (currSlide === 1) {
        currSlide = -totalSlides + 1;
      }
      if (currSlide === -totalSlides) {
        currSlide = 0;
      }
      slideImages(productImgs, currSlide);
    });
  }
  function slideImages(images, currSlide) {
    images.forEach((img) => {
      img.style.transform = `translateX(${currSlide * 100}%)`;
    });
  }
}

function init() {
  mainSectionEventHandler();
  const womenProductsEl = document.querySelector(
    ".shop-outfit__products-women"
  );
  addImageSliderToProducts(womenProductsEl);
  const menProductsEl = document.querySelector(".shop-outfit__products-men");
  addImageSliderToProducts(menProductsEl);
}

init();
