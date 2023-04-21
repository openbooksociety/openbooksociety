let LANG = "de";
let r = document.querySelector(":root");

populate();
document.addEventListener("load", populate);

let menu = document.querySelector(".header.menu");
menu.addEventListener("mouseenter", toggleMenuStack);
menu.addEventListener("mouseleave", toggleMenuStack);

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
  populate();
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

async function populate() {
  data = await fetchData();

  setContentofID("#text-content", data.content.text);
  setContentofID("#member-link", data.general.navMember);
  setContentofID("#language-toggle", data.general.navLanguage);
  setContentofID("#about-link", data.general.navAbout);
}

function setContentofID(id, content) {
  document.querySelector(id).innerHTML = content;
}
