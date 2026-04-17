// Fetch a JSON file from the public/json folder
async function fetchJson(filename) {
  const response = await fetch(`/json/${filename}`);
  if (!response.ok) throw new Error(`Could not load ${filename}`);
  return response.json();
}

// Load all member profiles
export async function getProfiles() {
  return fetchJson("ce-iprc-profile.json");
}

// Find one member by ID
export async function getMemberById(id) {
  const profiles = await getProfiles();
  return profiles.find((p) => p.ID === id) || null;
}

// Load the 2024 savings balances
export async function getBalance2024() {
  return fetchJson("ce-iprc-balance-2024.json");
}

// Load 2025 monthly savings deposits
export async function getSavings2025() {
  return fetchJson("ce-iprc--savings-2025.json");
}

// Load 2025 monthly withdrawals
export async function getWithdraws2025() {
  return fetchJson("ce-iprc-withdraws-2025.json");
}

// Load loan records
export async function getLoans() {
  return fetchJson("ce-iprc-loans.json");
}

// Load interest records
export async function getInterests() {
  return fetchJson("ce-iprc-interests.json");
}

// The months as recorded in the 2025 files, in order
export const MONTHS_2025 = [
  "Nov-24", "Dec-24",
  "Jan-25", "Feb-25", "Mar-25", "Apr-25",
  "May-25", "Jun-25", "Jul-25", "Aug-25", "Sep-25", "Oct-25",
];

// Build a chronological repayment schedule from a loan record.
// Handles date formats: "31/1/2025", "1/2025", "31-12-2027", "Jan 2025"
// Returns rows covering the full period from Start Date to End Date.
// Columns: date (end of month), paid status, paid amount, remaining balance.
export function buildRepaymentSchedule(loan) {
  const installments    = loan["Number of installments"];
  const installmentAmt  = loan["Installment Amount"];
  const paidCount       = loan["Paid installment"] || 0;
  const startDateStr    = loan["Start Date"];
  const totalLoanAmt    = loan["Loan Amount"];

  if (!installments || !installmentAmt || !startDateStr) return [];

  // ── Parse a date string into { month (0-based), year } ──────
  // Handles: "31/1/2025", "1/2025", "31-12-2027", "Jan 2025"
  function parseMonthYear(str) {
    if (!str) return null;
    const s = String(str).trim();

    // "31-12-2027"  or "31/12/2027"  → dd[-/]mm[-/]yyyy
    const dmyMatch = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (dmyMatch) {
      return { month: parseInt(dmyMatch[2], 10) - 1, year: parseInt(dmyMatch[3], 10) };
    }

    // "1/2025" or "12/2025" → mm/yyyy
    const myMatch = s.match(/^(\d{1,2})\/(\d{4})$/);
    if (myMatch) {
      return { month: parseInt(myMatch[1], 10) - 1, year: parseInt(myMatch[2], 10) };
    }

    // "Jan 2025" or "January 2025"
    const monthNames = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
    const wordMatch  = s.match(/^([a-z]+)\s+(\d{4})$/i);
    if (wordMatch) {
      const mIdx = monthNames.indexOf(wordMatch[1].toLowerCase().slice(0, 3));
      if (mIdx !== -1) return { month: mIdx, year: parseInt(wordMatch[2], 10) };
    }

    return null;
  }

  // --------- Last day of a given month ---------
  function lastDayOf(month, year) {
    return new Date(year, month + 1, 0);  // day 0 of next month = last day of this month
  }

  const startParsed = parseMonthYear(startDateStr);
  if (!startParsed) return [];

  // Build schedule row by row
  const schedule = [];
  let   remainingBalance = totalLoanAmt;

  for (let i = 0; i < installments; i++) {
    // Advance month from start
    let m = startParsed.month + i;
    let y = startParsed.year + Math.floor(m / 12);
    m = m % 12;

    const dueDate  = lastDayOf(m, y);
    const isPaid   = i < paidCount;
    const paidAmt  = isPaid ? installmentAmt : 0;
    remainingBalance -= paidAmt;

    schedule.push({
      number:           i + 1,
      dueDate,
      paid:             isPaid,
      installmentAmt,
      paidAmt:          isPaid ? installmentAmt : null,
      remainingBalance: Math.max(0, remainingBalance),
    });
  }

  return schedule;
}
