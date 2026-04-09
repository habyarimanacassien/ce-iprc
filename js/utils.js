// ============================================================
// utils.js — CE-IPRC Utility Functions
// Currency formatting, date helpers, and input validation
// ============================================================

// ---------- Currency ----------

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ---------- Date helpers ----------

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

// ---------- Validation ----------

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRequired(value) {
  return value.trim().length > 0;
}

// ---------- DOM helpers ----------

export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsAll(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

// ---------- Render helpers ----------

export function renderListWithTemplate(templateFn, parentEl, list, clear = true) {
  if (clear) parentEl.innerHTML = "";
  list.forEach((item) => {
    parentEl.insertAdjacentHTML("beforeend", templateFn(item));
  });
}

// ---------- Alert banner ----------

export function showAlert(message, type = "error") {
  const existing = document.querySelector(".ce-alert");
  if (existing) existing.remove();

  const alert = document.createElement("div");
  alert.className = `ce-alert ce-alert--${type}`;
  alert.innerHTML = `<p>${message}</p><span class="ce-alert__close">✕</span>`;
  alert.querySelector(".ce-alert__close").addEventListener("click", () => alert.remove());

  document.querySelector("main").prepend(alert);
  window.scrollTo(0, 0);
}
