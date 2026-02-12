import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import { signToken } from '../lib/auth.js';
import crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

const NONCE_EXPIRY_MINUTES = 5;

// Get nonce for MetaMask sign-in
router.post('/nonce', async (req, res) => {
  try {
    const { address } = req.body;

    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Wallet address is required' });
      return;
    }

    const normalizedAddress = address.toLowerCase();
    if (!ethers.isAddress(normalizedAddress)) {
      res.status(400).json({ error: 'Invalid wallet address' });
      return;
    }

    const nonce = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + NONCE_EXPIRY_MINUTES * 60 * 1000);

    await prisma.authNonce.upsert({
      where: { address: normalizedAddress },
      create: { address: normalizedAddress, nonce, expiresAt },
      update: { nonce, expiresAt },
    });

    const message = `Sign this message to authenticate with BlockRecords.\n\nNonce: ${nonce}`;
    res.json({ message });
  } catch (err) {
    console.error('Nonce error:', err);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

// Verify signature and login/register
router.post('/login', async (req, res) => {
  try {
    const { address, signature } = req.body;

    if (!address || !signature) {
      res.status(400).json({ error: 'Address and signature are required' });
      return;
    }

    const normalizedAddress = address.toLowerCase();
    if (!ethers.isAddress(normalizedAddress)) {
      res.status(400).json({ error: 'Invalid wallet address' });
      return;
    }

    const nonceRecord = await prisma.authNonce.findUnique({
      where: { address: normalizedAddress },
    });

    if (!nonceRecord || nonceRecord.expiresAt < new Date()) {
      res.status(400).json({ error: 'Nonce expired. Please request a new one.' });
      return;
    }

    const message = `Sign this message to authenticate with BlockRecords.\n\nNonce: ${nonceRecord.nonce}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== normalizedAddress) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    // Delete used nonce
    await prisma.authNonce.delete({ where: { address: normalizedAddress } }).catch(() => {});

    let user = await prisma.user.findUnique({
      where: { walletAddress: normalizedAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: `Wallet ${normalizedAddress.slice(0, 6)}...${normalizedAddress.slice(-4)}`,
          walletAddress: normalizedAddress,
          role: 'citizen',
        },
      });
    }

    const token = signToken({ userId: user.id });
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        walletAddress: user.walletAddress,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (err) {
    console.error('Wallet login error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router;
