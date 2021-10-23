import { initProductEvents } from "./initProductEvents.js";
import { initCartEvents } from "./initCart.js";
///////////
// INIT

function init() {
  initLocalStorage();
  headerLinkEvHandler();
  initProductEvents();
  addSaleSectionHoverEffect();
  initCartEvents();
  initMobileNav();
}

init();

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

function initMobileNav() {
  const mobileNav = document.querySelector(".mobile-nav");
  closeMobileDivEvListener();
  openMobileNavEvListener();

  function closeMobileDivEvListener() {
    const crossDiv = document.querySelector(".mobile-nav__cross");
    mobileNav.addEventListener("click", (e) => {
      /* Checks if the event user clicked bubbled through the cross 'svg' element
       or user clicked outside any nav link */
      if (e.composedPath().indexOf(crossDiv) >= 0 || e.target === mobileNav) {
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

function initLocalStorage() {
  const products = window.localStorage.getItem("products");
  if (!products) {
    window.localStorage.setItem("products", JSON.stringify([]));
  }
}
