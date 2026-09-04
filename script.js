/* =========================================
   SMARTTOOLKITS — SCRIPT
   PART 1
   LOADER + MOBILE MENU
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       PAGE LOADER
    ========================================= */

    const pageLoader = document.getElementById("page-loader");

    if (pageLoader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                pageLoader.classList.add("hide");
            }, 450);
        });
    }


    /* =========================================
       MOBILE MENU
    ========================================= */

    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const mobileNav = document.querySelector(".mobile-nav");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

    if (mobileMenuBtn && mobileNav) {

        mobileMenuBtn.addEventListener("click", () => {
            const isOpen = mobileNav.classList.toggle("open");

            mobileMenuBtn.classList.toggle("open", isOpen);
            mobileMenuBtn.setAttribute("aria-expanded", isOpen);
        });


        /* Close menu after clicking a link */

        mobileNavLinks.forEach((link) => {
            link.addEventListener("click", () => {
                mobileNav.classList.remove("open");
                mobileMenuBtn.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            });
        });


        /* Close menu when clicking outside */

        document.addEventListener("click", (event) => {
            if (
                !mobileNav.contains(event.target) &&
                !mobileMenuBtn.contains(event.target)
            ) {
                mobileNav.classList.remove("open");
                mobileMenuBtn.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            }
        });

    }

});
    /* =========================================
       SMOOTH NAVIGATION
    ========================================= */

    const navLinks = document.querySelectorAll(
        '.nav-link[href^="#"], .mobile-nav-link[href^="#"]'
    );

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const navbar = document.querySelector(".navbar");
            const navbarHeight = navbar
                ? navbar.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });
    });


    /* =========================================
       ACTIVE NAVBAR LINK
    ========================================= */

    const desktopNavLinks = document.querySelectorAll(
        '.nav-link[href^="#"]'
    );

    const sections = document.querySelectorAll(
        "#home, #tools, #image-tools, #pdf-tools, #about"
    );

    const updateActiveNav = () => {

        let currentSection = "home";
        const scrollPosition = window.scrollY + 180;

        sections.forEach((section) => {

            if (scrollPosition >= section.offsetTop) {
                currentSection = section.id;
            }

        });

        desktopNavLinks.forEach((link) => {

            const isActive =
                link.getAttribute("href") === `#${currentSection}`;

            link.classList.toggle("active", isActive);

        });

    };

    window.addEventListener(
        "scroll",
        updateActiveNav,
        { passive: true }
    );

    updateActiveNav();
    /* =========================================
   TOOL SEARCH
========================================= */

const toolSearchInput = document.getElementById("tool-search");
const searchButton = document.getElementById("search-button");

const toolRoutes = {
    "image compressor": "Image/Image-compressor/image-compressor.html",
    "compress image": "Image/Image-compressor/image-compressor.html",

    "image converter": "Image/image-conversion/image-converter.html",
    "convert image": "Image/image-conversion/image-converter.html",

    "image cropper": "Image/image-cropper/image-cropper.html",
    "crop image": "Image/image-cropper/image-cropper.html",

    "image resizer": "Image/image-resizer/image-resizer.html",
    "resize image": "Image/image-resizer/image-resizer.html",

    "image to pdf": "pdf/image-to-pdf/image-to-pdf.html",

    "pdf merge": "pdf/Pdf-Merge/pdf-merge.html",
    "merge pdf": "pdf/Pdf-Merge/pdf-merge.html",

    "pdf rotate": "pdf/pdf-rotate/pdf-rotate.html",
    "rotate pdf": "pdf/pdf-rotate/pdf-rotate.html",

    "pdf split": "pdf/pdf-split/pdf-split.html",
    "split pdf": "pdf/pdf-split/pdf-split.html",

    "pdf to image": "pdf/Pdf-to-image/pdf-to-image.html",
    "convert pdf to image": "pdf/Pdf-to-image/pdf-to-image.html"
};


const searchTool = () => {

    if (!toolSearchInput) {
        return;
    }

    const query = toolSearchInput.value
        .trim()
        .toLowerCase();

    if (!query) {
        toolSearchInput.focus();
        return;
    }

    const exactMatch = toolRoutes[query];

    if (exactMatch) {
        window.location.href = exactMatch;
        return;
    }

    const matchingTool = Object.keys(toolRoutes).find((tool) =>
        tool.includes(query) || query.includes(tool)
    );

    if (matchingTool) {
        window.location.href = toolRoutes[matchingTool];
        return;
    }

    toolSearchInput.value = "";
    toolSearchInput.placeholder = "Tool not found — try another name";

    setTimeout(() => {
        toolSearchInput.placeholder = "Search for a tool...";
    }, 2200);
};


if (searchButton) {
    searchButton.addEventListener("click", searchTool);
}


if (toolSearchInput) {
    toolSearchInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {
            event.preventDefault();
            searchTool();
        }

    });
}
/* =========================================
   ALL TOOLS FILTER
========================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const allToolCards = document.querySelectorAll(".all-tool-card");

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        allToolCards.forEach((card) => {

            const cardCategory = card.dataset.category;

            if (
                selectedFilter === "all" ||
                cardCategory === selectedFilter
            ) {
                card.classList.remove("is-hidden");
            } else {
                card.classList.add("is-hidden");
            }

        });

    });

});
/* =========================================
   FAQ ACCORDION
========================================= */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {

    const question = item.querySelector(".faq-question");

    if (!question) {
        return;
    }

    question.addEventListener("click", () => {

        const isOpen =
            question.getAttribute("aria-expanded") === "true";


        /* Close all other FAQ items */

        faqItems.forEach((otherItem) => {

            const otherQuestion =
                otherItem.querySelector(".faq-question");

            if (otherItem !== item && otherQuestion) {
                otherItem.classList.remove("active");
                otherQuestion.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        });


        /* Toggle current FAQ */

        if (isOpen) {
            item.classList.remove("active");
            question.setAttribute(
                "aria-expanded",
                "false"
            );
        } else {
            item.classList.add("active");
            question.setAttribute(
                "aria-expanded",
                "true"
            );
        }

    });

});
/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(
    ".section-header, .featured-card, .tool-card, .all-tool-card, .feature-card, .stat-item, .cta-card, .faq-item"
);

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach((element) => {
        element.classList.add("revealed");
    });

}
/* =========================================
   FINAL PERFORMANCE + SAFETY
========================================= */

/* Prevent accidental form submission */

document.querySelectorAll("form").forEach((form) => {

    form.addEventListener("submit", (event) => {
        event.preventDefault();
    });

});


/* Keep animations lightweight while scrolling */

let scrollTicking = false;

window.addEventListener(
    "scroll",
    () => {

        if (!scrollTicking) {

            window.requestAnimationFrame(() => {
                scrollTicking = false;
            });

            scrollTicking = true;
        }

    },
    { passive: true }
);


/* Reset mobile menu when switching to desktop */

window.addEventListener("resize", () => {

    if (window.innerWidth > 850) {

        const mobileNav =
            document.querySelector(".mobile-nav");

        const mobileMenuBtn =
            document.querySelector(".mobile-menu-btn");

        if (mobileNav) {
            mobileNav.classList.remove("open");
        }

        if (mobileMenuBtn) {
            mobileMenuBtn.classList.remove("open");
            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );
        }

    }

});


/* =========================================
   PAGE READY
========================================= */

document.documentElement.classList.add("js-ready");