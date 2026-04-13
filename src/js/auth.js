import { getProfiles } from "./data.js";

const SESSION_KEY = "ce-session";
const DEFAULT_PASSWORD = "ceiprc@2026!";

// Read the current session
export function getSession() {
  return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
}

// Remove the session and redirect to the login page
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = "/index.html";
}

// Redirect to login if no session exists
export function requireAuth() {
  const session = getSession();
  if (!session) window.location.href = "/index.html";
  return session;
}

// Match email against the profile list and check the default password
export async function login(email, password) {
  if (password !== DEFAULT_PASSWORD) {
    return { success: false, message: "Invalid email or password." };
  }

  const profiles = await getProfiles();
  const profile = profiles.find(
    (p) => p["e-mail"] && p["e-mail"].toLowerCase() === email.toLowerCase()
  );

  if (!profile) {
    return { success: false, message: "Invalid email or password." };
  }

  // Store only what the app needs — never store the password
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

// Wire up the login form on index.html
export function initLoginPage() {
  if (getSession()) {
    window.location.href = "/dashboard.html";
    return;
  }

  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const result = await login(email, password);

    if (result.success) {
      window.location.href = "/dashboard.html";
    } else {
      errorEl.textContent = result.message;
      errorEl.classList.remove("hidden");
    }
  });
}
