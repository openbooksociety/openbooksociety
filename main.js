let LANG = "en";
let PAGE = "";
let r = document.querySelector(":root");

populateNav();
populateContent();
populateImprint() 
populateGlyphCanvas();

let menu = document.querySelector(".header.menu");
menu.addEventListener("mouseenter", toggleMenuStack);
menu.addEventListener("mouseleave", toggleMenuStack);
menu.addEventListener("click", togglePages);

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
  console.log(LANG);
  populateNav();
  populateContent();
}

function togglePages(e) {
  if (!e.target.classList.contains("link")) return;
  PAGE = e.target.getAttribute("data-href");
  populateContent();
  populateGlyphCanvas();
}

function toggleMenuStack(e) {
  e.target.classList.contains("stacked")
    ? e.target.classList.remove("stacked")
    : e.target.classList.add("stacked");
}

function getRandomCSSColor() {
  let rand = Math.ceil(Math.random() * 5);
  return getComputedStyle(r).getPropertyValue("--" + rand);
}

async function populateNav() {
  let data = await fetchData();

  setContentofID("#member-link", data.general.navMember);
  setContentofID("#language-toggle", data.general.navLanguage);
  setContentofID("#about-link", data.general.navAbout);
}

async function populateContent() {
  let data = await fetchData();
  setContentofID("#text-content", data.content[PAGE]);
}

async function populateImprint() {
  let data = await fetchData();
  setContentofID("#imprint-link", data.general.navImprint);
  setContentofID("#privacy-link", data.general.navData);

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
    elem.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
    elem.style.top =
      Math.floor(
        Math.random() * (window.innerHeight - 0.2 * window.innerWidth) +
          0.2 * window.innerWidth
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
