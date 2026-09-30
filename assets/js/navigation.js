/* =========================================================
   STACKLY — navigation.js
   Mobile menu accessibility
   404 smart back navigation
   Previous page + section restoration
   ========================================================= */

(function () {

    "use strict";


    /* =========================================================
       HELPER
       ========================================================= */

    const $ = (selector, context = document) => {
        return context.querySelector(selector);
    };


    /* =========================================================
       MOBILE MENU — ESC TO CLOSE
       ========================================================= */

    window.addEventListener("keydown", function (e) {

        const mobileMenu = $(".mobile-menu");

        if (
            e.key === "Escape" &&
            mobileMenu &&
            mobileMenu.classList.contains("open")
        ) {

            const burger = $(".burger");

            if (burger) {
                burger.click();
            }

        }

    });


    /* =========================================================
       MOBILE MENU — ACCESSIBILITY
       ========================================================= */

    const burger = $(".burger");
    const mobileMenu = $(".mobile-menu");


    if (burger && mobileMenu) {

        const menuObserver = new MutationObserver(function () {

            if (mobileMenu.classList.contains("open")) {

                /*
                 * Return focus to the burger when
                 * the mobile menu opens.
                 */
                burger.focus();

            }

        });


        menuObserver.observe(mobileMenu, {
            attributes: true,
            attributeFilter: ["class"]
        });

    }


    /* =========================================================
       404 — SAVE CURRENT PAGE
       =========================================================
       
       Call this function whenever a link/action sends
       the user to 404.html.

       Example:

       save404PreviousPage();
       window.location.href = "404.html";

       The complete URL is saved, including:

       index.html#services
       service.html#pricing
       about.html#team
       blog.html#latest
       
       ========================================================= */

    window.save404PreviousPage = function () {

        try {

            const currentURL = window.location.href;

            /*
             * Don't save 404 itself.
             */
            if (
                currentURL &&
                !currentURL.includes("/404.html")
            ) {

                sessionStorage.setItem(
                    "404PreviousPage",
                    currentURL
                );

            }

        } catch (error) {

            console.warn(
                "Stackly: Unable to save 404 previous page.",
                error
            );

        }

    };


    /* =========================================================
       404 — SMART GO BACK
       ========================================================= */

    const back404 = $("[data-back]");


    if (back404 && back404.dataset.stacklyBackBound !== "true") {

        back404.dataset.stacklyBackBound = "true";

        back404.addEventListener("click", function (event) {

            event.preventDefault();

            if (back404.dataset.processing === "true") {
                return;
            }

            back404.dataset.processing = "true";

            if (window.history.length > 1) {
                window.history.back();
                return;
            }

            let previousPage = null;

            try {

                previousPage = sessionStorage.getItem("404PreviousPage");

            } catch (error) {

                console.warn(
                    "Stackly: Unable to read 404 previous page.",
                    error
                );

            }

            if (previousPage) {

                try {

                    sessionStorage.removeItem("404PreviousPage");

                } catch (error) {

                    console.warn(
                        "Stackly: Unable to clear 404 history.",
                        error
                    );

                }

                window.location.href = previousPage;

                return;

            }

            const referrer = document.referrer || "";

            if (
                referrer &&
                !referrer.includes("/404.html")
            ) {

                window.location.href = referrer;

                return;

            }

            window.location.href = "index.html";

        });

    }


    /* =========================================================
       PAGE RESTORATION
       =========================================================
       
       This runs when the browser restores a page using
       back/forward navigation.

       Useful for:
       - Fixed headers
       - Scroll state
       - Hash sections
       - Mobile navigation
       
       ========================================================= */

    function refreshNavigationState() {

        /*
         * Dispatch a custom event.
         *
         * Your main.js/header code can listen to this if needed.
         */
        window.dispatchEvent(
            new CustomEvent("stackly:navigation-restored")
        );

    }


    window.addEventListener(
        "pageshow",
        function () {

            /*
             * Wait for browser scroll restoration.
             */
            setTimeout(
                refreshNavigationState,
                50
            );


            setTimeout(
                refreshNavigationState,
                300
            );


            setTimeout(
                refreshNavigationState,
                700
            );

        }
    );


    /* =========================================================
       HASH CHANGE
       ========================================================= */

    window.addEventListener(
        "hashchange",
        function () {

            refreshNavigationState();

        }
    );


})();