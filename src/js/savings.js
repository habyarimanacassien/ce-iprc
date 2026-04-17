import { initNav } from "./nav.js";
import { requireAuth, logout } from "./auth.js";
import { getBalance2024, getSavings2025, getWithdraws2025, MONTHS_2025 } from "./data.js";
import { formatCurrency } from "./utils.js";
import "./notifications.js";

async function init() {
  const session = requireAuth();

  initNav("savings");
  const nameEl = document.getElementById("member-name");
  if (nameEl) nameEl.textContent = session.name;

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  const [balance2024, savings2025, withdraws2025] = await Promise.all([
    getBalance2024(),
    getSavings2025(),
    getWithdraws2025(),
  ]);

  const myBalance = balance2024.find((r) => r.ID === session.id);
  const mySavings = savings2025.find((r) => r.ID === session.id);
  const myWithdraws = withdraws2025.find((r) => r.ID === session.id);

  renderTable(myBalance, mySavings, myWithdraws);
}

function renderTable(balance, savings, withdraws) {
  const tbody = document.getElementById("savings-tbody");
  const rows = [];

  let runningBalance = balance ? balance["Balance2024"] : 0;

  // Opening balance row
  rows.push({
    month: "Balance 2024",
    deposit: null,
    withdrawal: null,
    balance: runningBalance,
    isOpening: true,
  });

  // One row per month tracked in the 2025 files
  MONTHS_2025.forEach((month) => {
    const deposit = savings ? (savings[month] || null) : null;
    const withdrawal = withdraws ? (withdraws[month] || null) : null;

    runningBalance += (deposit || 0) - (withdrawal || 0);

    rows.push({ month, deposit, withdrawal, balance: runningBalance });
  });

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty">No records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows
    .map((r) => {
      if (r.isOpening) {
        return `
          <tr class="row--opening">
            <td><strong>${r.month}</strong></td>
            <td>—</td>
            <td>—</td>
            <td><strong>${formatCurrency(r.balance)}</strong></td>
          </tr>`;
      }
      return `
        <tr>
          <td>${r.month}</td>
          <td>${r.deposit ? formatCurrency(r.deposit) : "—"}</td>
          <td>${r.withdrawal ? formatCurrency(r.withdrawal) : "—"}</td>
          <td>${formatCurrency(r.balance)}</td>
        </tr>`;
    })
    .join("");
}

window.addEventListener("DOMContentLoaded", init);
