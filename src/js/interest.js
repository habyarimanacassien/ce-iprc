import { initNav } from "./nav.js";
import { requireAuth, logout } from "./auth.js";
import { getInterests } from "./data.js";
import { formatCurrency } from "./utils.js";
import { renderInterestChart } from "./charts.js";
import "./notifications.js";

async function init() {
  const session = requireAuth();
  initNav("interest");
  const nameEl = document.getElementById("member-name");
  if (nameEl) nameEl.textContent = session.name;
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  const interests = await getInterests();
  const myRecord  = interests.find((r) => r.ID === session.id);
  renderInterest(myRecord);
}

function renderInterest(record) {
  const tbody   = document.getElementById("interest-tbody");
  const totalEl = document.getElementById("total-interest");

  if (!record) {
    if (totalEl) totalEl.textContent = "No interest records found.";
    tbody.innerHTML = `<tr><td colspan="2" class="empty">No data available.</td></tr>`;
    return;
  }

  const years = [
    { year: 2023, amount: record["Interest 2023"] },
    { year: 2024, amount: record["Interest 2024"] },
    { year: 2025, amount: record["Interest 2025"] },
  ].filter((y) => y.amount !== null && y.amount !== undefined);

  const total = years.reduce((sum, y) => sum + (y.amount || 0), 0);
  if (totalEl) totalEl.textContent = "Total Interest Earned: " + formatCurrency(total);

  if (years.length === 0) {
    tbody.innerHTML = `<tr><td colspan="2" class="empty">No interest records yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = years.map((y)=>`<tr><td>${y.year}</td><td>${formatCurrency(y.amount)}</td></tr>`).join("");
  renderInterestChart("interest-chart", years);
}

window.addEventListener("DOMContentLoaded", init);
