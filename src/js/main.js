import {isTouchDevice, get_random_color} from "./utils.js"

// Initial Configuration
const r = document.querySelector(":root");
let LANG = localStorage.getItem("lang") || "en";
let PAGE = "";

const IS_PRODUCTION = window.location.hostname === "openbooksociety.de" || window.location.hostname === "www.openbooksociety.de";

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
        setRandomCSSColors(4);
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
    let url = !IS_PRODUCTION ? `src/snippets/content-${LANG}.json` : `https://raw.githubusercontent.com/schnavy/openbooksociety/main/src/snippets/content-${LANG}.json`
    console.log(url)
    let data = await fetch(url);
    return await data.json();
}

async function fetchMDData(slug) {
    if (slug === "") return "";
    let url = !IS_PRODUCTION ? `pages/${slug}-${LANG}.md` : `https://raw.githubusercontent.com/schnavy/openbooksociety/main/pages/${slug}-${LANG}.md`
    let data = await fetch(url);
    let text = await data.text();
    let html = MarkdownToHtml.parse(text);
    return html.replaceAll(/\\/g, "<br/>");
}

async function fetchHTMLData(slug) {
    if (slug === "") return "";
    let url = !IS_PRODUCTION ? `src/html/${slug}.html` : `https://raw.githubusercontent.com/schnavy/openbooksociety/main/src/html/${slug}.html`
    console.log(url)
    let data = await fetch(url);

    return await data.text();
}

function replaceTemplateVariables(template, snippets) {
    // Replace template variables like {{newsletter.description}} with actual snippet values
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
        if (path === 'LANG') {
            return LANG;
        }

        const keys = path.split('.');
        let value = snippets;

        for (const key of keys) {
            if (value && value[key] !== undefined) {
                value = value[key];
            } else {
                return match; // Return original if path doesn't exist
            }
        }

        return value;
    });
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
    let data;

    // Check if this is the newsletter page - load HTML template and replace variables
    if (PAGE === "newsletter") {
        const template = await fetchHTMLData(PAGE);
        const snippets = await fetchSnippetData();
        data = replaceTemplateVariables(template, snippets);

        // Set content first
        setContentOfID("#text-content", data);
        document.querySelector("#text-content").classList = PAGE;

        // Then initialize newsletter form scripts
        initializeNewsletterForm(snippets);
    } else {
        data = await fetchMDData(PAGE);
        setContentOfID("#text-content", data);
        document.querySelector("#text-content").classList = PAGE;
    }
}

function initializeNewsletterForm(snippets) {
    // Set up newsletter form JavaScript variables
    window.REQUIRED_CODE_ERROR_MESSAGE = snippets.newsletter.codeErrorMessage;
    window.LOCALE = LANG;
    window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = snippets.newsletter.emailInvalidMessage;
    window.REQUIRED_ERROR_MESSAGE = snippets.newsletter.requiredErrorMessage;
    window.GENERIC_INVALID_MESSAGE = snippets.newsletter.genericInvalidMessage;

    window.translation = {
        common: {
            selectedList: '{quantity} Liste ausgewählt',
            selectedLists: '{quantity} Listen ausgewählt',
            selectedOption: '{quantity} ausgewählt',
            selectedOptions: '{quantity} ausgewählt',
        }
    };

    window.AUTOHIDE = Boolean(0);

    // Load the Brevo form script dynamically
    if (!document.querySelector('script[src*="sibforms.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://sibforms.com/forms/end-form/build/main.js';
        script.defer = true;
        document.head.appendChild(script);
    }

    // Show form immediately since DOM is already ready
    setTimeout(() => {
        const form = document.querySelector('.sib-form');
        if (form) {
            form.style.opacity = '1';
        }
    }, 100);
}

function setContentOfID(id, content) {
    document.querySelector(id).innerHTML = content !== undefined ? content : "";
}

function setRandomCSSColors(amount) {
    for (let i = 0; i < amount; i++) {
        r.style.setProperty(`--${i}`, get_random_color());
    }
}