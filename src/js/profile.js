import { initNav } from "./nav.js";
import { requireAuth, logout } from "./auth.js";
import { getMemberById } from "./data.js";

async function init() {
  const session = requireAuth();

  initNav("profile");

  const member = await getMemberById(session.id);
  if (member) renderProfile(member);
}

function renderProfile(member) {
  const fullName = `${member["First name"]} ${member["Family name"]}`;
  const initials = `${member["First name"][0]}${member["Family name"][0]}`.toUpperCase();

  document.getElementById("avatar").textContent = initials;
  document.getElementById("p-name").textContent = fullName;
  document.getElementById("p-id").textContent = `Member ID: ${member.ID}`;

  document.getElementById("d-name").textContent    = fullName;
  document.getElementById("d-email").textContent   = member["e-mail"] || "—";
  document.getElementById("d-phone").textContent   = member["Phone Number"] || "—";
  document.getElementById("d-id").textContent      = member["ID"] || "—";
  document.getElementById("d-national").textContent = member["National ID"] || "—";
  document.getElementById("d-address").textContent = member["Address"] || "—";
  document.getElementById("d-member").textContent = member["Member Since"] || "—";
}

window.addEventListener("DOMContentLoaded", init);
