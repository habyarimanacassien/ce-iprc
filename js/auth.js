// ============================================================
// auth.js — CE-IPRC Authentication Module 
// Login / logout logic + session management via sessionStorage
// ============================================================

import { getMembers, seedDemoData } from "./data.js";

const SESSION_KEY = "ce-session";

// ---------- Session helpers ----------

export function getSession() {
  return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
}

export function setSession(member) {
  // Store only safe fields — never store passwords in session
  const { password, ...safeMember } = member;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeMember));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ---------- Auth guard ----------
// Call this at the top of any protected page.
// If no session → redirect to login page.

export function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = "/index.html";
  }
  return session;
}

// ---------- Login ----------

export function login(email, password) {
  const members = getMembers();
  const member = members.find(
    (m) => m.email === email && m.password === password
  );
  if (!member) return { success: false, message: "Invalid email or password." };
  setSession(member);
  return { success: true, member };
}

// ---------- Logout ----------

export function logout() {
  clearSession();
  window.location.href = "/index.html";
}

// ---------- Init login page ----------

export function initLoginPage() {
  // Seed demo data on first ever load
  seedDemoData();

  // If already logged in, skip login page
  if (getSession()) {
    window.location.href = "/dashboard.html";
    return;
  }

  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const result = login(email, password);

    if (result.success) {
      window.location.href = "/dashboard.html";
    } else {
      errorEl.textContent = result.message;
      errorEl.style.display = "block";
    }
  });
}
