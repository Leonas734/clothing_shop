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
  const product = result.product;
  const images = result.images;

  const newDiv = document.createElement("div");
  newDiv.classList.add("nav-bar__cart-product");
  newDiv.setAttribute("data-product", `${product.id}`);
  newDiv.innerHTML = `
    <img class="nav-bar__cart-product-image" src="${NG_MEDIA_FILES.MEDIA_URL}/${images[0]}">
    <div class="nav-bar__cart-product-title">${product.title}</div>
    <div class="nav-bar__cart-product-price">£${product.price}</div>
    <a href="#" class="nav-bar__cart-product-remove-btn link-one">Remove</a>
    `;
  const cartProductDiv = document.querySelector(".nav-bar__cart-products");
  cartProductDiv.prepend(newDiv);
}

function updateCartTotalProducts() {
  const localStorageProducts = JSON.parse(localStorage.getItem("products"));
  const cartTotalEl = document.querySelector(".nav-bar__cart-total");
  const checkoutButton = document.querySelector(
    ".nav-bar__cart-checkout-button"
  );
  const checkoutMessage = document.querySelector(
    ".nav-bar__cart-checkout-message"
  );
  if (localStorageProducts.length < 1) {
    cartTotalEl.innerHTML = "";
    checkoutButton.style.display = "none";
    checkoutMessage.style.display = "block";
    return;
  }
  checkoutMessage.style.display = "none";
  cartTotalEl.innerHTML = localStorageProducts.length;
  checkoutButton.style.display = "block";
}

