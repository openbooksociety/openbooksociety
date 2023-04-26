let LANG = "en";
let PAGE = "";
let r = document.querySelector(":root");

setRandomCSSColors(3);
populateNav();
populateContent();
// populateGlyphCanvas();

let menu = document.querySelector(".header.menu");
let navLinks = menu.querySelectorAll(".menu .nav-link");

navLinks.forEach((elem) => {
  elem.addEventListener("click", (e) => {
    menu.classList.contains("stacked") ? unstackMenu() : togglePages(e);
  });
});

let subNavLinks = document.querySelectorAll(".imprint-container .nav-link");
subNavLinks.forEach((elem) => {
  elem.addEventListener("click", togglePages);
});

if (!isTouchDevice()) {
  menu.addEventListener("mouseenter", unstackMenu);
  menu.addEventListener("mouseleave", stackMenu);
}
document.addEventListener("scroll", stackMenu);

let title = document.querySelector(".header.title");
title.addEventListener("click", togglePages);

let langButton = document.querySelector("#language-toggle");
langButton.addEventListener("click", toggleLanguage);

async function fetchData() {
  let data = await fetch("content-" + LANG + ".json");
  let json = await data.json();
  return json;
}

function toggleLanguage() {
  LANG = LANG === "de" ? "en" : "de";
  populateNav();
  populateContent();
}

function togglePages(e) {
  if (!e.target.classList.contains("link")) return;
  PAGE = e.target.getAttribute("data-href");
  console.log(PAGE);
  navLinks.forEach((elem, i) => {
    if (elem == e.target)
      r.style.setProperty(
        "--link-color",
        getComputedStyle(r).getPropertyValue("--" + i)
      );
    elem.classList.remove("active");
  });
  e.target.classList.add("active");
  populateContent();
  // populateGlyphCanvas();
}

function unstackMenu() {
  menu.classList.remove("stacked");
}

function stackMenu() {
  menu.classList.add("stacked");
}

async function populateNav() {
  let data = await fetchData();

  setContentofID("#header-text-container", data.general.header);
  setContentofID("#members-link", data.nav.members);
  setContentofID("#join-link", data.nav.joinOrDonate);
  setContentofID("#language-toggle", data.general.navLanguage);
  setContentofID("#about-link", data.nav.about);
  setContentofID("#imprint-link", data.nav.imprint);
  setContentofID("#privacy-link", data.nav.privacy);
}

async function populateContent() {
  let data = await fetchData();
  setContentofID("#text-content", data.content[PAGE]);
  document.querySelector("#text-content").classList = PAGE;

}

function setContentofID(id, content) {
  document.querySelector(id).innerHTML = content != undefined ? content : "";
}

function populateGlyphCanvas() {
  let glyphCanvas = document.querySelector("#glyph-canvas");
  glyphCanvas.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    let elem = document.createElement("div");
    elem.classList.add("random-glyph");
    elem.innerHTML = getRandomGlyph();
    elem.style.left = Math.floor(Math.random() * window.innerWidth) - 30 + "px";
    elem.style.top =
      Math.floor(
        Math.random() * (window.innerHeight - 0.2 * window.innerWidth) +
          0.2 * window.innerWidth -
          30
      ) + "px";

    glyphCanvas.appendChild(elem);
  }
}

function getRandomGlyph() {
  let n = 1;
  while (
    (n <= 33 || n >= 47) &&
    (n <= 58 || n >= 64) &&
    (n <= 91 || n >= 96) &&
    (n <= 123 || n >= 126)
  ) {
    n = Math.floor(Math.random() * 126);
  }
  return String.fromCharCode(n);
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function setRandomCSSColors(amount) {
  for (let i = 0; i < amount; i++) {
    r.style.setProperty("--" + i, get_random_color());
  }
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function get_random_color() {
  let h = Math.floor(rand(0, 360));
  let s = Math.floor(rand(50, 100));
  let l = Math.floor(rand(30, 70));
  return "hsl(" + h + "deg," + s + "%," + l + "%)";
}
