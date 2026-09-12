/* =========================================
   SMARTTOOLKITS
   JAVASCRIPT PART 1 — MOBILE NAVIGATION
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNavigation = document.querySelector(".mobile-navigation");

    if (!menuToggle || !mobileNavigation) {
        return;
    }

    const mobileLinks = mobileNavigation.querySelectorAll("a");

    function openMobileMenu() {
        mobileNavigation.classList.add("active");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    }

    function closeMobileMenu() {
        mobileNavigation.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    function toggleMobileMenu() {
        const isOpen =
            mobileNavigation.classList.contains("active");

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    menuToggle.addEventListener(
        "click",
        toggleMobileMenu
    );

    mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

});
/* =========================================
   JAVASCRIPT PART 2 — ALL TOOLS FILTER
   ========================================= */

const filterButtons = document.querySelectorAll(
    ".filter-button"
);

const allToolCards = document.querySelectorAll(
    ".all-tool-card"
);

if (filterButtons.length && allToolCards.length) {

    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const selectedFilter =
                button.getAttribute("data-filter");

            /* Remove active state from all buttons */
            filterButtons.forEach((item) => {
                item.classList.remove("active");
            });

            /* Activate clicked button */
            button.classList.add("active");

            /* Filter tool cards */
            allToolCards.forEach((card) => {

                const category =
                    card.getAttribute("data-category");

                if (
                    selectedFilter === "all" ||
                    category === selectedFilter
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });

        });

    });

}
/* =========================================
   JAVASCRIPT PART 3 — NAVIGATION
   ========================================= */

const navigationLinks = document.querySelectorAll(
    ".main-navigation .nav-link"
);

const pageSections = document.querySelectorAll(
    "main section[id]"
);

if (navigationLinks.length && pageSections.length) {

    function updateActiveNavigation() {

        const scrollPosition =
            window.scrollY + 140;

        let currentSection = "";

        pageSections.forEach((section) => {

            const sectionTop =
                section.offsetTop;

            const sectionBottom =
                sectionTop + section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {
                currentSection = section.getAttribute("id");
            }

        });

        navigationLinks.forEach((link) => {

            const linkTarget =
                link.getAttribute("href");

            if (
                linkTarget === `#${currentSection}`
            ) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }

        });
    }

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );

    updateActiveNavigation();
}
/* =========================================
   JAVASCRIPT PART 4 — MOBILE MENU OUTSIDE CLICK
   ========================================= */

const outsideClickMenuToggle =
    document.querySelector(".menu-toggle");

const outsideClickMobileNavigation =
    document.querySelector(".mobile-navigation");

if (
    outsideClickMenuToggle &&
    outsideClickMobileNavigation
) {
    document.addEventListener("click", (event) => {

        const clickedInsideMenu =
            outsideClickMobileNavigation.contains(event.target);

        const clickedMenuButton =
            outsideClickMenuToggle.contains(event.target);

        const menuIsOpen =
            outsideClickMobileNavigation.classList.contains("active");

        if (
            menuIsOpen &&
            !clickedInsideMenu &&
            !clickedMenuButton
        ) {
            outsideClickMobileNavigation.classList.remove("active");

            outsideClickMenuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            outsideClickMenuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
        }

    });
}
/* =========================================
   JAVASCRIPT PART 5 — ESCAPE KEY
   ========================================= */

const escapeMenuNavigation =
    document.querySelector(".mobile-navigation");

const escapeMenuToggle =
    document.querySelector(".menu-toggle");

if (escapeMenuNavigation && escapeMenuToggle) {

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            escapeMenuNavigation.classList.contains("active")
        ) {
            escapeMenuNavigation.classList.remove("active");

            escapeMenuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            escapeMenuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
        }

    });

}
/* =========================================
   JAVASCRIPT PART 6 — SMOOTH SCROLL
   ========================================= */

const smoothScrollLinks = document.querySelectorAll(
    'a[href^="#"]'
);

if (smoothScrollLinks.length) {

    smoothScrollLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const targetElement =
                document.querySelector(targetId);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

}
/* =========================================
   JAVASCRIPT PART 7 — HEADER SCROLL EFFECT
   ========================================= */

const siteHeader = document.querySelector(".site-header");

if (siteHeader) {

    function updateHeaderOnScroll() {

        if (window.scrollY > 20) {
            siteHeader.classList.add("scrolled");
        } else {
            siteHeader.classList.remove("scrolled");
        }

    }

    window.addEventListener(
        "scroll",
        updateHeaderOnScroll,
        { passive: true }
    );

    updateHeaderOnScroll();

}
/* =========================================
   JAVASCRIPT PART 8 — INTERACTION SAFETY
   ========================================= */

const interactiveCards = document.querySelectorAll(
    ".tool-card, .featured-tool-card, .all-tool-card"
);

if (interactiveCards.length) {

    interactiveCards.forEach((card) => {

        card.addEventListener("keydown", (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                const link = card.querySelector("a");

                if (link) {
                    event.preventDefault();
                    link.click();
                }
            }

        });

    });

}
/* =========================================
   JAVASCRIPT PART 9 — TOOL CARD FOCUS
   ========================================= */

const toolCardLinks = document.querySelectorAll(
    ".tool-card a, .featured-tool-card a, .all-tool-card a"
);

if (toolCardLinks.length) {

    toolCardLinks.forEach((link) => {

        link.addEventListener("focus", () => {

            const parentCard =
                link.closest(
                    ".tool-card, .featured-tool-card, .all-tool-card"
                );

            if (parentCard) {
                parentCard.classList.add("keyboard-focus");
            }

        });

        link.addEventListener("blur", () => {

            const parentCard =
                link.closest(
                    ".tool-card, .featured-tool-card, .all-tool-card"
                );

            if (parentCard) {
                parentCard.classList.remove("keyboard-focus");
            }

        });

    });

}
/* =========================================
   JAVASCRIPT PART 10 — IMAGE LOADING
   ========================================= */

const pageImages = document.querySelectorAll(
    "img"
);

if (pageImages.length) {

    pageImages.forEach((image) => {

        if (!image.hasAttribute("loading")) {
            image.setAttribute("loading", "lazy");
        }

        if (!image.hasAttribute("decoding")) {
            image.setAttribute("decoding", "async");
        }

    });

}
/* =========================================
   JAVASCRIPT PART 11 — FINAL SAFETY
   ========================================= */

window.addEventListener("error", (event) => {

    if (!event.target) {
        return;
    }

    if (event.target.tagName === "IMG") {
        event.target.classList.add("image-load-error");
    }

}, true);


/* Prevent empty links from jumping to the top */
document.querySelectorAll('a[href="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {
        event.preventDefault();
    });

});