function changeCartLogoColour(productId) {
  const colourOne = "rgb(119, 116, 116)";
  const colourTwo = "rgb(254, 125, 151)";
  const cartDiv = document
    .querySelector(`.product__image-container[data-product='${productId}']`)
    .querySelector(".product__cart");

  if (cartDiv.style.fill == colourTwo) {
    cartDiv.style.fill = colourOne;
  } else {
    cartDiv.style.fill = colourTwo;
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
function headerLinkEvHandler() {
  document.querySelector(".header__links").addEventListener("click", (e) => {
    e.preventDefault();
    const targetClassNames = e.target.classList.value;
    const headerEl = document.querySelector(".header");
    const headerText = document.querySelector(".header__text");
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
    headerEl.style.backgroundImage = `url(${newImgURL})`;
    headerText.innerHTML = newTitle;
    addActiveClassNameToElement(e.target, "link-two--active");
  });
}

function initProductEvents() {
  addEvListenerToProducts();

  const allImgContainers = document.querySelectorAll(
    ".product__image-container"
  );
  allImgContainers.forEach((imageContainer) => {
    offsetImages(imageContainer);
    showCartOnProductHover(imageContainer);
  });

  ////
  // initProductEvents() MAIN FUNCTIONS
  function offsetImages(imageContainer) {
    productImgs = [...imageContainer.getElementsByTagName("img")];
    productImgs.forEach((img, index) => {
      img.style.left = `${100 * index}%`;
    });
  }

  function showCartOnProductHover(imageContainer) {
    /* Have to use mouseeenter / mouseleave to ensure cart doesn't get
    hidden when user hovers over the cart element or arrow elements */

    imageContainer.addEventListener("mouseenter", (e) => {
      imageContainer.querySelector(".product__cart").style.display = "initial";
    });
    imageContainer.addEventListener("mouseleave", (e) => {
      imageContainer.querySelector(".product__cart").style.display = "none";
    });
  }

  function addEvListenerToProducts() {
    const productsDivs = document.querySelectorAll(".shop-now__products");
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

    if (arrowClassNames.includes("product__arrow--right")) {
      currSlide -= 1;
    }
    if (arrowClassNames.includes("product__arrow--left")) {
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

  async function updateProductCart(eventDiv) {
    const productId = eventDiv.parentElement.dataset.product;
    if (productInCart(productId)) {
      changeCartLogoColour(productId);
      removeProductFromLocalStorage(productId);
      removeProductFromCart(productId);
    } else {
      changeCartLogoColour(productId);
      addProductToLocalStorage(productId);
      loadProductToCart(productId);
    }
    updateCartTotalProducts();
  }

  function removeProductFromCart(productId) {
    const productsDiv = [
      ...document.querySelector(".nav-bar__cart-products").children,
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
    return element.classList.value.includes("product__cart") ? true : false;
  }
}

function addSaleSectionHoverEffect() {
  const saleDiv = document.querySelector(".sale");
  const manSaleSection = document.querySelector(".sale__man");
  const womanSaleSection = document.querySelector(".sale__woman");

  saleDiv.addEventListener("mouseover", (e) => {
    const divClassNames = e.target.classList.value;
    if (divClassNames.includes("sale__man")) {
      womanSaleSection.style.opacity = "50%";
      manSaleSection.style.transform = "scale(1.1)";
      womanSaleSection.style.transform = "scale(0.95)";
    }
    if (divClassNames.includes("sale__woman")) {
      manSaleSection.style.opacity = "50%";
      womanSaleSection.style.transform = "scale(1.1)";
      manSaleSection.style.transform = "scale(0.95)";
    }
  });

  saleDiv.addEventListener("mouseout", (e) => {
    const divClassNames = e.target.classList.value;
    if (
      divClassNames.includes("sale__man") ||
      divClassNames.includes("sale__woman")
    ) {
      womanSaleSection.style.opacity = "100%";
      manSaleSection.style.opacity = "100%";
      manSaleSection.style.transform = "scale(1)";
      womanSaleSection.style.transform = "scale(1)";
    }
  });
}

function showCartProductsOnIconHover() {
  const cartDiv = document.querySelector(".nav-bar__cart");
  const productsDiv = document.querySelector(".nav-bar__cart-products");
  cartDiv.addEventListener("mouseenter", (e) => {
    productsDiv.style.display = "grid";
  });
  cartDiv.addEventListener("mouseleave", (e) => {
    productsDiv.style.display = "none";
  });
}

function loadCartProductsFromStorage() {
  const products = JSON.parse(localStorage.getItem("products"));
  products.forEach((productId) => {
    cartEl = document
      .querySelector(`[data-product="${productId}"]`)
      .querySelector(".product__cart");

    changeCartLogoColour(productId);
    loadProductToCart(productId);
  });
  updateCartTotalProducts();
}

function initCartRemoveButton() {
  const cartProducts = document.querySelector(".nav-bar__cart-products");
  cartProducts.addEventListener("click", (e) => {
    e.preventDefault();
    const eventDivClassNames = e.target.classList;
    const parentDiv = e.target.parentElement;
    const productId = parentDiv.dataset.product;
    if (eventDivClassNames.value.includes("remove-btn")) {
      parentDiv.style.opacity = "0";
      setTimeout(() => {
        removeProductFromLocalStorage(productId);
        changeCartLogoColour(productId);
        parentDiv.remove();
        updateCartTotalProducts();
      }, 600);
    }
  });
}

function initMobileNav() {
  const mobileNav = document.querySelector(".mobile-nav");
  closeMobileDivEvListener();
  openMobileNavEvListener();

  function closeMobileDivEvListener() {
    const crossDiv = document.querySelector(".mobile-nav__cross");
    mobileNav.addEventListener("click", (e) => {
      // Checks if the event user clicked bubbled through the cross 'svg' element
      if (e.path.indexOf(crossDiv) >= 0) {
        mobileNav.style.display = "none";
      }
    });
  }
  function openMobileNavEvListener() {
    const mobileMenuDiv = document.querySelector(".nav-bar__mobile-menu");
    mobileMenuDiv.addEventListener("click", (e) => {
      mobileNav.style.display = "block";
    });
  }
}

///////////
// INIT
function init() {
  headerLinkEvHandler();
  initProductEvents();
  addSaleSectionHoverEffect();
  showCartProductsOnIconHover();
  loadCartProductsFromStorage();
  initCartRemoveButton();
  initMobileNav();
}

init();
