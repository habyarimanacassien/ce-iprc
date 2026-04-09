// ============================================================
// dashboard.js — CE-IPRC Member Dashboard
// Loads summary cards with static data from localStorage
// ============================================================

import { requireAuth, logout } from "./auth.js";
import { getSavings, getLoans } from "./data.js";
import { formatCurrency, formatDate } from "./utils.js";

function init() {
  // 1. Guard: redirect to login if not authenticated
  const member = requireAuth();

  // 2. Render member name in header
  document.getElementById("member-name").textContent = member.name;

  // 3. Wire up logout button
  document.getElementById("logout-btn").addEventListener("click", logout);

  // 4. Load data for this member
  const savings = getSavings(member.id);
  const loans = getLoans(member.id);

  // 5. Calculate summary figures
  const totalSavings = savings.length
    ? savings[savings.length - 1].balance
    : 0;

  const activeLoans = loans.filter((l) => l.status === "Approved");
  const loanBalance = activeLoans.reduce((sum, loan) => {
    const unpaidInstallments = loan.repaymentSchedule
      ? loan.repaymentSchedule.filter((r) => !r.paid)
      : [];
    const remaining = unpaidInstallments.reduce(
      (s, inst) => s + inst.amount,
      0
    );
    return sum + remaining;
  }, 0);

  // Withdraw balance = last savings balance minus loan balance (simplified)
  const withdrawBalance = Math.max(0, totalSavings * 0.8 - loanBalance);

  // 6. Render summary cards
  document.getElementById("card-savings").textContent = formatCurrency(totalSavings);
  document.getElementById("card-loan").textContent = formatCurrency(loanBalance);
  document.getElementById("card-withdraw").textContent = formatCurrency(withdrawBalance);
  document.getElementById("card-member-since").textContent = formatDate(member.joinDate);

  // 7. Render recent transactions table (last 5)
  const recent = [...savings].reverse().slice(0, 5);
  const tbody = document.getElementById("recent-tbody");
  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty">No transactions yet.</td></tr>`;
  } else {
    tbody.innerHTML = recent
      .map(
        (r) => `
      <tr>
        <td>${formatDate(r.date)}</td>
        <td><span class="badge badge--${r.type === "deposit" ? "green" : "red"}">${r.type}</span></td>
        <td>${formatCurrency(r.amount)}</td>
        <td>${formatCurrency(r.balance)}</td>
      </tr>`
      )
      .join("");
  }

  // 8. Render loan status summary
  const loanEl = document.getElementById("loan-summary");
  if (loans.length === 0) {
    loanEl.innerHTML = `<p class="empty">No loan applications found.</p>`;
  } else {
    loanEl.innerHTML = loans
      .map(
        (l) => `
      <div class="loan-row">
        <span>${formatCurrency(l.amount)} — Applied: ${formatDate(l.dateApplied)}</span>
        <span class="badge badge--${statusColor(l.status)}">${l.status}</span>
      </div>`
      )
      .join("");
  }
}

function statusColor(status) {
  if (status === "Approved") return "green";
  if (status === "Rejected") return "red";
  return "yellow";
}

window.addEventListener("DOMContentLoaded", init);
