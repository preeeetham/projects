import crypto from 'crypto';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { generateRecordId, recordToResponse } from '../lib/records.js';

const router = Router();
const prisma = new PrismaClient();

// List records (filter by owner for citizens, all for authorities)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const { category, status, verified, search, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit))));
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};

    // Citizens see only their records; authorities see all
    if (user.role === 'citizen') {
      where.ownerId = user.id;
    }

    if (category && String(category) !== 'all') {
      where.category = category;
    }
    if (status && String(status) !== 'all') {
      where.status = status;
    }
    if (verified === 'verified') {
      where.blockchainIsVerified = true;
    } else if (verified === 'pending') {
      where.blockchainIsVerified = false;
    }
    if (search && String(search).trim()) {
      const q = String(search).trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { recordId: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [records, total] = await Promise.all([
      prisma.record.findMany({
        where,
        include: { attachments: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.record.count({ where }),
    ]);

    res.json({
      items: records.map(recordToResponse),
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error('List records error:', err);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Get single record
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const record = await prisma.record.findUnique({
      where: { id },
      include: { attachments: true },
    });

    if (!record) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    // Citizens can only view their own records
    if (user.role === 'citizen' && record.ownerId !== user.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(recordToResponse(record));
  } catch (err) {
    console.error('Get record error:', err);
    res.status(500).json({ error: 'Failed to fetch record' });
  }
});

// Create record
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const { title, category, description, content } = req.body;

    if (!title || !category || !description || !content) {
      res.status(400).json({ error: 'Title, category, description, and content are required' });
      return;
    }

    const validCategories = [
      'birth_certificate', 'property_deed', 'legal_document', 'license',
      'permit', 'certificate', 'other',
    ];
    if (!validCategories.includes(category)) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    const recordId = await generateRecordId();

    const record = await prisma.record.create({
      data: {
        recordId,
        title,
        category,
        description,
        content,
        status: 'pending',
        ownerId: user.id,
        createdBy: user.id,
        authorityId: user.role === 'authority' || user.role === 'admin' ? user.id : null,
      },
      include: { attachments: true },
    });

    await prisma.auditEntry.create({
      data: {
        recordId: record.id,
        action: 'created',
        performedBy: user.id,
        performedByName: user.name,
        changesSummary: 'Record created',
      },
    });

    res.status(201).json(recordToResponse(record));
  } catch (err) {
    console.error('Create record error:', err);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

// Update record
router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const record = await prisma.record.findUnique({ where: { id } });
    if (!record) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    const canEdit = record.ownerId === user.id ||
      user.role === 'authority' || user.role === 'admin';
    if (!canEdit) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const { title, category, description, content } = req.body;
    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (content !== undefined) updates.content = content;

    const updated = await prisma.record.update({
      where: { id },
      data: { ...updates, version: record.version + 1 },
      include: { attachments: true },
    });

    await prisma.auditEntry.create({
      data: {
        recordId: record.id,
        action: 'updated',
        performedBy: user.id,
        performedByName: user.name,
        changesSummary: 'Record updated',
        details: updates,
      },
    });

    res.json(recordToResponse(updated));
  } catch (err) {
    console.error('Update record error:', err);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// Verify record (authority only - simulates blockchain verification)
router.post('/:id/verify', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    if (user.role !== 'authority' && user.role !== 'admin') {
      res.status(403).json({ error: 'Only authorities can verify records' });
      return;
    }

    const record = await prisma.record.findUnique({ where: { id } });
    if (!record) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    if (record.blockchainIsVerified) {
      res.status(400).json({ error: 'Record already verified' });
      return;
    }

    // Simulate blockchain verification
    const blockNumber = Math.floor(Math.random() * 10000000) + 10000000;
    const txHash = '0x' + Buffer.from(crypto.randomBytes(32)).toString('hex');

    const updated = await prisma.record.update({
      where: { id },
      data: {
        status: 'verified',
        blockchainIsVerified: true,
        blockchainBlockNumber: blockNumber,
        blockchainTxHash: txHash,
        blockchainTimestamp: new Date(),
        blockchainNetwork: 'testnet',
        blockchainGasUsed: '21000',
      },
      include: { attachments: true },
    });

    await prisma.auditEntry.create({
      data: {
        recordId: record.id,
        action: 'verified',
        performedBy: user.id,
        performedByName: user.name,
        changesSummary: 'Record verified on blockchain',
        transactionHash: txHash,
        blockNumber,
      },
    });

    res.json(recordToResponse(updated));
  } catch (err) {
    console.error('Verify record error:', err);
    res.status(500).json({ error: 'Failed to verify record' });
  }
});

export default router;
