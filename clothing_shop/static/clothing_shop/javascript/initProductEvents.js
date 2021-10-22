import {
  productInCart,
  changeCartLogoColour,
  addProductToLocalStorage,
  loadProductToCart,
  removeProductFromLocalStorage,
  updateCartTotalProducts,
} from "./helperFuncs.js";

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
    const productImgs = [...imageContainer.getElementsByTagName("img")];
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

export { initProductEvents };
