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
function init() {
  mainSectionEventHandler();
}

init();
