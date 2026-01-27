# 📦 Déxinventory — Trading Card Inventory Management App

Déxinventory is a full-stack web application that helps trading card collectors organize and manage their inventory. In addition to basic collection management, the app is designed to support valuation features and pricing analysis, allowing users to securely manage and analyze their own collections through authenticated accounts.

---

## 💻 Live Website

https://dex-inventory-production.up.railway.app/

---

## ✨ Features

- 🗂️ Create and manage trading card inventories
- ➕ Add, edit, and delete cards (CRUD functionality)
- 🔐 Authenticated, user-specific inventories
- 📊 Structured inventory views and summaries
- 🎨 Responsive UI for desktop and mobile
- 🛠️ Backend designed for extensibility and future analysis

---

## 🛠️ Tech Stack

**Frontend**

- HTML5
- CSS3
- JavaScript (ES6+)

**Backend**

- Node.js
- Express.js

**Database**

- PostgreSQL

---

## 📸 Screenshots

---
<img width="1456" height="764" alt="Screenshot 2026-01-27 at 6 03 43 PM" src="https://github.com/user-attachments/assets/ccb445c7-0e73-4303-b3be-70829814abd9" />
<img width="1458" height="767" alt="Screenshot 2026-01-27 at 6 04 28 PM" src="https://github.com/user-attachments/assets/3c912a42-65de-4136-8a65-467a152a8c85" />
<img width="1470" height="768" alt="Screenshot 2026-01-27 at 6 03 57 PM" src="https://github.com/user-attachments/assets/4f87ce3f-ea58-40dd-a2e1-332faaeddfb0" />
<img width="1470" height="767" alt="Screenshot 2026-01-27 at 6 05 06 PM" src="https://github.com/user-attachments/assets/3e56e736-7eeb-41cf-af30-31849d2c573a" />
<img width="903" height="689" alt="Screenshot 2026-01-27 at 6 05 21 PM" src="https://github.com/user-attachments/assets/91625db5-7fcc-4237-8165-7cb24cf1ef69" />

## 🚀 Getting Started

**Prerequisites**

- Node.js (v18+ recommended)
- npm
- PostgreSQL (local or hosted)

---

### 🔧 Installation

Clone the repository:

```
git clone https://github.com/TonyLi0916/dex-inventory.git
cd dex-inventory
```

Install dependencies:

```
npm install
```

---

### 🗄️ Database Setup

Create a PostgreSQL database and configure environment variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=dexinventory
```

---

### ▶️ Run the App

Start the development server:

```bash
npm run dev
```

The app will run locally at:

http://localhost:3000

---

## 🧠 Project Status

🚧 **Actively in Development**

Déxinventory is currently being expanded with valuation and analytics features, including planned integration with the **eBay API** to analyze recent last-sold data over multiple time windows (e.g., 7 / 30 / 90 days) and support basic price comparisons.
