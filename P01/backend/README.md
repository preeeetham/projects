# BlockRecords Backend

Node.js + Express + PostgreSQL + Prisma API.

## Quick Start

```bash
# 1. Start PostgreSQL (Docker)
docker compose up -d

# 2. Install & setup
npm install
cp .env.example .env   # Edit if needed
npx prisma db push

# 3. Run dev server
npm run dev
```

Server runs at http://localhost:3000

## API Endpoints

### Auth (Email/Password)
- `POST /api/auth/register` - Register: `{ email, password, name, role? }`
- `POST /api/auth/login` - Login: `{ email, password }`
- `GET /api/auth/me` - Get current user (Bearer token required)

### Auth (MetaMask)
- `POST /api/auth/wallet/nonce` - Get sign message: `{ address }`
- `POST /api/auth/wallet/login` - Verify & login: `{ address, signature }`

### Records (all require Bearer token)
- `GET /api/records` - List records (query: category, status, verified, search, page, limit)
- `GET /api/records/:id` - Get single record
- `POST /api/records` - Create: `{ title, category, description, content }`
- `PATCH /api/records/:id` - Update record
- `POST /api/records/:id/verify` - Verify on blockchain (authority only)

### Audit
- `GET /api/audit` - List audit entries (query: recordId, action, page, limit)

### Stats
- `GET /api/stats` - Dashboard stats + chart data

### Health
- `GET /health` - Health check
- `GET /api` - API info

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | postgresql://p01:p01password@localhost:5433/p01 | PostgreSQL connection |
| JWT_SECRET | dev-secret | JWT signing key |
| PORT | 3000 | Server port |
| FRONTEND_URL | http://localhost:5173 | CORS origin |

## Database

PostgreSQL runs on port **5433** (to avoid conflict with local Postgres on 5432).

```bash
npx prisma studio   # Open DB GUI
npx prisma migrate dev   # Create migrations
```
