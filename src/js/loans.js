import { requireAuth, logout } from "./auth.js";
import { getLoans, buildRepaymentSchedule } from "./data.js";
import { formatCurrency, formatDate } from "./utils.js";

async function init() {
  const session = requireAuth();

  const nameEl = document.getElementById("member-name");
  if (nameEl) nameEl.textContent = session.name;
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  const loans = await getLoans();
  const myLoan = loans.find((r) => r.ID === session.id);

  renderLoanInfo(myLoan);
  renderRepaymentSchedule(myLoan);
}

function renderLoanInfo(loan) {
  const container = document.getElementById("loan-info");

  if (!loan || !loan["Loan Amount"]) {
    container.innerHTML = `<p class="empty">No loan on record for your account.</p>`;
    return;
  }

  const statusColor =
    loan["Loan Status"] === "Approved"
      ? "green"
      : loan["Loan Status"] === "Rejected"
      ? "red"
      : "yellow";

  container.innerHTML = `
    <div class="loan-meta-grid">
      <div class="loan-meta__item">
        <p class="loan-meta__label">Loan Type</p>
        <p class="loan-meta__value">${loan["Loan Type"] || "—"}</p>
      </div>
      <div class="loan-meta__item">
        <p class="loan-meta__label">Status</p>
        <p class="loan-meta__value">
          <span class="badge badge--${statusColor}">${loan["Loan Status"] || "—"}</span>
        </p>
      </div>
      <div class="loan-meta__item">
        <p class="loan-meta__label">Loan Amount</p>
        <p class="loan-meta__value">${formatCurrency(loan["Loan Amount"])}</p>
      </div>
      <div class="loan-meta__item">
        <p class="loan-meta__label">Interest</p>
        <p class="loan-meta__value">${formatCurrency(loan["Interest on the loan"])}</p>
      </div>
      <div class="loan-meta__item">
        <p class="loan-meta__label">Installment Amount</p>
        <p class="loan-meta__value">${formatCurrency(loan["Installment Amount"])}</p>
      </div>
      <div class="loan-meta__item">
        <p class="loan-meta__label">Total Installments</p>
        <p class="loan-meta__value">${loan["Number of installments"] || "—"} months</p>
      </div>
      <div class="loan-meta__item">
        <p class="loan-meta__label">Start Date</p>
        <p class="loan-meta__value">${loan["Start Date"] || "—"}</p>
      </div>
      <div class="loan-meta__item">
        <p class="loan-meta__label">End Date</p>
        <p class="loan-meta__value">${loan["End Date"] || "—"}</p>
      </div>
      <div class="loan-meta__item">
        <p class="loan-meta__label">Paid Installments</p>
        <p class="loan-meta__value">${loan["Paid installment"] || 0} / ${loan["Number of installments"] || "—"}</p>
      </div>
      <div class="loan-meta__item">
        <p class="loan-meta__label">Total Covered</p>
        <p class="loan-meta__value">${formatCurrency(loan["Total covered "])}</p>
      </div>
      <div class="loan-meta__item">
        <p class="loan-meta__label">Remaining Balance</p>
        <p class="loan-meta__value">${formatCurrency(loan["Remaining Balance"])}</p>
      </div>
    </div>`;
}

function renderRepaymentSchedule(loan) {
  const container = document.getElementById("schedule-container");

  if (!loan || !loan["Loan Amount"]) {
    container.innerHTML = "";
    return;
  }

  const schedule = buildRepaymentSchedule(loan);

  if (schedule.length === 0) {
    container.innerHTML = `<p class="empty">Repayment schedule not available.</p>`;
    return;
  }

  const totalPaid = schedule
    .filter((s) => s.paid)
    .reduce((sum, s) => sum + s.amount, 0);

  const totalRemaining = schedule
    .filter((s) => !s.paid)
    .reduce((sum, s) => sum + s.amount, 0);

  const rows = schedule
    .map(
      (s) => `
      <tr>
        <td>${s.number}</td>
        <td>${formatDate(s.dueDate)}</td>
        <td>${formatCurrency(s.amount)}</td>
        <td>
          <span class="badge badge--${s.paid ? "green" : "red"}">
            ${s.paid ? "Paid" : "Unpaid"}
          </span>
        </td>
      </tr>`
    )
    .join("");

  container.innerHTML = `
    <div class="table-wrapper">
      <h2>Repayment Schedule</h2>
      <div class="schedule-summary">
        <span>Total Paid: <strong>${formatCurrency(totalPaid)}</strong></span>
        <span>Remaining: <strong>${formatCurrency(totalRemaining)}</strong></span>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Due Date (End of Month)</th>
            <th>Amount (RWF)</th>
            <th>Paid?</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

window.addEventListener("DOMContentLoaded", init);
