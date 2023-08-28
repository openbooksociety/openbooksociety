let LANG = "en";
let PAGE = "";

let r = document.querySelector(":root");

window.addEventListener("load", () => {
    PAGE = window.location.hash.replaceAll("#", "");
    console.log(PAGE);
    if (PAGE != "") {
        document.querySelector("body").className = PAGE;
        document
            .querySelector("[data-href='" + PAGE + "']")
            .classList.add("active");
    }

    populateNav();
    setRandomCSSColors(3);
    populateContent();
});

let menu = document.querySelector(".header.menu");
if (!isTouchDevice()) {
    menu.addEventListener("mouseenter", unstackMenu);
    menu.addEventListener("mouseleave", stackMenu);
} else {
    unstackMenu()
}
document.addEventListener("scroll", (e) => {
    console.log(window.scrollY)
    if (window.scrollY < 15) {
        unstackMenu()
    } else {
        stackMenu()
    }
});

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

let title = document.querySelector(".header.title");
title.addEventListener("click", togglePages);

let langButton = document.querySelector("#language-toggle-desktop");
langButton.addEventListener("click", toggleLanguage);

let langButtonMobile = document.querySelector("#language-toggle-mobile");
langButtonMobile.addEventListener("click", toggleLanguage);

// ------ functions ------

async function fetchSnippetData() {
    let data = await fetch("snippets/content-" + LANG + ".json");
    let json = await data.json();

    return json;
}

async function fetchMDData(slug) {
    if (slug == "") return "";
    let data = await fetch(
        "https://raw.githubusercontent.com/schnavy/openbooksociety/main/pages/" +
        slug +
        "-" +
        LANG +
        ".md"
    );
    let text = await data.text();
    let html = MarkdownToHtml.parse(text);
    html = html.replaceAll(/\\/g, "<br/>");
    return html;
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
        if (elem === e.target)
            r.style.setProperty(
                "--link-color",
                getComputedStyle(r).getPropertyValue("--" + i)
            );
        elem.classList.remove("active");
    });

    document.querySelector("body").className = PAGE;

    e.target.classList.add("active");
    populateContent();
    window.scrollTo(0, 0)
}

function unstackMenu() {
    menu.classList.remove("stacked");
}

function stackMenu() {
    menu.classList.add("stacked");
}

async function populateNav() {
    let data = await fetchSnippetData();
    setContentofID("#header-text-container", data.general.header);
    setContentofID("#header-text-container-mobile", data.general.header);
    setContentofID("#members-link", data.nav.members);
    setContentofID("#join-link", data.nav.joinOrDonate);
    setContentofID("#language-toggle-mobile", data.general.navLanguage);
    setContentofID("#language-toggle-desktop", data.general.navLanguage);
    setContentofID("#about-link", data.nav.about);
    setContentofID("#imprint-link", data.nav.imprint);
    setContentofID("#privacy-link", data.nav.privacy);
}

async function populateContent() {
    let data = await fetchMDData(PAGE);
    setContentofID("#text-content", data);
    document.querySelector("#text-content").classList = PAGE;
}

function setContentofID(id, content) {
    document.querySelector(id).innerHTML = content != undefined ? content : "";
}

function setRandomCSSColors(amount) {
    for (let i = 0; i < amount; i++) {
        r.style.setProperty("--" + i, get_random_color());
    }
}

// ------ helpers ------

function isTouchDevice() {
    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
    );
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
