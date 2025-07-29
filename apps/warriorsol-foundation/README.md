# 🎗️ WarriorSol Foundation Site

> _Support, strength, and solidarity – all in one platform._

The **WarriorSol Foundation Site** is a full-stack donation and support platform built to serve families affected by cancer. It allows users to make donations, apply for support (like scholarships or gift cards), and view live donor activity – all while giving applicants visibility into their request history.

---

## ✨ Features

- **Donation Portal** – One-time or recurring donations via Stripe
- **Support Requests** – Apply for donations, gift cards, or scholarships
- **Request Dashboard** – Logged-in users can track and manage their support history
- **Donor Wall** – Real-time display of top and recent donors
- **Email Confirmations** – Transactional emails for submissions & receipts
- **Admin Tools** – Moderation, status updates, and donation tracking

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 · TypeScript · TailwindCSS
- **Auth**: NextAuth.js (Email / OAuth)
- **Payments**: Stripe Checkout + Webhooks

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm or yarn
- PostgreSQL
- Stripe + Mailersend accounts

### Setup

```bash
# Clone and enter project directory
$ git clone https://github.com/Areeb-Saqib/warriorsol.git
$ cd warriorsol/apps/warriorsol-foundation

# Install dependencies
$ pnpm install  # or yarn install

# Setup environment variables
$ cp .env.local.example .env.local
```

### Development

```bash
# Start dev server
$ pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

---

## 🧭 Core Features

- **Donation Flow**: Stripe-powered checkout for quick and secure donations
- **Support Application**: Users can submit requests for help through a form
- **My Requests Dashboard**: Logged-in users can view statuses and history
- **Donor Wall**: Realtime wall with top donors, recent donors, and donation stats
- **Admin Moderation Panel** : Review and update application statuses

---

## 📝 Contributing

1. Clone the repo & create a feature branch
2. Add your feature or fix
3. Run `pnpm lint` and `pnpm build`
4. Submit a pull request 💪

---

## 📄 License

This project is proprietary and maintained by the WarriorSol team.

---

> Powered by kindness, built with code, and made for warriors. 💛
