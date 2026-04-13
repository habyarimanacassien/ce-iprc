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

// The months tracked in the 2025 files, in order
export const MONTHS_2025 = [
  "Nov-24", "Dec-24",
  "Jan-25", "Feb-25", "Mar-25", "Apr-25",
  "May-25", "Jun-25", "Jul-25", "Aug-25", "Sep-25", "Oct-25",
];

// Build a chronological repayment schedule from a loan record.
// Each installment falls on the last day of a month between
// Start Date and End Date.
export function buildRepaymentSchedule(loan) {
  const installments = loan["Number of installments"];
  const installmentAmount = loan["Installment Amount"];
  const paidCount = loan["Paid installment"] || 0;
  const startDate = loan["Start Date"];

  if (!installments || !installmentAmount || !startDate) return [];

  // Parse "MM/YYYY" or "Month YYYY" style dates
  const parseMonthYear = (str) => {
    if (!str) return null;
    const parts = str.trim().split(/[\s/]/);
    if (parts.length === 2) {
      const month = parseInt(parts[0], 10) - 1;
      const year = parseInt(parts[1], 10);
      return new Date(year, month, 1);
    }
    return null;
  };

  const start = parseMonthYear(startDate);
  if (!start) return [];

  const schedule = [];
  for (let i = 0; i < installments; i++) {
    const dueDate = new Date(start.getFullYear(), start.getMonth() + i + 1, 0);
    schedule.push({
      number: i + 1,
      dueDate,
      amount: installmentAmount,
      paid: i < paidCount,
    });
  }
  return schedule;
}
