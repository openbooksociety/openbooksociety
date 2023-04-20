let LANG = "de";
populate();
document.addEventListener("load", populate);

let langButton = document.querySelector(".language-toggle");
document.addEventListener("click", toggleLanguage);

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

async function populate() {
  data = await fetchData();
  console.log(data);
  document.querySelector("#text-content").innerHTML = data.content.text;
  document.querySelector("#text-content").innerHTML = data.content.text;
}
