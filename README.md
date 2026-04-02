# 🇩🇿 DigitHub — Algeria's Digital Marketplace

> **Sell your skills. Buy what you need. Grow where you are.**

DigitHub is a full-stack, production-ready marketplace platform built for the Algerian market. It connects freelancers, digital product publishers, and buyers through a unified ecosystem — supporting service hiring, digital product sales, job postings, messaging, and more.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS v4 + shadcn/ui |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | Supabase Auth (SSR cookie sessions) |
| Storage | Supabase Storage |
| Deployment (Frontend) | Vercel |
| Deployment (Backend) | Supabase |
| Animations | Motion (Framer) |
| Currency | DZD (Algerian Dinar) |

---

## 📁 Project Structure

```
├── app/                    # Next.js pages (App Router)
│   ├── (marketing)         # /, /services, /store, /jobs, /hire, /how-it-works
│   ├── auth/callback/      # Supabase OAuth callback
│   ├── login/ register/    # Auth pages
│   ├── dashboard/          # Seller dashboard
│   │   └── buyer/          # Buyer dashboard
│   ├── publisher/          # Publisher dashboard (courses/products)
│   ├── admin/              # Admin panel
│   ├── cart/ checkout/     # Shopping flow
│   └── actions/            # Next.js Server Actions (server-only)
├── components/             # UI components
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Navbar, Footer, etc.
│   ├── dashboard/          # Dashboard-specific components
│   └── marketplace/        # Marketplace components
├── lib/supabase/           # Supabase client (client + server + middleware)
├── prisma/                 # Prisma schema + SQL setup files
│   ├── schema.prisma       # Full DB schema (all 18 models)
│   └── SUPABASE_SETUP.sql  # ← Run this in Supabase SQL Editor
├── store/                  # Zustand global state
├── _reference_design/      # Original Figma UI prototype (reference only)
├── .env.example            # Environment variable template
└── vercel.json             # Vercel deployment config
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Exposure | Where to Find |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Supabase Dashboard → Project Settings → API |
| `DATABASE_URL` | Server only | Supabase Dashboard → Project Settings → Database → URI (Transaction mode) |
| `DIRECT_URL` | Server only | Supabase Dashboard → Project Settings → Database → URI (Session mode) |

> ⚠️ **NEVER** commit `.env` to git. The `SUPABASE_SERVICE_ROLE_KEY` and `DATABASE_URL` must never appear in browser bundles.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js ≥ 20
- npm or pnpm
- A Supabase project (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/zineeddineabdelbakidaoudi-maker/COURSERA.git
cd COURSERA
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Edit .env with your real Supabase values
```

### 3. Set up Supabase database

1. Go to your **Supabase Dashboard → SQL Editor**
2. Run the contents of `prisma/SUPABASE_SETUP.sql` — this creates:
   - The profile auto-create trigger (links Auth ↔ Profile table)
   - All RLS policies
   - All table grants

3. Push the Prisma schema to create tables:
```bash
npx prisma db push
```

Or if using migrations:
```bash
npx prisma migrate deploy
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗃️ Database Schema

The full schema is in `prisma/schema.prisma`. Key models:

| Model | Purpose |
|---|---|
| `Profile` | User profiles (linked to Supabase `auth.users` by UUID) |
| `Category` | Service/product categories (EN/AR/FR names + slugs) |
| `Service` | Freelance service listings by sellers |
| `DigitalProduct` | Courses, templates, e-books, toolkits |
| `Order` | Service purchase orders (`DH-YYYYXXXX` format) |
| `ProductPurchase` | Digital product purchases with download tokens |
| `CartItem` | Shopping cart entries |
| `Conversation` + `Message` | Real-time messaging between users |
| `Review` | Blind double-review system (both parties review simultaneously) |
| `Job` + `Proposal` | Job board (buyers post, sellers propose) |
| `Notification` | In-app notification system |
| `Payout` | Seller payout requests (CIB/Edahabia/bank transfer) |
| `Wishlist` | User saved items |
| `PromoCode` | Discount codes |
| `ChatbotFaq` | FAQ entries for the AI assistant |

---

## 🔐 Authentication Flow

```
User registers/logs in
  → supabase.auth.signInWithPassword() [client-side, anon key]
  → Supabase sets auth cookie
  → Next.js middleware refreshes session on every request
  → Server components: createClient() from lib/supabase/server.ts
  → Protected pages check session; redirect to /login if missing
  → Supabase trigger auto-creates Profile row on first signup
```

### Key files:
- `lib/supabase/client.ts` — Client-side Supabase (anon key)
- `lib/supabase/server.ts` — Server-side Supabase (anon key + cookies)
- `middleware.ts` — Refreshes session on every request
- `app/actions/item-actions.ts` — Uses service role key (server-only writes)

---

## 👤 User Roles

| Role | Description |
|---|---|
| `buyer` | Default. Can browse, purchase services/products, post jobs |
| `seller` | Can list services, receive orders, submit proposals |
| `publisher` | Can publish digital products (courses, templates, e-books) |
| `admin` | Full platform management access |

Roles are stored in `Profile.role`. Seller/publisher status goes through an approval flow (`seller_status`, `publisher_status`).

---

## 💳 Payment Model

DigitHub uses a **manual/COD (Cash on Delivery)** payment model suitable for the Algerian market:

1. Buyer places order → order created with `status: pending_requirements`
2. Payment confirmed offline (WhatsApp/phone) → seller starts work
3. Seller delivers → buyer confirms → review exchange
4. Platform takes **5% fee** on all transactions
5. Seller requests payout via CIB, Edahabia, or bank transfer

---

## ☁️ Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Production-ready DigitHub"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework will be auto-detected as **Next.js**

### 3. Set environment variables in Vercel

In Vercel Dashboard → Project → Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL       = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY  = eyJ...
SUPABASE_SERVICE_ROLE_KEY      = eyJ...
DATABASE_URL                   = postgresql://...?pgbouncer=true
DIRECT_URL                     = postgresql://...
```

### 4. Deploy

Vercel will automatically:
1. Run `npx prisma generate` (generates Prisma client)
2. Run `next build`
3. Deploy to `cdg1` region (Paris — closest to Algeria)

---

## 🔧 Key Scripts

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Browse database in GUI
npx prisma db push   # Push schema to DB (dev)
npx prisma generate  # Regenerate Prisma client
```

---

## 📋 Supabase Storage Buckets

The app uses Supabase Storage for file uploads. Buckets are auto-created by `uploadFileAction` in `app/actions/item-actions.ts`. Expected buckets:

- `services` — Service thumbnail/gallery images
- `products` — Product cover images and preview files
- `avatars` — User avatar images
- `files` — Product download files (private)

---

## 🐛 Troubleshooting

### "Profile not found" errors after signup
Run `prisma/SUPABASE_SETUP.sql` in Supabase SQL Editor to install the auth trigger.

### RLS permission denied errors
Run the RLS section of `prisma/SUPABASE_SETUP.sql`. Make sure all tables have policies.

### Build fails with "SUPABASE_SERVICE_ROLE_KEY is not defined"
Add the variable to Vercel's environment variables dashboard.

### Prisma Client not found
Run `npx prisma generate` before `next build`.

---

## 📄 License

Built for the Algerian digital market. All rights reserved.

---

*DigitHub — Proudly built in Algeria 🇩🇿*
