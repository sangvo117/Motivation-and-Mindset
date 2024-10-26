/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
    "use strict";

    const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );

    const getStoredTheme = () => localStorage.getItem("theme");
    const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    };

    const setTheme = (theme) => {
        if (theme === "auto") {
            document.documentElement.setAttribute(
                "data-bs-theme",
                window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
            );
        } else {
            document.documentElement.setAttribute("data-bs-theme", theme);
        }
    };

    const showActiveTheme = (theme, focus = false) => {
        const themeSwitcher = document.querySelector("#bd-theme");

        if (!themeSwitcher) {
            return;
        }

        const themeSwitcherText = document.querySelector("#bd-theme-text");
        const activeThemeIcon = document.querySelector(".theme-icon-active use");
        const btnToActive = document.querySelector(
            `[data-bs-theme-value="${theme}"]`
        );
        const svgOfActiveBtn = btnToActive
            .querySelector("svg use")
            .getAttribute("href");

        document.querySelectorAll("[data-bs-theme-value]").forEach((element) => {
            element.classList.remove("active");
            element.setAttribute("aria-pressed", "false");
        });

        btnToActive.classList.add("active");
        btnToActive.setAttribute("aria-pressed", "true");
        activeThemeIcon.setAttribute("href", svgOfActiveBtn);
        const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
        themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);

        if (focus) {
            themeSwitcher.focus();
        }
    };

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
            const storedTheme = getStoredTheme();
            if (storedTheme !== "light" && storedTheme !== "dark") {
                setTheme(getPreferredTheme());
            }
        });

    window.addEventListener("DOMContentLoaded", () => {
        showActiveTheme(getPreferredTheme());

        document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
            toggle.addEventListener("click", () => {
                const theme = toggle.getAttribute("data-bs-theme-value");
                setStoredTheme(theme);
                setTheme(theme);
                showActiveTheme(theme, true);
            });
        });

        function updateListGroupClasses(divId) {
            let listGroupItems = document.querySelectorAll(".menu");

            listGroupItems.forEach((item) => {
                let targetId = item.getAttribute("data-bs-target").replace("#", "");

                item.classList.remove(
                    "list-group-item-primary",
                    "list-group-item-secondary"
                );

                if (targetId === divId) {
                    item.classList.add("list-group-item-primary");
                } else {
                    item.classList.add("list-group-item-secondary");
                }
            });
        }

        function updateListGroupClassesBasedOnVisibleDiv() {
            let divElement = document.querySelector(".accordion-collapse.show");
            if (divElement) {
                let divId = divElement.getAttribute("id");
                updateListGroupClasses(divId);
            } else {
                console.warn("No visible accordion div found.");
            }
        }

        updateListGroupClassesBasedOnVisibleDiv();

        document
            .querySelectorAll(".accordion-collapse")
            .forEach((collapseElement) => {
                collapseElement.addEventListener(
                    "shown.bs.collapse",
                    updateListGroupClassesBasedOnVisibleDiv
                );
            });

        document
            .querySelectorAll(".copy")
            .forEach(copyButton => {
                copyButton.addEventListener("click", () => {
                    const targetElement = document.querySelector(copyButton.dataset.copy);
                    const textToCopy = targetElement.textContent.trim();

                    navigator.clipboard.writeText(textToCopy).then(() => {
                        copyButton.classList.replace("btn-primary", "btn-outline-primary");
                        copyButton.setAttribute('data-bs-original-title', 'Copied!');

                        const icon = copyButton.querySelector("i");
                        if (icon) {
                            icon.classList.replace("bi-clipboard", "bi-clipboard-check");
                        }

                        setTimeout(() => {
                            copyButton.classList.replace("btn-outline-primary", "btn-primary");
                        }, 1000);
                    });
                })
            });
    });
})();
