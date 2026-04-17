# CE-IPRC Member Portal

**WDD 330 — Project | Cassien Habyarimana**

A web application for members of the Caisse d'Entraide IPRC to view their financial information online.

### Step 1 — Install Dependencies & Run Dev Server

```bash
npm install
npm start
```

Open http://localhost:5173 in the browser

### Step 2 — Login

Use your registered email address and the shared default password:

- **Password:** ceiprc@2026!

### Sample data

## Team Members

| Family Name | First Name  | E-mail                           |
| ----------- | ----------- | -------------------------------- |
| Habyarimana | Cassien     | habyarimanacassien@gmail.com     |
| Cyubahiro   | Aime        | haca2020@yahoo.fr                |
| Gisa        | Nicolas     | nyiramuhireannonciathe@gmail.com |
| Nyiramuhire | Annonciathe | nyiramuhireannonciathe@yahoo.fr  |
| Ineza       | Ysaline     | inezashimwa@gmail.com            |

**Notifications Example**

Open the website, then in the browser console, type for example (use your names and email):

```bash
testInitEmail();
testNotifyLoan(
  { name: "Habyarimana Cassien", email: "habyarimanacassien@gmail.com" },
  { amount: 6497000, status: "Approved", dateApplied: "2025-01-31" }
);
```

or:

```bash
testInitEmail();
notifySavingsTransaction(
  { name: "Habyarimana Cassien", email: "habyarimanacassien@gmail.com" },
  { type: "Saving", amount: 200000, balance: 2567000, date: "2025-01-31" }
);
```
