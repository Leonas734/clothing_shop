///////////
/// LOCAL STORAGE
localStorage.setItem("products", JSON.stringify([]));

function addProductToLocalStorage(productId) {
  const products = JSON.parse(localStorage.getItem("products"));
  products.push(productId);

  localStorage.setItem("products", JSON.stringify(products));
}

function removeProductFromLocalStorage(productId) {
  const products = JSON.parse(localStorage.getItem("products"));
  const productIndex = products.indexOf(productId);
  products.splice(productIndex, 1);
  localStorage.setItem("products", JSON.stringify(products));
}

function isProductInCart(productId) {
  const products = JSON.parse(localStorage.getItem("products"));
  const productIndex = products.indexOf(productId);
  return productIndex >= 0 ? true : false;
}

////////////
/// HELPER FUNCTIONS
function addActiveClassNameToElement(element, className) {
  const parentEl = element.parentElement;
  const elementSiblings = [...parentEl.children];
  elementSiblings.forEach((el) => {
    el.classList.remove(className);
  });
  element.classList.add(className);
}

///////////
/// MAIN FUNCTIONS
function mainSectionLinkClickEventHandler() {
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
  offsetEachImage();
  showCartOnProductHover();
  const productsDivs = document.querySelectorAll(".shop-outfit__products");

  productsDivs.forEach((productsDiv) => {
    productsDiv.addEventListener("click", (e) => {
      // User has a small chance of clicking 'use' element inside the 'svg' element
      const eventDiv =
        e.target.tagName === "use" ? e.target.parentElement : e.target;

      if (eventDiv.classList.value.includes("arrow")) {
        slideImages(eventDiv);
      } else if (eventDiv.classList.value.includes("product-cart")) {
        updateProductCart(eventDiv);
      } else return;
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

  function slideImages(arrowEl) {
    const arrowClassNames = arrowEl.classList.value;
    const imgContainer = arrowEl.parentElement;
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

    productImgs.forEach((img) => {
      img.style.transform = `translateX(${currSlide * 100}%)`;
    });
  }

  function showCartOnProductHover() {
    /* Have to use mouseeenter / mouseleave to ensure cart doesn't get
    hidden when user hovers over the cart element or arrow elements */
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

  function updateProductCart(cartDiv) {
    const productId = cartDiv.parentElement.dataset.product;
    if (isProductInCart(productId)) {
      cartDiv.style.fill = "#777474";
      removeProductFromLocalStorage(productId);
    } else {
      cartDiv.style.fill = "#fe7d97";
      addProductToLocalStorage(productId);
    }

    loadProductsFromLocalStorage();
  }
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

function loadProductsFromLocalStorage() {
  const products = JSON.parse(localStorage.getItem("products"));
  const cartTotal = document.querySelector(".nav__cart-total");
  if (products.length < 1) {
    cartTotal.innerHTML = "";
    return;
  }

  cartTotal.innerHTML = products.length;
}

function init() {
  mainSectionLinkClickEventHandler();
  initProductEvents();
  addSaleSectionHoverEffect();
  loadProductsFromLocalStorage();
}

init();
