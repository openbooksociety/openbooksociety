import {isTouchDevice, get_random_color} from "./utils.js"

// Initial Configuration
const r = document.querySelector(":root");
let LANG = localStorage.getItem("lang") || "en";
let PAGE = "";

// ------ Event Listeners ------

window.addEventListener("load", initializePage);

// Menu event listeners
const menu = document.querySelector(".header.menu");
if (!isTouchDevice()) {
    menu.addEventListener("mouseenter", unstackMenu);
    menu.addEventListener("mouseleave", stackMenu);
} else {
    unstackMenu();
}

document.addEventListener("scroll", handleScroll);

// Nav links event listeners
const navLinks = menu.querySelectorAll(".menu .nav-link");
navLinks.forEach((elem) => {
    elem.addEventListener("click", handleNavLinkClick);
});

const subNavLinks = document.querySelectorAll(".imprint-container .nav-link");
subNavLinks.forEach((elem) => {
    elem.addEventListener("click", togglePages);
});

document.querySelector(".header.title").addEventListener("click", togglePages);

// Language buttons event listeners
document.querySelector("#language-toggle-desktop").addEventListener("click", toggleLanguage);
document.querySelector("#language-toggle-mobile").addEventListener("click", toggleLanguage);

// ------ Main Functions ------

async function initializePage() {
    PAGE = window.location.hash.replace("#", "");

    if (PAGE !== "") {
        document.body.className = PAGE;
        document.querySelector(`[data-href='${PAGE}']`).classList.add("active");
    }

    try {
        await populateNav();
        setRandomCSSColors(3);
        await populateContent();
    } catch (err) {
        console.error(err);
    }
}

function handleScroll() {
    if (window.scrollY < 15) {
        unstackMenu();
    } else {
        stackMenu();
    }
}

function handleNavLinkClick(e) {
    menu.classList.contains("stacked") ? unstackMenu() : togglePages(e);
}

async function fetchSnippetData() {
    let data = await fetch(`src/snippets/content-${LANG}.json`);
    return await data.json();
}

async function fetchMDData(slug) {
    if (slug === "") return "";
    let data = await fetch(`https://raw.githubusercontent.com/schnavy/openbooksociety/main/pages/${slug}-${LANG}.md`);
    let text = await data.text();
    let html = MarkdownToHtml.parse(text);
    return html.replaceAll(/\\/g, "<br/>");
}

function toggleLanguage() {
    LANG = LANG === "de" ? "en" : "de";
    localStorage.setItem("lang", LANG);
    populateNav().catch(err => console.error(err));
    populateContent().catch(err => console.error(err));
}

function togglePages(e) {
    if (!e.target.classList.contains("link")) return;

    PAGE = e.target.getAttribute("data-href");
    navLinks.forEach((elem, i) => {
        if (elem === e.target)
            r.style.setProperty("--link-color", getComputedStyle(r).getPropertyValue(`--${i}`));
        elem.classList.remove("active");
    });

    document.body.className = PAGE;
    e.target.classList.add("active");
    populateContent().catch(err => console.error(err));
    window.scrollTo(0, 0);
}

function unstackMenu() {
    menu.classList.remove("stacked");
}

function stackMenu() {
    menu.classList.add("stacked");
}

async function populateNav() {
    let data = await fetchSnippetData();
    setContentOfID("#header-text-container", data.general.header);
    setContentOfID("#header-text-container-mobile", data.general.header);
    setContentOfID("#members-link", data.nav.members);
    setContentOfID("#join-link", data.nav.joinOrDonate);
    setContentOfID("#language-toggle-mobile", data.general.navLanguage);
    setContentOfID("#language-toggle-desktop", data.general.navLanguage);
    setContentOfID("#about-link", data.nav.about);
    setContentOfID("#imprint-link", data.nav.imprint);
    setContentOfID("#privacy-link", data.nav.privacy);
}

async function populateContent() {
    let data = await fetchMDData(PAGE);
    setContentOfID("#text-content", data);
    document.querySelector("#text-content").classList = PAGE;
}

function setContentOfID(id, content) {
    document.querySelector(id).innerHTML = content !== undefined ? content : "";
}

function setRandomCSSColors(amount) {
    for (let i = 0; i < amount; i++) {
        r.style.setProperty(`--${i}`, get_random_color());
    }
}