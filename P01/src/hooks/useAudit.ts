import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { AuditEntry } from '@/types';

type ApiAuditItem = {
  id: string;
  recordId: string;
  action: string;
  performedBy: string;
  performedByName: string;
  timestamp: string;
  changesSummary: string;
  details?: Record<string, unknown>;
  transactionHash?: string;
  blockNumber?: number;
};

type AuditResponse = {
  items: ApiAuditItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function toAuditEntry(a: ApiAuditItem): AuditEntry {
  return {
    id: a.id,
    recordId: a.recordId,
    action: a.action as AuditEntry['action'],
    performedBy: a.performedBy,
    performedByName: a.performedByName,
    timestamp: new Date(a.timestamp),
    changesSummary: a.changesSummary,
    details: a.details,
    transactionHash: a.transactionHash,
    blockNumber: a.blockNumber,
  };
}

export function useAuditTrail(filters?: { recordId?: string; action?: string }) {
  const query = new URLSearchParams();
  if (filters?.recordId) query.set('recordId', filters.recordId);
  if (filters?.action && filters.action !== 'all') query.set('action', filters.action);

  const path = `/api/audit${query.toString() ? `?${query.toString()}` : ''}`;

  return useQuery({
    queryKey: ['audit', filters],
    queryFn: async () => {
      const res = await apiFetch<AuditResponse>(path);
      return {
        ...res,
        items: res.items.map(toAuditEntry),
      };
    },
  });
}
