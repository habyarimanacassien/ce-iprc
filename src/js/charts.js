// ============================================================
// charts.js — CE-IPRC Chart Module
// ============================================================

// ---------- Helper: destroy previous chart on same canvas ----------
function destroyPrevious(canvas) {
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
}

// ---------- Savings Growth Line Chart ----------
export function renderSavingsChart(canvasId, rows) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  destroyPrevious(canvas);

  // rows = [{ month, balance }, ...]
  const labels = rows.map((r) => r.month);
  const data   = rows.map((r) => r.balance);

  new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Savings Balance (RWF)",
          data,
          borderColor: "#1A7A4A",
          backgroundColor: "rgba(26,122,74,0.10)",
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: "#1A7A4A",
          fill: true,
          tension: 0.35,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              "RWF " + Number(ctx.parsed.y).toLocaleString("en-RW"),
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: (v) => "RWF " + Number(v).toLocaleString("en-RW"),
            font: { size: 11 },
          },
          grid: { color: "#eee" },
        },
        x: {
          ticks: { font: { size: 11 } },
          grid: { display: false },
        },
      },
    },
  });
}

// ---------- Loan Repayment Bar Chart ----------
export function renderLoanChart(canvasId, schedule) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !schedule || schedule.length === 0) return;
  destroyPrevious(canvas);

  const labels = schedule.map((_, i) => `#${i + 1}`);
  const colors = schedule.map((r) =>
    r.paid ? "rgba(26,122,74,0.75)" : "rgba(231,76,60,0.65)"
  );

  new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Installment (RWF)",
          data: schedule.map((r) => r.amount),
          backgroundColor: colors,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              "RWF " + Number(ctx.parsed.y).toLocaleString("en-RW"),
            afterLabel: (ctx) =>
              schedule[ctx.dataIndex].paid ? "✓ Paid" : "✗ Unpaid",
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (v) => "RWF " + Number(v).toLocaleString("en-RW"),
            font: { size: 10 },
          },
        },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      },
    },
  });
}

// ---------- Annual Interest Bar Chart ----------
export function renderInterestChart(canvasId, years) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !years || years.length === 0) return;
  destroyPrevious(canvas);

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: years.map((r) => String(r.year)),
      datasets: [
        {
          label: "Annual Interest (RWF)",
          data: years.map((r) => r.amount),
          backgroundColor: "rgba(45,156,219,0.70)",
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              "RWF " + Number(ctx.parsed.y).toLocaleString("en-RW"),
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (v) => "RWF " + Number(v).toLocaleString("en-RW"),
            font: { size: 11 },
          },
        },
        x: { grid: { display: false } },
      },
    },
  });
}
