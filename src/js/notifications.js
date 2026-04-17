// ============================================================
// notifications.js — CE-IPRC Email Notifications
// ============================================================

const EMAILJS_PUBLIC_KEY   = "YSWtTz5EJGCNCzr34"; 
const EMAILJS_SERVICE_ID   = "service_kmackyk"; 
const TEMPLATE_LOAN_STATUS = "template_tcgli2j";   
const TEMPLATE_SAVINGS     = "template_ptenw02";       
// const TEMPLATE_INTEREST    = "template_interest_id";   // I disactivated this template because the emailsJS free account limited to the 2 templates! 

// ---------- Initialise EmailJS (call once per page) ----------
export function initEmailJS() {
  if (typeof emailjs === "undefined") {
    console.warn("[CE-IPRC] EmailJS SDK not loaded — notifications disabled.");
    return;
  }
  emailjs.init(EMAILJS_PUBLIC_KEY);
  console.log("[CE-IPRC] EmailJS initialised.");
}

// ---------- Internal send helper ----------
async function sendEmail(templateId, params) {
  if (typeof emailjs === "undefined") {
    console.log("[DEV] Would send email:", templateId, params);
    return;
  }
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, templateId, params);
    console.log("[CE-IPRC] Email sent:", templateId);
  } catch (err) {
    console.error("[CE-IPRC] EmailJS error:", err);
  }
}

// ---------- Public notification functions ----------

/**
 * Loan status notification (approval or rejection).
 * @param {{ name: string, email: string }} member
 * @param {{ amount: number, status: string, dateApplied: string }} loan
 */
export async function notifyLoanStatus(member, loan) {
  await sendEmail(TEMPLATE_LOAN_STATUS, {
    to_name:      member.name,
    to_email:     member.email,
    loan_amount:  Number(loan.amount).toLocaleString("en-RW"),
    loan_status:  loan.status,
    date_applied: loan.dateApplied,
  });
}

/**
 * Savings transaction confirmation.
 * @param {{ name: string, email: string }} member
 * @param {{ type: string, amount: number, balance: number, date: string }} record
 */
export async function notifySavingsTransaction(member, record) {
  await sendEmail(TEMPLATE_SAVINGS, {
    to_name:    member.name,
    to_email:   member.email,
    tx_type:    record.type,
    tx_amount:  Number(record.amount).toLocaleString("en-RW"),
    tx_balance: Number(record.balance).toLocaleString("en-RW"),
    tx_date:    record.date,
  });
}

/**
 * Year-end interest summary.
 * @param {{ name: string, email: string }} member
 * @param {{ year: number, amount: number }} interest
 */
/*
export async function notifyInterestSummary(member, interest) {
  await sendEmail(TEMPLATE_INTEREST, {
    to_name:         member.name,
    to_email:        member.email,
    interest_year:   interest.year,
    interest_amount: Number(interest.amount).toLocaleString("en-RW"),
  });
}
*/

// Make functions accessible in browser console (DEV ONLY)
if (typeof window !== "undefined") {
  window.testNotifyLoan = notifyLoanStatus;
  window.testNotifySavings = notifySavingsTransaction;
  window.testInitEmail = initEmailJS;
}