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

    const { recordId, action, page = '1', limit = '50' } = req.query;
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit))));
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};

    if (recordId) {
      const rid = String(recordId);
      where.recordId = rid;
      const record = await prisma.record.findUnique({ where: { id: rid } });
      if (record && user.role === 'citizen' && record.ownerId !== user.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
    } else if (user.role === 'citizen') {
      // Citizens only see audit for their records
      const myRecords = await prisma.record.findMany({
        where: { ownerId: user.id },
        select: { id: true },
      });
      where.recordId = { in: myRecords.map((r) => r.id) };
    }

    if (action && String(action) !== 'all') {
      where.action = action;
    }

    const [entries, total] = await Promise.all([
      prisma.auditEntry.findMany({
        where,
        include: { record: { select: { recordId: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.auditEntry.count({ where }),
    ]);

    res.json({
      items: entries.map((e) => ({
        id: e.id,
        recordId: e.record?.recordId ?? e.recordId,
        action: e.action,
        performedBy: e.performedBy,
        performedByName: e.performedByName,
        timestamp: e.createdAt,
        changesSummary: e.changesSummary,
        details: e.details,
        transactionHash: e.transactionHash,
        blockNumber: e.blockNumber,
      })),
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error('Audit list error:', err);
    res.status(500).json({ error: 'Failed to fetch audit trail' });
  }
});

export default router;
