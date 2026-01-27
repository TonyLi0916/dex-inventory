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
