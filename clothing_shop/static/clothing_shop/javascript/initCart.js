import {
  changeCartLogoColour,
  loadProductToCart,
  removeProductFromLocalStorage,
  updateCartTotalProducts,
} from "./helperFuncs.js";

function initCartEvents() {
  showCartProductsOnIconHover();
  loadCartProductsFromStorage();
  initCartRemoveButton();

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
    const localStorageProducts = window.localStorage.getItem("products");
    if (localStorageProducts.length < 1) return;
    const products = JSON.parse(localStorageProducts);
    products.forEach((productId) => {
      const cartEl = document
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
}

export { initCartEvents };
