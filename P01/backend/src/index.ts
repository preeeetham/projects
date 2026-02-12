import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import authWalletRoutes from './routes/auth-wallet.js';
import recordsRoutes from './routes/records.js';
import auditRoutes from './routes/audit.js';
import statsRoutes from './routes/stats.js';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Health check
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.get('/api', (_req, res) => {
  res.json({ message: 'BlockRecords API v1' });
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/wallet', authWalletRoutes);

// Records, Audit, Stats
app.use('/api/records', recordsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
