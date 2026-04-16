// ============================================================
// navbar.js — CE-IPRC Shared Navigation Component
// ============================================================

function renderNavbar(activePage = "") {
  const links = [
    { href: "./dashboard.html", label: "Dashboard", key: "dashboard" },
    { href: "./savings.html",   label: "Savings",   key: "savings"   },
    { href: "./loans.html",     label: "Loans",     key: "loans"     },
    { href: "./interest.html",  label: "Interest",  key: "interest"  },
    { href: "./profile.html",   label: "Profile",   key: "profile"   },
  ];

  const linkHTML = links
    .map(
      (l) =>
        `<a href="${l.href}" class="${l.key === activePage ? "active" : ""}">${l.label}</a>`
    )
    .join("");

  return `
    <header class="site-header">
      <a href="./dashboard.html" class="logo-circle" title="Go to Dashboard">
        <span>CE</span>
      </a>

      <nav class="desktop-nav">
        ${linkHTML}
      </nav>

      <div class="header-right">
        <button class="btn-logout" id="logout-btn">Logout</button>
        <button class="hamburger" id="hamburgerBtn" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>

    <nav class="mobile-nav" id="mobileMenu" aria-hidden="true">
      ${linkHTML}
      <button class="btn-logout btn-logout--mobile" id="mobile-logout-btn">Logout</button>
    </nav>
  `;
}
