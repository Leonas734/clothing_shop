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

async function loadProductToCart(productId) {
  const response = await fetch(
    `http://127.0.0.1:8000/get_product/${productId}`
  );
  result = await response.json();
  // console.log(result);
  const product = result.product;
  const images = result.images;

  const newDiv = document.createElement("div");
  newDiv.classList.add("nav__cart-product");
  newDiv.setAttribute("data-product", `${product.id}`);
  newDiv.innerHTML = `
    <img class="nav__cart-product-image" src="${NG_MEDIA_FILES.MEDIA_URL}/${images[0]}">
    <div class="nav__cart-product-title">${product.title}</div>
    <div class="nav__cart-product-price">£${product.price}</div>
    `;
  const cartProductDiv = document.querySelector(".nav__cart-products");
  cartProductDiv.prepend(newDiv);
}

function updateCartTotalProducts() {
  const localStorageProducts = JSON.parse(localStorage.getItem("products"));
  const cartTotalEl = document.querySelector(".nav__cart-total");
  const checkoutButton = document.querySelector(".nav__cart-checkout-button");
  const checkoutMessage = document.querySelector(".nav__cart-checkout-message");
  if (localStorageProducts.length < 1) {
    cartTotalEl.innerHTML = "";
    checkoutButton.style.display = "none";
    checkoutMessage.style.display = "block";
    return;
  }
  checkoutMessage.style.display = "none";
  cartTotalEl.innerHTML = localStorageProducts.length;
  checkoutButton.style.display = "flex";
}

function changeCartLogoColour(cartEl, removeItem = false) {
  if (removeItem) {
    cartEl.style.fill = "#777474";
  } else {
    cartEl.style.fill = "#fe7d97";
  }
}

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

function productInCart(productId) {
  const products = JSON.parse(localStorage.getItem("products"));
  const productIndex = products.indexOf(productId);
  return productIndex >= 0 ? true : false;
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
        newImgURL = `${NG_STATIC_FILES.STATIC_URL}/img/sale.jpg`;
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
  addEvListenerToProducts();

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

  function addEvListenerToProducts() {
    const productsDivs = document.querySelectorAll(".shop-outfit__products");
    productsDivs.forEach((productsDiv) => {
      productsDiv.addEventListener("click", (e) => {
        // User has a small chance of clicking 'use' element inside the 'svg' element
        const eventDiv =
          e.target.tagName === "use" ? e.target.parentElement : e.target;

        if (userClickedProductArrow(eventDiv)) {
          slideImages(eventDiv);
        } else if (userClickedAddToCart(eventDiv)) {
          updateProductCart(eventDiv);
        } else return;
      });
    });
  }

  ////
  // initProductEvents() HELPER FUNCTIONS
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

  async function updateProductCart(cartEl) {
    const productId = cartEl.parentElement.dataset.product;
    if (productInCart(productId)) {
      changeCartLogoColour(cartEl, (removeItem = true));
      removeProductFromLocalStorage(productId);
      removeProductFromCart(productId);
    } else {
      changeCartLogoColour(cartEl, (removeItem = false));
      addProductToLocalStorage(productId);
      loadProductToCart(productId);
    }

    updateCartTotalProducts();
  }

  function removeProductFromCart(productId) {
    const productsDiv = [
      ...document.querySelector(".nav__cart-products").children,
    ];
    productsDiv.forEach((product) => {
      if (product.dataset.product === productId) {
        product.remove();
      }
    });
  }

  function userClickedProductArrow(element) {
    return element.classList.value.includes("arrow") ? true : false;
  }

  function userClickedAddToCart(element) {
    return element.classList.value.includes("product-cart") ? true : false;
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

function loadCartProductsFromStorage() {
  const products = JSON.parse(localStorage.getItem("products"));
  products.forEach((productId) => {
    cartEl = document
      .querySelector(`[data-product="${productId}"]`)
      .querySelector(".shop-outfit__product-cart");

    changeCartLogoColour(cartEl, (removeItem = false));
    loadProductToCart(productId);
  });
  updateCartTotalProducts();
}

function showCartProductsOnIconHover() {
  const cartDiv = document.querySelector(".nav__cart");
  const productsDiv = document.querySelector(".nav__cart-products");
  cartDiv.addEventListener("mouseenter", (e) => {
    productsDiv.style.display = "grid";
  });
  cartDiv.addEventListener("mouseleave", (e) => {
    productsDiv.style.display = "none";
  });
}

function init() {
  mainSectionLinkClickEventHandler();
  initProductEvents();
  addSaleSectionHoverEffect();
  loadCartProductsFromStorage();
  showCartProductsOnIconHover();
}

init();
