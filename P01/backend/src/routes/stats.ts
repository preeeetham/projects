import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const where: Record<string, unknown> = {};
    if (user.role === 'citizen') {
      where.ownerId = user.id;
    }

    const [total, verified, pending, chartData] = await Promise.all([
      prisma.record.count({ where }),
      prisma.record.count({ where: { ...where, blockchainIsVerified: true } }),
      prisma.record.count({ where: { ...where, status: 'pending' } }),
      getChartData(where),
    ]);

    const verificationRate = total > 0 ? Math.round((verified / total) * 100) : 0;

    res.json({
      totalRecords: total,
      verifiedRecords: verified,
      pendingRecords: pending,
      verificationRate,
      authorityCount: user.role !== 'citizen' ? await prisma.user.count({ where: { role: 'authority' } }) : undefined,
      chartData,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

async function getChartData(where: Record<string, unknown>) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const records = await prisma.record.findMany({
    where: { ...where, createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true, blockchainIsVerified: true },
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const byMonth: Record<string, { name: string; created: number; verified: number }> = {};

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    byMonth[key] = { name: months[d.getMonth()], created: 0, verified: 0 };
  }

  for (const r of records) {
    const key = `${r.createdAt.getFullYear()}-${String(r.createdAt.getMonth() + 1).padStart(2, '0')}`;
    if (byMonth[key]) {
      byMonth[key].created++;
      if (r.blockchainIsVerified) byMonth[key].verified++;
    }
  }

  return Object.values(byMonth).map((v) => ({
    name: v.name,
    created: v.created,
    verified: v.verified,
  }));
}

export default router;
