// ============================================================
// auth.js — CE-IPRC Authentication
// Login / logout + session management via sessionStorage
// ============================================================

import { getProfiles } from "./data.js";

const SESSION_KEY = "ce-session";
const DEFAULT_PASSWORD = "ceiprc@2026!";

// ---------- Session helpers ----------

export function getSession() {
  return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ---------- Auth guard ----------
// Call at top of every protected page.
// If no session → redirect to login.
export function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = "./index.html";
  }
  return session;
}

// ---------- Logout ----------
export function logout() {
  clearSession();
  window.location.href = "./index.html";
}

// ---------- Login ----------
export async function login(email, password) {
  if (password !== DEFAULT_PASSWORD) {
    return { success: false, message: "Invalid email or password." };
  }

  const profiles = await getProfiles();
  const profile = profiles.find(
    (p) => p["e-mail"] && p["e-mail"].toLowerCase() === email.toLowerCase()
  );

  if (!profile) {
    return { success: false, message: "No account found with that email." };
  }

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      id: profile.ID,
      name: `${profile["First name"]} ${profile["Family name"]}`,
      email: profile["e-mail"],
      phone: profile["Phone Number"],
    })
  );

  return { success: true };
}

// ---------- Init login page ----------
export function initLoginPage() {
  // If already logged in, skip straight to dashboard
  if (getSession()) {
    window.location.href = "./dashboard.html";
    return;
  }

  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in…";

    const result = await login(email, password);

    if (result.success) {
      window.location.href = "./dashboard.html";
    } else {
      errorEl.textContent = result.message;
      errorEl.classList.remove("hidden");
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign In";
    }
  });
}
