/* =========================================================
   STACKLY — navigation.js

   Handles:
   - Mobile menu accessibility
   - ESC key
   - 404 previous page storage
   - Navigation restoration after Back / Forward
   ========================================================= */

(function () {

    "use strict";


    /* =========================================================
       HELPERS
       ========================================================= */

    const $ = (selector, context = document) => {
        return context.querySelector(selector);
    };


    /* =========================================================
       MOBILE MENU — ESC
       ========================================================= */

    document.addEventListener("keydown", function (event) {

        if (event.key !== "Escape") {
            return;
        }

        const mobileMenu = $(".mobile-menu");
        const burger = $(".burger");

        if (
            mobileMenu &&
            mobileMenu.classList.contains("open") &&
            burger
        ) {

            burger.click();

        }

    });


    /* =========================================================
       MOBILE MENU ACCESSIBILITY
       ========================================================= */

    const burger = $(".burger");
    const mobileMenu = $(".mobile-menu");


    if (burger && mobileMenu) {

        const menuObserver =
            new MutationObserver(function () {

                if (
                    mobileMenu.classList.contains("open")
                ) {

                    /*
                     * Keep focus accessible.
                     */
                    burger.focus();

                }

            });


        menuObserver.observe(
            mobileMenu,
            {
                attributes: true,
                attributeFilter: ["class"]
            }
        );

    }


    /* =========================================================
       404 — SAVE PREVIOUS PAGE
       ========================================================= */

    window.save404PreviousPage = function () {

        try {

            const currentURL =
                window.location.href;


            /*
             * Never save 404.html itself.
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
                "Stackly: Could not save previous page.",
                error
            );

        }

    };


    /* =========================================================
       RESTORE NAVIGATION STATE
       ========================================================= */

    function restoreNavigationState() {

        const nav = $(".nav");

        if (!nav) {
            return;
        }


        /*
         * IMPORTANT:
         *
         * We DO NOT change:
         *
         * position
         * top
         * transform
         * width
         *
         * because those are controlled by CSS.
         */


        const scrollY =
            window.scrollY ||
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            0;


        /*
         * Restore the same class that main.js uses.
         */
        if (scrollY > 40) {

            nav.classList.add("scrolled");

        } else {

            nav.classList.remove("scrolled");

        }


        /*
         * Tell other Stackly scripts that the
         * page has been restored.
         */
        window.dispatchEvent(
            new CustomEvent(
                "stackly:navigation-restored"
            )
        );

    }


    /* =========================================================
       PAGE SHOW
       
       Important for:

       Page → 404 → Back

       and browser BFCache restoration.
       ========================================================= */

    window.addEventListener(
        "pageshow",
        function () {

            /*
             * Restore immediately.
             */
            restoreNavigationState();


            /*
             * Browser may restore scroll position
             * shortly after pageshow.
             */
            setTimeout(
                restoreNavigationState,
                50
            );


            setTimeout(
                restoreNavigationState,
                250
            );


            setTimeout(
                restoreNavigationState,
                600
            );

        }
    );


    /* =========================================================
       HASH CHANGE
       ========================================================= */

    window.addEventListener(
        "hashchange",
        function () {

            setTimeout(
                restoreNavigationState,
                50
            );

        }
    );


    /* =========================================================
       INITIAL LOAD
       ========================================================= */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            restoreNavigationState,
            {
                once: true
            }
        );

    } else {

        restoreNavigationState();

    }


})();