# 💼 Expense Approval System with OCR & Multi-Level Rules

A full-stack MERN application for managing company expenses with dynamic approval workflows, automatic rule detection, and OCR receipt scanning.

---

## 🧩 Features

### 🧍 Roles
- **Admin** – Manages users, approval rules, and can override expenses.
- **Manager** – Approves or rejects expenses submitted by team members.
- **Employee** – Submits expenses with receipts, views approval progress.

### 🔁 Approval Engine
- Multi-step, ordered approval levels.
- Supports **ManagerSlot**, **Role-based**, and **User-based** approvers.
- Conditional rules: percentage-based, specific approver, or hybrid.
- Automatic fallback to manager or auto-approve if no rule exists.

### 🧾 OCR Receipt Scanning
- Uses **Tesseract.js** for automatic extraction of:
  - Amount  
  - Currency  
  - Date  
  - Merchant  
  - Description  
- Auto-fills fields before submission.

### 📊 Dashboards
| Role | Dashboard |
|------|------------|
| Admin | All company expenses, override controls, rule management |
| Manager | Pending approvals, team expense insights |
| Employee | Submit expenses, see approval progress |

---

## ⚙️ Setup Instructions

### Backend
```bash
cd server
npm install
npm run dev
```
### 📊 Create a .env file with:
```bash
PORT=4000
MONGO_URI=
JWT_SECRET=supersecret_jwt_key
EXCHANGE_API_BASE=https://api.exchangerate-api.com/v4/latest
RESTCOUNTRIES_API=https://restcountries.com/v3.1/all?fields=name,currencies
OCR_PROVIDER=local
ADMIN_EMAIL=
ADMIN_PASSWORD=
SMTP_USER=
SMTP_PASS=
```
### Frontend
```bash
cd client
npm install
npm start
```

## 🔐 API Overview

### `/expenses`
- **POST** `/expenses` → Create & submit expense (auto rule selection)
- **GET** `/expenses/me` → Employee’s own expenses

### `/approvals`
- **GET** `/approvals/pending` → List all pending approvals for current user
- **POST** `/approvals/:id/decide` → Approve or reject

### `/rules`
- **GET** `/rules` → List all approval rules for a company
- **POST** `/rules` → Create new rule

---

## 📸 OCR Example

Upload a **receipt image** (restaurant, hotel, etc.)  
The system automatically extracts fields using **Tesseract.js**:
- Amount  
- Currency  
- Date  
- Merchant  
- Description  

and auto-fills them before expense submission.

---

## 🧠 Tech Stack

| Layer | Technologies |
|--------|---------------|
| **Frontend** | React, Tailwind CSS, Axios |
| **Backend** | Node.js, Express, MongoDB |
| **Auth** | JWT |
| **OCR** | Tesseract.js |
| **Database Models** | Expense, Approval, ApprovalRule, User, Company |

---

## 🏁 System Flow

1. **Employee** submits an expense with attached receipt.  
2. **System** automatically detects and applies the correct approval rule.  
3. **Approvals** are created for each step (e.g., Manager → Finance → Admin).  
4. **Approvers** view pending items in their dashboard and approve/reject.  
5. **System** auto-progresses through steps and finalizes as *Approved* or *Rejected*.  
6. **Employee** can view the approval progress and final status in “My Expenses”.

---
