# 📦 StockLogic | Inventory SaaS

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)

A high-performance, enterprise-grade inventory management dashboard. Designed for real-time stock tracking, advanced revenue analytics, and seamless auditing.

---

## 🚀 Overview

**StockLogic** is built for speed and precision. It leverages modern web technologies to provide business owners with a clear view of their inventory health and financial performance through a sleek, reactive interface.

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Backend/Auth** | [Supabase](https://supabase.com/) |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide-React |

---

## ✨ Key Features

* **📊 Revenue Intelligence:** Dynamic bar charts featuring Daily (AM/PM), Weekly (Calendar-based), Monthly, and Yearly (2026 base) views.
* **📦 Stock Control:** Real-time Stat Cards for total products, unit counts, and automated low-stock alerts.
* **💸 Transaction Ledger:** Immediate capture of sales with detailed product metadata and automated margin calculation.
* **🌐 Global Currency Context:** Unified state management for currency symbols (PHP, USD, EUR) across the entire application.
* **🖱️ Dynamic Sidebar:** Smooth, draggable mobile burger button and upward-sliding currency switcher for enhanced UX.

---

## 🗺️ Roadmap & Future Updates

- [ ] **Advanced Audit Mode:** Deep-dive reporting on stock discrepancies and loss prevention.
- [ ] **Multi-Currency Conversion:** Automatic price conversion via real-time exchange rate APIs.
- [ ] **Batch Operations:** CSV/Excel bulk upload and mass-editing tools for large inventories.
- [ ] **RBAC (Role-Based Access Control):** Granular permissions for Admin, Manager, and Staff roles.

---

## ⚙️ Environment Setup

Live Setup:
username : test@gmail.com
pass : 123123
https://vercel.com/jsons-projects-b0b11cd2/inventory-saas

To run this project locally or deploy it, ensure you have a `.env.local` file with the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
