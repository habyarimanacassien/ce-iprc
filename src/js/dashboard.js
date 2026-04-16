import { initNav } from "./nav.js";
import { requireAuth, logout } from "./auth.js";
import { getBalance2024, getSavings2025, getWithdraws2025, getLoans, MONTHS_2025 } from "./data.js";
import { formatCurrency } from "./utils.js";
import { renderSavingsChart } from "./charts.js";

async function init() {
  const session = requireAuth();
  initNav("dashboard");
  document.getElementById("member-name").textContent = session.name;
  document.getElementById("logout-btn").addEventListener("click", logout);

  const [balance2024, savings2025, withdraws2025, loans] = await Promise.all([
    getBalance2024(), getSavings2025(), getWithdraws2025(), getLoans(),
  ]);

  const myBalance  = balance2024.find((r) => r.ID === session.id);
  const mySavings  = savings2025.find((r) => r.ID === session.id);
  const myWithdraws = withdraws2025.find((r) => r.ID === session.id);
  const myLoan     = loans.find((r) => r.ID === session.id);

  renderSummaryCards(myBalance, mySavings, myWithdraws, myLoan);
  renderRecentActivity(mySavings, myWithdraws);
  renderLoanSummary(myLoan);

  const chartRows = buildChartRows(myBalance, mySavings, myWithdraws);
  renderSavingsChart("savings-chart", chartRows);
}

function buildChartRows(balance, savings, withdraws) {
  const rows = [];
  let running = balance ? balance["Balance2024"] : 0;
  rows.push({ month: "Bal 2024", balance: running });
  MONTHS_2025.forEach((month) => {
    running += (savings ? (savings[month] || 0) : 0) - (withdraws ? (withdraws[month] || 0) : 0);
    rows.push({ month, balance: running });
  });
  return rows;
}

function renderSummaryCards(balance, savings, withdraws, loan) {
  const opening = balance ? balance["Balance2024"] : 0;
  const deps = savings ? MONTHS_2025.reduce((s,m)=>s+(savings[m]||0),0) : 0;
  const withs = withdraws ? MONTHS_2025.reduce((s,m)=>s+(withdraws[m]||0),0) : 0;
  document.getElementById("card-balance").textContent = formatCurrency(opening + deps - withs);
  document.getElementById("card-savings-2025").textContent = formatCurrency(deps);
  document.getElementById("card-loan").textContent = formatCurrency(loan && loan["Remaining Balance"] ? loan["Remaining Balance"] : 0);
  document.getElementById("card-opening").textContent = formatCurrency(opening);
}

function renderRecentActivity(savings, withdraws) {
  const tbody = document.getElementById("recent-tbody");
  const rows = [];
  MONTHS_2025.forEach((month) => {
    if (savings && savings[month])   rows.push({ month, type: "deposit",    amount: savings[month] });
    if (withdraws && withdraws[month]) rows.push({ month, type: "withdrawal", amount: withdraws[month] });
  });
  const recent = rows.reverse().slice(0, 5);
  if (!recent.length) { tbody.innerHTML = `<tr><td colspan="3" class="empty">No transactions yet.</td></tr>`; return; }
  tbody.innerHTML = recent.map((r) =>
    `<tr><td>${r.month}</td><td><span class="badge badge--${r.type==="deposit"?"green":"red"}">${r.type}</span></td><td>${formatCurrency(r.amount)}</td></tr>`
  ).join("");
}

function renderLoanSummary(loan) {
  const container = document.getElementById("loan-summary");
  if (!loan || !loan["Loan Amount"]) { container.innerHTML=`<p class="empty">No loan on record.</p>`; return; }
  const c = loan["Loan Status"]==="Approved"?"green":loan["Loan Status"]==="Rejected"?"red":"yellow";
  container.innerHTML = `
    <div class="loan-row"><span>${formatCurrency(loan["Loan Amount"])} — ${loan["Loan Type"]||"Loan"}</span><span class="badge badge--${c}">${loan["Loan Status"]||"Pending"}</span></div>
    <div class="loan-row"><span>Paid installments</span><span>${loan["Paid installment"]||0} / ${loan["Number of installments"]||"—"}</span></div>
    <div class="loan-row"><span>Remaining balance</span><span>${formatCurrency(loan["Remaining Balance"])}</span></div>`;
}

window.addEventListener("DOMContentLoaded", init);
