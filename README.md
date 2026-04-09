# CE-IPRC Member Portal
**WDD 330 — Individual Project | Cassien Habyarimana**

A web application for members of the Caisse d'Entraide IPRC to access their financial information online.

---

## Week 5 — What Was Built

### Deliverables Completed
- Git repository initialized with full folder structure
- Login page (`index.html`) with authentication logic
- Member Dashboard (`dashboard.html`) with static summary cards
- Savings History page (`savings.html`) with filterable table + add form
- localStorage data layer (`js/data.js`) with CRUD for members, savings, loans, interest
- Authentication module (`js/auth.js`) with session management via `sessionStorage`
- Utility functions (`js/utils.js`) — currency formatting, date helpers, DOM utilities
- Global stylesheet (`css/styles.css`) using the project color scheme

---

## Step-by-Step Setup (Week 5)

### Step 1 — Initialize Git Repository
```bash
git init ce-iprc
cd ce-iprc
git add .
git commit -m "Week 5: Project setup, login page, dashboard, data layer"
```

### Step 2 — Install Dependencies & Run Dev Server
```bash
npm install
npm run start
```
Open http://localhost:5173 in your browser.

### Step 3 — Test Demo Login
Use the demo credentials on the login page:
- **Email:** cassien@example.com
- **Password:** demo1234

### Step 4 — Push to GitHub & Deploy to GitHub Pages
```bash
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ce-iprc.git
git branch -M main
git push -u origin main
```

For GitHub Pages, go to your repo Settings → Pages → Source → GitHub Actions (or use `gh-pages` branch).

---

## Folder Structure

```
ce-iprc/
├── index.html          ← Login page (entry point)
├── dashboard.html      ← Member dashboard
├── savings.html        ← Savings history + add transaction
├── loans.html          ← (Week 6)
├── interest.html       ← (Week 6)
├── profile.html        ← (Week 6)
├── package.json
├── css/
│   └── styles.css      ← Global stylesheet
└── js/
    ├── auth.js         ← Login/logout + sessionStorage session
    ├── data.js         ← localStorage CRUD for all data
    ├── dashboard.js    ← Dashboard page logic
    └── utils.js        ← Currency, date, DOM helpers
```

---

## Demo Credentials
| Field | Value |
|-------|-------|
| Email | cassien@example.com |
| Password | demo1234 |

> ⚠️ Passwords are stored in plain text for demo purposes only. In a real application, always hash passwords server-side.

---

## Tech Stack
- **Vanilla JavaScript (ES Modules)** — no framework
- **localStorage** — all data persistence
- **sessionStorage** — session management
- **Vite** — dev server and bundler
- **Chart.js** — (Week 6, for savings/loan charts)
- **EmailJS** — (Week 6, for notifications)
