// Shorthand for querySelector
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Format a number as Rwandan francs
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "RWF —";
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format a Date object to "31 Jan 2025"
export function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Show a dismissable alert banner at the top of <main>
export function showAlert(message, type = "error") {
  const existing = qs(".ce-alert");
  if (existing) existing.remove();

  const alert = document.createElement("div");
  alert.className = `ce-alert ce-alert--${type}`;
  alert.innerHTML = `<p>${message}</p><span class="ce-alert__close">✕</span>`;

  alert.querySelector(".ce-alert__close").addEventListener("click", () => alert.remove());

  qs("main").prepend(alert);
  window.scrollTo(0, 0);
}
