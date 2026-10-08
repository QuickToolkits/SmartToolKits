/* =========================================================
   F2CONVERT — JAVASCRIPT PART 1
   TOOL FILTER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const filterButtons = document.querySelectorAll(
        ".tool-filter-button"
    );

    const toolCards = document.querySelectorAll(
        ".tools-grid .tool-card"
    );


    /* ---------------------------------------------------------
       SAFETY CHECK
    --------------------------------------------------------- */

    if (!filterButtons.length || !toolCards.length) {
        return;
    }


    /* ---------------------------------------------------------
       FILTER FUNCTION
    --------------------------------------------------------- */

    function filterTools(selectedCategory) {

        toolCards.forEach((card) => {

            const cardCategory =
                card.getAttribute("data-category");


            if (
                selectedCategory === "all" ||
                cardCategory === selectedCategory
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    }


    /* ---------------------------------------------------------
       BUTTON CLICK
    --------------------------------------------------------- */

    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const selectedCategory =
                button.getAttribute("data-filter");


            /* Remove active state */

            filterButtons.forEach((item) => {

                item.classList.remove("active");
                item.setAttribute("aria-pressed", "false");

            });


            /* Add active state */

            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");


            /* Filter cards */

            filterTools(selectedCategory);

        });

    });


    /* ---------------------------------------------------------
       INITIAL STATE
       All tools visible
    --------------------------------------------------------- */

    filterTools("all");


    /* Mark All Tools as active */

    filterButtons.forEach((button) => {

        const category =
            button.getAttribute("data-filter");

        button.setAttribute(
            "aria-pressed",
            category === "all" ? "true" : "false"
        );

    });

});
/* =========================================================
   F2CONVERT — JAVASCRIPT PART 2
   MOBILE MENU
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle =
        document.querySelector(".mobile-menu-toggle");

    const menuOverlay =
        document.querySelector(".mobile-menu-overlay");

    const menuClose =
        document.querySelector(".mobile-menu-close");

    const menuLinks =
        document.querySelectorAll(
            ".mobile-menu-panel a"
        );


    /* ---------------------------------------------------------
       SAFETY CHECK
    --------------------------------------------------------- */

    if (
        !menuToggle ||
        !menuOverlay ||
        !menuClose
    ) {
        return;
    }


    /* ---------------------------------------------------------
       OPEN MENU
    --------------------------------------------------------- */

    function openMenu() {

        menuOverlay.classList.add("active");

        menuOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Close menu"
        );

        document.body.style.overflow = "hidden";

    }


    /* ---------------------------------------------------------
       CLOSE MENU
    --------------------------------------------------------- */

    function closeMenu() {

        menuOverlay.classList.remove("active");

        menuOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open menu"
        );

        document.body.style.overflow = "";

    }


    /* ---------------------------------------------------------
       TOGGLE MENU
    --------------------------------------------------------- */

    menuToggle.addEventListener("click", () => {

        const isOpen =
            menuOverlay.classList.contains("active");

        if (isOpen) {

            closeMenu();

        } else {

            openMenu();

        }

    });


    /* ---------------------------------------------------------
       CLOSE BUTTON
    --------------------------------------------------------- */

    menuClose.addEventListener("click", () => {

        closeMenu();

    });


    /* ---------------------------------------------------------
       CLOSE WHEN CLICKING OUTSIDE PANEL
    --------------------------------------------------------- */

    menuOverlay.addEventListener("click", (event) => {

        if (event.target === menuOverlay) {

            closeMenu();

        }

    });


    /* ---------------------------------------------------------
       CLOSE AFTER CLICKING A MENU LINK
    --------------------------------------------------------- */

    menuLinks.forEach((link) => {

        link.addEventListener("click", () => {

            closeMenu();

        });

    });


    /* ---------------------------------------------------------
       CLOSE WITH ESCAPE KEY
    --------------------------------------------------------- */

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            menuOverlay.classList.contains("active")
        ) {

            closeMenu();

        }

    });

});
/* =========================================================
   F2CONVERT — JAVASCRIPT PART 3
   HEADER SCROLL EFFECT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const header =
        document.querySelector(".site-header");


    /* ---------------------------------------------------------
       SAFETY CHECK
    --------------------------------------------------------- */

    if (!header) {
        return;
    }


    /* ---------------------------------------------------------
       HEADER SCROLL FUNCTION
    --------------------------------------------------------- */

    function updateHeader() {

        if (window.scrollY > 30) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }


    /* ---------------------------------------------------------
       SCROLL EVENT
    --------------------------------------------------------- */

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* ---------------------------------------------------------
       INITIAL CHECK
    --------------------------------------------------------- */

    updateHeader();

});
/* =========================================================
   F2CONVERT — JAVASCRIPT PART 4
   SMOOTH SCROLLING
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const navigationLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    if (!navigationLinks.length) {
        return;
    }

    navigationLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

});
/* =========================================================
   F2CONVERT — JAVASCRIPT PART 5
   ACTIVE NAVIGATION LINK
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const navLinks =
        document.querySelectorAll(
            '.main-nav .nav-link[href^="#"]'
        );

    if (!navLinks.length) {
        return;
    }

    function updateActiveLink() {

        const scrollPosition =
            window.scrollY + 180;

        navLinks.forEach((link) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const section =
                document.querySelector(targetId);

            if (!section) {
                return;
            }

            const sectionTop =
                section.offsetTop;

            const sectionBottom =
                sectionTop + section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {
                navLinks.forEach((item) => {
                    item.classList.remove("active");
                });

                link.classList.add("active");
            }

        });

    }

    window.addEventListener(
        "scroll",
        updateActiveLink,
        { passive: true }
    );

    updateActiveLink();

});
/* =========================================================
   F2CONVERT — JAVASCRIPT PART 6
   BACK TO TOP BUTTON
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const backToTop = document.createElement("button");

    backToTop.type = "button";
    backToTop.className = "back-to-top";
    backToTop.setAttribute(
        "aria-label",
        "Back to top"
    );
    backToTop.innerHTML = "↑";

    document.body.appendChild(backToTop);

    function updateBackToTop() {

        if (window.scrollY > 500) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }

    }

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    window.addEventListener(
        "scroll",
        updateBackToTop,
        { passive: true }
    );

    updateBackToTop();

});
/* =========================================================
   F2CONVERT — JAVASCRIPT PART 7
   TOOL CARD INTERACTION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const toolCards =
        document.querySelectorAll(".tool-card");

    if (!toolCards.length) {
        return;
    }

    toolCards.forEach((card) => {

        card.addEventListener("click", (event) => {

            /*
             * Agar card ke andar actual link par click hua hai,
             * browser ko normal navigation karne do.
             */
            const link =
                event.target.closest("a");

            if (link) {
                return;
            }

            /*
             * Agar card khud clickable hai aur usme link hai,
             * to us link par navigate karo.
             */
            const cardLink =
                card.querySelector("a");

            if (cardLink) {
                cardLink.click();
            }

        });

    });

});
/* =========================================================
   F2CONVERT — JAVASCRIPT PART 8
   FOOTER TOOL LINKS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const footerLinks = {
        "Image Compressor":
            "Image/Image-compressor/image-compressor.html",

        "Image Converter":
            "Image/image-conversion/image-converter.html",

        "Image Resizer":
            "Image/image-resizer/image-resizer.html",

        "Image Cropper":
            "Image/image-cropper/image-cropper.html",

        "Image to PDF":
            "pdf/image-to-pdf/image-to-pdf.html",

        "Merge PDF":
            "pdf/Pdf-Merge/pdf-merge.html",

        "Split PDF":
            "pdf/pdf-split/pdf-split.html",

        "PDF to Image":
            "pdf/Pdf-to-image/pdf-to-image.html"
    };

    const links =
        document.querySelectorAll(
            ".site-footer a"
        );

    links.forEach((link) => {

        const text =
            link.textContent.trim();

        if (footerLinks[text]) {
            link.setAttribute(
                "href",
                footerLinks[text]
            );
        }

    });

});
/* =========================================================
   F2CONVERT — JAVASCRIPT PART 9
   FAQ ACCORDION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const faqItems =
        document.querySelectorAll(".faq-item");

    if (!faqItems.length) {
        return;
    }

    faqItems.forEach((item) => {

        item.addEventListener("toggle", () => {

            if (!item.open) {
                return;
            }

            faqItems.forEach((otherItem) => {

                if (otherItem !== item) {
                    otherItem.open = false;
                }

            });

        });

    });

});
/* =========================================================
   F2CONVERT — JAVASCRIPT PART 10
   FAQ ICON STATE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const faqItems =
        document.querySelectorAll(".faq-item");

    if (!faqItems.length) {
        return;
    }

    faqItems.forEach((item) => {

        const icon =
            item.querySelector("summary i");

        if (!icon) {
            return;
        }

        function updateIcon() {

            if (item.open) {

                icon.classList.remove(
                    "fa-plus"
                );

                icon.classList.add(
                    "fa-minus"
                );

            } else {

                icon.classList.remove(
                    "fa-minus"
                );

                icon.classList.add(
                    "fa-plus"
                );

            }

        }

        item.addEventListener(
            "toggle",
            updateIcon
        );

        updateIcon();

    });

});