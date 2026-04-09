// ============================================================
// data.js — CE-IPRC Data Layer
// CRUD operations for members, savings, loans, and interest
// All data stored in localStorage as JSON
// ============================================================

// ---------- Generic localStorage helpers ----------

export function getItem(key) {
  return JSON.parse(localStorage.getItem(key)) || null;
}

export function setItem(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---------- Members ----------

export function getMembers() {
  return getItem("ce-members") || [];
}

export function getMemberById(id) {
  return getMembers().find((m) => m.id === id) || null;
}

export function saveMember(member) {
  const members = getMembers();
  const idx = members.findIndex((m) => m.id === member.id);
  if (idx >= 0) {
    members[idx] = member; // update
  } else {
    members.push(member); // create
  }
  setItem("ce-members", members);
}

// ---------- Savings ----------

export function getSavings(memberId) {
  const all = getItem("ce-savings") || [];
  return all.filter((s) => s.memberId === memberId);
}

export function addSavingsRecord(record) {
  // record: { memberId, date, type: "deposit"|"withdrawal", amount, balance }
  const all = getItem("ce-savings") || [];
  record.id = Date.now().toString();
  all.push(record);
  setItem("ce-savings", all);
  return record;
}

// ---------- Loans ----------

export function getLoans(memberId) {
  const all = getItem("ce-loans") || [];
  return all.filter((l) => l.memberId === memberId);
}

export function addLoan(loan) {
  // loan: { memberId, amount, dateApplied, status, repaymentSchedule }
  const all = getItem("ce-loans") || [];
  loan.id = Date.now().toString();
  all.push(loan);
  setItem("ce-loans", all);
  return loan;
}

export function updateLoanStatus(loanId, status) {
  const all = getItem("ce-loans") || [];
  const loan = all.find((l) => l.id === loanId);
  if (loan) {
    loan.status = status;
    setItem("ce-loans", all);
  }
}

// ---------- Interest ----------

export function getInterest(memberId) {
  const all = getItem("ce-interest") || [];
  return all.filter((i) => i.memberId === memberId);
}

export function addInterestRecord(record) {
  // record: { memberId, year, rate, amount }
  const all = getItem("ce-interest") || [];
  record.id = Date.now().toString();
  all.push(record);
  setItem("ce-interest", all);
  return record;
}

// ---------- Seed demo data (run once on first load) ----------

export function seedDemoData() {
  if (getItem("ce-seeded")) return; // already seeded

  // Demo member account
  const member = {
    id: "M001",
    name: "Cassien Habyarimana",
    email: "cassien@example.com",
    phone: "+250 780 000 001",
    address: "Kigali, Rwanda",
    joinDate: "2022-01-15",
    membershipNumber: "CEIPRC-2022-001",
    password: "demo1234", // plain text for demo only — never do this in production!
  };
  saveMember(member);

  // Seed savings records
  const savingsRecords = [
    { memberId: "M001", date: "2024-01-10", type: "deposit", amount: 50000, balance: 50000 },
    { memberId: "M001", date: "2024-02-10", type: "deposit", amount: 50000, balance: 100000 },
    { memberId: "M001", date: "2024-03-05", type: "withdrawal", amount: 20000, balance: 80000 },
    { memberId: "M001", date: "2024-04-10", type: "deposit", amount: 50000, balance: 130000 },
    { memberId: "M001", date: "2024-05-10", type: "deposit", amount: 50000, balance: 180000 },
    { memberId: "M001", date: "2024-06-10", type: "deposit", amount: 50000, balance: 230000 },
  ];
  savingsRecords.forEach(addSavingsRecord);

  // Seed loan
  addLoan({
    memberId: "M001",
    amount: 200000,
    dateApplied: "2024-03-01",
    disbursementDate: "2024-03-10",
    status: "Approved",
    interestRate: 0.05,
    repaymentSchedule: [
      { due: "2024-04-10", amount: 21000, paid: true },
      { due: "2024-05-10", amount: 21000, paid: true },
      { due: "2024-06-10", amount: 21000, paid: false },
      { due: "2024-07-10", amount: 21000, paid: false },
    ],
  });

  // Seed interest
  addInterestRecord({ memberId: "M001", year: 2023, rate: 0.08, amount: 12000 });
  addInterestRecord({ memberId: "M001", year: 2024, rate: 0.08, amount: 18400 });

  setItem("ce-seeded", true);
}
