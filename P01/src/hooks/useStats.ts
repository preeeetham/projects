import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { DashboardStats } from '@/types';

type ApiStats = {
  totalRecords: number;
  verifiedRecords: number;
  pendingRecords: number;
  verificationRate: number;
  authorityCount?: number;
  chartData: { name: string; created: number; verified: number }[];
};

export function useDashboardStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await apiFetch<ApiStats>('/api/stats');
      return {
        totalRecords: res.totalRecords,
        verifiedRecords: res.verifiedRecords,
        pendingRecords: res.pendingRecords,
        totalAuthorities: res.authorityCount ?? 0,
        verificationRate: res.verificationRate,
        chartData: res.chartData,
      } as DashboardStats & { chartData: ApiStats['chartData'] };
    },
  });
}
