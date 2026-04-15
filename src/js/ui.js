// ============================================================
// ui.js — CE-IPRC UI Interactions
// Wires up hamburger toggle and mobile logout button.
// ============================================================

(function () {
  function initUI() {
    const hamburger = document.getElementById("hamburgerBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileLogout = document.getElementById("mobile-logout-btn");

    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = mobileMenu.classList.toggle("open");
        hamburger.classList.toggle("open", isOpen);
        hamburger.setAttribute("aria-expanded", String(isOpen));
        mobileMenu.setAttribute("aria-hidden", String(!isOpen));
      });

      // Close menu when a nav link is tapped
      mobileMenu.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          mobileMenu.classList.remove("open");
          hamburger.classList.remove("open");
          hamburger.setAttribute("aria-expanded", "false");
          mobileMenu.setAttribute("aria-hidden", "true");
        });
      });

      // Close on outside click
      document.addEventListener("click", (e) => {
        if (
          !hamburger.contains(e.target) &&
          !mobileMenu.contains(e.target)
        ) {
          mobileMenu.classList.remove("open");
          hamburger.classList.remove("open");
          hamburger.setAttribute("aria-expanded", "false");
          mobileMenu.setAttribute("aria-hidden", "true");
        }
      });
    }

    // Mobile logout button wires to the module logout
    if (mobileLogout) {
      mobileLogout.addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "./index.html";
      });
    }
  }

  // Run after DOM is ready (script loads after navbar injection)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUI);
  } else {
    initUI();
  }
})();
