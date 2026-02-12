# BlockRecords

A secure public records management system with blockchain verification. Citizens and authorities can manage, verify, and audit government documents through an immutable, transparent platform.

## Features

- **Authentication** – Email/password and MetaMask wallet login
- **Records** – Create, view, search, and manage public records (birth certificates, property deeds, licenses, etc.)
- **Blockchain Verification** – Authorities can verify records on-chain (simulated in dev)
- **Audit Trail** – Complete history of all record actions

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 19, Vite, TypeScript, Tailwind, shadcn/ui, React Query, Zustand |
| Backend | Node.js, Express, Prisma |
| Database | PostgreSQL (Docker) |

## Quick Start

### Prerequisites

- Node.js 18+
- Docker
- npm or pnpm

### 1. Start PostgreSQL

```bash
cd backend && docker compose up -d
```

### 2. Set Up Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

Backend runs at **http://localhost:3000**

### 3. Set Up Frontend

```bash
# From project root
npm install
cp .env.example .env   # Optional: set VITE_API_URL if backend is elsewhere
npm run dev
```

Frontend runs at **http://localhost:5173**

## Project Structure

```
P01/
├── src/                 # Frontend (React)
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── store/
│   └── lib/
├── backend/             # API server
│   ├── prisma/
│   ├── src/routes/
│   └── docker-compose.yml
└── readme.md
```

## Environment

- **Frontend** – `.env.example` has `VITE_API_URL` (default: `http://localhost:3000`)
- **Backend** – See `backend/README.md` for full API and env vars

## API Overview

- **Auth** – `/api/auth/register`, `/api/auth/login`, `/api/auth/wallet/*`
- **Records** – `/api/records` (CRUD + verify)
- **Audit** – `/api/audit`
- **Stats** – `/api/stats`

See [backend/README.md](backend/README.md) for details.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build frontend for production |
| `cd backend && npm run dev` | Start backend API |
| `cd backend && npx prisma studio` | Open database GUI |
