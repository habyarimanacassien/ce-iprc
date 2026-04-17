// ============================================================
// nav.js — CE-IPRC Navigation Module
// ============================================================

import { logout } from "./auth.js";

const NAV_LINKS = [
  { href: "./dashboard.html", label: "Dashboard", key: "dashboard" },
  { href: "./savings.html",   label: "Savings",   key: "savings"   },
  { href: "./loans.html",     label: "Loans",     key: "loans"     },
  { href: "./interest.html",  label: "Interest",  key: "interest"  },
  { href: "./profile.html",   label: "Profile",   key: "profile"   },
];

export function initNav(activePage = "") {
  // ------- Build and inject the header -------
  const container = document.getElementById("navbar-container");
  if (!container) return;

  const linkHTML = NAV_LINKS.map(
    (l) =>
      `<a href="${l.href}" class="${l.key === activePage ? "active" : ""}" ${
        l.key === activePage ? 'aria-current="page"' : ""
      }>${l.label}</a>`
  ).join("");

  container.innerHTML = `
    <header class="site-header">
      <a href="./dashboard.html" class="logo-circle" title="CE-IPRC — Go to Dashboard">
        <span>CE-IPRC</span>
      </a>

      <nav class="desktop-nav" aria-label="Main navigation">
        ${linkHTML}
      </nav>

      <div class="header-right">
        <button class="btn-logout" id="logout-btn">Logout</button>
        <button
          class="hamburger"
          id="hamburgerBtn"
          aria-label="Toggle navigation"
          aria-expanded="false"
          aria-controls="mobileMenu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>

    <nav
      class="mobile-nav"
      id="mobileMenu"
      aria-hidden="true"
      aria-label="Mobile navigation"
    >
      ${linkHTML}
      <button class="btn-logout btn-logout--mobile" id="mobile-logout-btn">
        Logout
      </button>
    </nav>
  `;

  // ---------------- Wire hamburger toggle ----------------
  const hamburger = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  });

  // Close when any nav link is clicked
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => closeMenu(hamburger, mobileMenu))
  );

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      closeMenu(hamburger, mobileMenu);
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu(hamburger, mobileMenu);
  });

  // ------------- Wire logout buttons -----------------
  document.getElementById("logout-btn").addEventListener("click", logout);
  document.getElementById("mobile-logout-btn").addEventListener("click", logout);
}

function closeMenu(hamburger, mobileMenu) {
  mobileMenu.classList.remove("open");
  hamburger.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
}
