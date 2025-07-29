# ✨ WarriorSol - Born of Fire. Built To Shine.

> _A mission-driven site for those who fight, survive, and support._

Welcome to the **WarriorSol Main Website** – a Next.js-powered storefront designed to inspire resilience and community. This project combines clean aesthetics, seamless Shopify integration, and powerful authentication features to support our cause.

---

## ✨ Features

- **Public Homepage** – accessible without login
- **Product Catalog** – powered by Shopify Storefront API
- **Advanced Cart** – real-time state updates using Zustand
- **Authentication** – secure login/signup with NextAuth.js
- **Responsive UI** – mobile-first with Tailwind CSS
- **Accessibility** – screen reader & keyboard support

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Cormorant SC / Inter fonts
- **Animations**: Framer Motion
- **Auth**: NextAuth.js + Zod + Middleware
- **State**: Zustand (UI) + React Query (server state)
- **E-commerce**: Shopify Storefront API
- **Form Handling**: React Hook Form + Sonner (toasts)

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Yarn or pnpm
- Shopify Storefront API credentials

### Installation

```bash
# Clone the repo
$ git clone https://github.com/Areeb-Saqib/warriorsol.git
$ cd warriorsol/apps/warriorsol-main

# Install dependencies
$ yarn install  # or pnpm install

# Setup environment variables
$ cp .env.local.example .env.local
```

### Development

```bash
# Run local dev server
$ yarn dev
# or
$ pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

---

## 📁 Key Folders

```
apps/warriorsol-main/
├── app/           # App router
├── components/    # UI components
├── lib/           # Utils/configs
├── store/         # Zustand state
├── middleware.ts  # Route protection
```

---

## 🔧 Environment Variables

Example `.env.local`:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 🧪 Scripts

```bash
yarn dev          # Run dev server
yarn build        # Build for production
yarn lint         # Lint code
yarn format       # Prettify code
yarn check-types  # Type checking
```

---

## 📄 License

This project is proprietary and intended for WarriorSol Foundation internal use.

---

> Built to honor the fighters. Made to inspire the future. 🔥
