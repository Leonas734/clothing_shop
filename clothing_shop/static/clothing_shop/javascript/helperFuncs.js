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
  const result = await response.json();
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

export {
  addActiveClassNameToElement,
  loadProductToCart,
  updateCartTotalProducts,
  changeCartLogoColour,
  addProductToLocalStorage,
  removeProductFromLocalStorage,
  productInCart,
};
