import { requireAuth, logout } from "./auth.js";
import { getBalance2024, getSavings2025, getWithdraws2025, getLoans, MONTHS_2025 } from "./data.js";
import { formatCurrency, formatDate } from "./utils.js";

async function init() {
  const session = requireAuth();

  document.getElementById("member-name").textContent = session.name;
  document.getElementById("logout-btn").addEventListener("click", logout);

  const [balance2024, savings2025, withdraws2025, loans] = await Promise.all([
    getBalance2024(),
    getSavings2025(),
    getWithdraws2025(),
    getLoans(),
  ]);

  const myBalance = balance2024.find((r) => r.ID === session.id);
  const mySavings = savings2025.find((r) => r.ID === session.id);
  const myWithdraws = withdraws2025.find((r) => r.ID === session.id);
  const myLoan = loans.find((r) => r.ID === session.id);

  renderSummaryCards(myBalance, mySavings, myWithdraws, myLoan);
  renderRecentActivity(mySavings, myWithdraws);
  renderLoanSummary(myLoan);
}

function renderSummaryCards(balance, savings, withdraws, loan) {
  const openingBalance = balance ? balance["Balance2024"] : 0;

  // Sum all 2025 deposits and withdrawals to get the current balance
  const totalDeposits = savings
    ? MONTHS_2025.reduce((sum, m) => sum + (savings[m] || 0), 0)
    : 0;
  const totalWithdraws = withdraws
    ? MONTHS_2025.reduce((sum, m) => sum + (withdraws[m] || 0), 0)
    : 0;

  const currentBalance = openingBalance + totalDeposits - totalWithdraws;

  const loanRemaining = loan && loan["Remaining Balance"] ? loan["Remaining Balance"] : 0;

  document.getElementById("card-balance").textContent = formatCurrency(currentBalance);
  document.getElementById("card-savings-2025").textContent = formatCurrency(totalDeposits);
  document.getElementById("card-loan").textContent = formatCurrency(loanRemaining);
  document.getElementById("card-opening").textContent = formatCurrency(openingBalance);
}

function renderRecentActivity(savings, withdraws) {
  const tbody = document.getElementById("recent-tbody");
  const rows = [];

  // Build a flat list of monthly transactions from both files
  MONTHS_2025.forEach((month) => {
    const deposit = savings ? savings[month] : null;
    const withdraw = withdraws ? withdraws[month] : null;

    if (deposit) {
      rows.push({ month, type: "deposit", amount: deposit });
    }
    if (withdraw) {
      rows.push({ month, type: "withdrawal", amount: withdraw });
    }
  });

  // Show only the 5 most recent, newest first
  const recent = rows.reverse().slice(0, 5);

  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="empty">No transactions recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = recent
    .map(
      (r) => `
      <tr>
        <td>${r.month}</td>
        <td><span class="badge badge--${r.type === "deposit" ? "green" : "red"}">${r.type}</span></td>
        <td>${formatCurrency(r.amount)}</td>
      </tr>`
    )
    .join("");
}

function renderLoanSummary(loan) {
  const container = document.getElementById("loan-summary");

  if (!loan || !loan["Loan Amount"]) {
    container.innerHTML = `<p class="empty">No loan on record.</p>`;
    return;
  }

  const statusColor = loan["Loan Status"] === "Approved" ? "green" : "yellow";

  container.innerHTML = `
    <div class="loan-row">
      <span>${formatCurrency(loan["Loan Amount"])} — ${loan["Loan Type"] || "Loan"}</span>
      <span class="badge badge--${statusColor}">${loan["Loan Status"] || "Pending"}</span>
    </div>
    <div class="loan-row">
      <span>Paid installments</span>
      <span>${loan["Paid installment"] || 0} / ${loan["Number of installments"] || "—"}</span>
    </div>
    <div class="loan-row">
      <span>Remaining balance</span>
      <span>${formatCurrency(loan["Remaining Balance"])}</span>
    </div>`;
}

window.addEventListener("DOMContentLoaded", init);
