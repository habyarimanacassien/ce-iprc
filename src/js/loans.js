import { initNav } from "./nav.js";
import { requireAuth, logout } from "./auth.js";
import { getLoans, buildRepaymentSchedule } from "./data.js";
import { formatCurrency, formatDate } from "./utils.js";
import { renderLoanChart } from "./charts.js";

async function init() {
  const session = requireAuth();
  initNav("loans");
  const nameEl = document.getElementById("member-name");
  if (nameEl) nameEl.textContent = session.name;
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  const loans  = await getLoans();
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
  const c = loan["Loan Status"] === "Approved" ? "green"
           : loan["Loan Status"] === "Rejected" ? "red" : "yellow";
  container.innerHTML = `
    <div class="loan-meta-grid">
      <div class="loan-meta__item"><p class="loan-meta__label">Loan Type</p>
        <p class="loan-meta__value">${loan["Loan Type"] || "—"}</p></div>
      <div class="loan-meta__item"><p class="loan-meta__label">Status</p>
        <p class="loan-meta__value"><span class="badge badge--${c}">${loan["Loan Status"] || "—"}</span></p></div>
      <div class="loan-meta__item"><p class="loan-meta__label">Loan Amount</p>
        <p class="loan-meta__value">${formatCurrency(loan["Loan Amount"])}</p></div>
      <div class="loan-meta__item"><p class="loan-meta__label">Interest</p>
        <p class="loan-meta__value">${formatCurrency(loan["Interest on the loan"])}</p></div>
      <div class="loan-meta__item"><p class="loan-meta__label">Installment Amount</p>
        <p class="loan-meta__value">${formatCurrency(loan["Installment Amount"])}</p></div>
      <div class="loan-meta__item"><p class="loan-meta__label">Total Installments</p>
        <p class="loan-meta__value">${loan["Number of installments"] || "—"} months</p></div>
      <div class="loan-meta__item"><p class="loan-meta__label">Start Date</p>
        <p class="loan-meta__value">${loan["Start Date"] || "—"}</p></div>
      <div class="loan-meta__item"><p class="loan-meta__label">End Date</p>
        <p class="loan-meta__value">${loan["End Date"] || "—"}</p></div>
      <div class="loan-meta__item"><p class="loan-meta__label">Paid Installments</p>
        <p class="loan-meta__value">${loan["Paid installment"] || 0} / ${loan["Number of installments"] || "—"}</p></div>
      <div class="loan-meta__item"><p class="loan-meta__label">Total Covered</p>
        <p class="loan-meta__value">${formatCurrency(loan["Total covered "])}</p></div>
      <div class="loan-meta__item"><p class="loan-meta__label">Remaining Balance</p>
        <p class="loan-meta__value">${formatCurrency(loan["Remaining Balance"])}</p></div>
    </div>`;
}

function renderRepaymentSchedule(loan) {
  const container = document.getElementById("schedule-container");
  if (!loan || !loan["Loan Amount"]) { container.innerHTML = ""; return; }

  const schedule = buildRepaymentSchedule(loan);

  if (schedule.length === 0) {
    container.innerHTML = `<p class="empty">Repayment schedule data is incomplete — please check loan start date.</p>`;
    return;
  }

  // --------- Summary figures ---------
  const totalPaid      = schedule.filter(s => s.paid).reduce((sum, s) => sum + s.installmentAmt, 0);
  const totalRemaining = schedule.filter(s => !s.paid).reduce((sum, s) => sum + s.installmentAmt, 0);
  const nextUnpaid     = schedule.find(s => !s.paid);

  // --- Table rows: Date | Status | Paid Amount | Remaining Balance ---
  const rows = schedule.map(s => `
    <tr class="${s.paid ? "row--paid" : "row--unpaid"}">
      <td>${formatDate(s.dueDate)}</td>
      <td><span class="badge badge--${s.paid ? "green" : "red"}">${s.paid ? "Paid" : "Unpaid"}</span></td>
      <td class="${s.paid ? "" : "text-muted"}">${s.paidAmt !== null ? formatCurrency(s.paidAmt) : "—"}</td>
      <td>${formatCurrency(s.remainingBalance)}</td>
    </tr>`).join("");

  container.innerHTML = `
    <div class="table-wrapper">
      <h2>Repayment Schedule</h2>
      <div class="schedule-summary">
        <span>Total Paid: <strong>${formatCurrency(totalPaid)}</strong></span>
        <span>Remaining: <strong>${formatCurrency(totalRemaining)}</strong></span>
        ${nextUnpaid
          ? `<span>Next Due: <strong>${formatDate(nextUnpaid.dueDate)}</strong></span>`
          : `<span class="badge badge--green" style="padding:0.3rem 0.8rem">Fully Paid ✓</span>`}
      </div>
      <table>
        <thead>
          <tr>
            <th>Date (End of Month)</th>
            <th>Status</th>
            <th>Paid Amount (RWF)</th>
            <th>Remaining Balance (RWF)</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <div class="chart-box">
      <h2>Repayment Progress Chart</h2>
      <div class="chart-legend">
        <span class="chart-legend__dot chart-legend__dot--green"></span> Paid &nbsp;
        <span class="chart-legend__dot chart-legend__dot--red"></span> Unpaid
      </div>
      <canvas id="loan-chart" height="110"></canvas>
    </div>`;

  // charts.js expects objects with .paid and .amount properties
  const chartSchedule = schedule.map(s => ({ ...s, amount: s.installmentAmt }));
  renderLoanChart("loan-chart", chartSchedule);
}

window.addEventListener("DOMContentLoaded", init);
