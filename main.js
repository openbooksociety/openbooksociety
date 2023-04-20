let LANG = "de";
let contentDE = fetchData("de");
let contentEN = fetchData("en");

populate();

let langButton = document.querySelector(".language-toggle");
document.addEventListener("click", toggleLanguage);

async function fetchData(lang) {
  let data = await fetch("content-" + lang + ".json");
  let json = await data.json();
  return json.res;
}

function toggleLanguage() {
  LANG = LANG === "de" ? "en" : "de";
  LANG === "de" ? populate(contentEN) : populate(contentDE);
  console.log(contentDE);
}

async function populate(data) {
  let contentElement = document.querySelector("#text-content");
  contentElement.innerHTML = data.content;
}
