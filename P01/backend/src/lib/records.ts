import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateRecordId(): Promise<string> {
  const count = await prisma.record.count();
  const seq = String(count + 1).padStart(6, '0');
  return `REC-${seq}`;
}

export function recordToResponse(r: {
  id: string;
  recordId: string;
  title: string;
  category: string;
  description: string;
  content: string;
  status: string;
  ownerId: string;
  authorityId: string | null;
  createdBy: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  blockchainIsVerified: boolean;
  blockchainBlockNumber: number | null;
  blockchainTxHash: string | null;
  blockchainTimestamp: Date | null;
  blockchainNetwork: string | null;
  blockchainGasUsed: string | null;
  attachments?: { id: string; name: string; type: string; size: number; url: string; uploadedAt: Date }[];
}) {
  return {
    id: r.id,
    recordId: r.recordId,
    title: r.title,
    category: r.category,
    description: r.description,
    content: r.content,
    status: r.status,
    ownerId: r.ownerId,
    authorityId: r.authorityId ?? undefined,
    attachments: (r.attachments || []).map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      size: a.size,
      url: a.url,
      uploadedAt: a.uploadedAt,
    })),
    blockchain: {
      isVerified: r.blockchainIsVerified,
      blockNumber: r.blockchainBlockNumber ?? 0,
      transactionHash: r.blockchainTxHash ?? '',
      timestamp: r.blockchainTimestamp ?? r.updatedAt,
      gasUsed: r.blockchainGasUsed ?? undefined,
      blockchainNetwork: (r.blockchainNetwork as 'mainnet' | 'testnet') ?? 'testnet',
    },
    createdBy: r.createdBy,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    version: r.version,
  };
}
