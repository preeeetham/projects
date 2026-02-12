import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PublicRecord, SearchFilters } from '@/types';
import { apiFetch } from '@/lib/api';

type ApiRecord = {
  id: string;
  recordId: string;
  title: string;
  category: string;
  description: string;
  content: string;
  status: string;
  ownerId: string;
  authorityId?: string;
  attachments: { id: string; name: string; type: string; size: number; url: string; uploadedAt: string }[];
  blockchain: {
    isVerified: boolean;
    blockNumber: number;
    transactionHash: string;
    timestamp: string;
    gasUsed?: string;
    blockchainNetwork: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
};

function toRecord(r: ApiRecord): PublicRecord {
  return {
    id: r.id,
    recordId: r.recordId,
    title: r.title,
    category: r.category as PublicRecord['category'],
    description: r.description,
    content: r.content,
    status: r.status as PublicRecord['status'],
    ownerId: r.ownerId,
    authorityId: r.authorityId,
    attachments: r.attachments.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      size: a.size,
      url: a.url,
      uploadedAt: new Date(a.uploadedAt),
    })),
    blockchain: {
      isVerified: r.blockchain.isVerified,
      blockNumber: r.blockchain.blockNumber,
      transactionHash: r.blockchain.transactionHash,
      timestamp: new Date(r.blockchain.timestamp),
      gasUsed: r.blockchain.gasUsed,
      blockchainNetwork: r.blockchain.blockchainNetwork as 'mainnet' | 'testnet',
    },
    createdBy: r.createdBy,
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.updatedAt),
    version: r.version,
  };
}

type RecordsResponse = { items: ApiRecord[]; total: number; page: number; limit: number; totalPages: number };

export function useRecords(filters?: { category?: string; status?: string; verified?: string; search?: string }) {
  const query = new URLSearchParams();
  if (filters?.category && filters.category !== 'all') query.set('category', filters.category);
  if (filters?.status && filters.status !== 'all') query.set('status', filters.status);
  if (filters?.verified && filters.verified !== 'all') query.set('verified', filters.verified);
  if (filters?.search) query.set('search', filters.search);

  const queryString = query.toString();
  const path = `/api/records${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['records', filters],
    queryFn: async () => {
      const res = await apiFetch<RecordsResponse>(path);
      return {
        ...res,
        items: res.items.map(toRecord),
      };
    },
  });
}

export function useRecordById(id: string) {
  return useQuery({
    queryKey: ['records', id],
    queryFn: async () => {
      const r = await apiFetch<ApiRecord>(`/api/records/${id}`);
      return toRecord(r);
    },
    enabled: !!id,
  });
}

export function useSearchRecords(filters: SearchFilters) {
  const query = new URLSearchParams();
  if (filters.category) query.set('category', filters.category);
  if (filters.status) query.set('status', filters.status);
  if (filters.verificationStatus) query.set('verified', filters.verificationStatus);
  if (filters.searchQuery) query.set('search', filters.searchQuery);

  const path = `/api/records?${query.toString()}`;

  return useQuery({
    queryKey: ['records', 'search', filters],
    queryFn: async () => {
      const res = await apiFetch<RecordsResponse>(path);
      return res.items.map(toRecord);
    },
  });
}

type CreateRecordInput = { title: string; category: string; description: string; content: string };

export function useCreateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRecordInput) => {
      const r = await apiFetch<ApiRecord>('/api/records', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return toRecord(r);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });
}

export function useVerifyRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: string) => {
      const r = await apiFetch<ApiRecord>(`/api/records/${recordId}/verify`, {
        method: 'POST',
      });
      return toRecord(r);
    },
    onSuccess: (_, recordId) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['records', recordId] });
    },
  });
}
