import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuditTimeline } from '@/components/audit/AuditTimeline';
import { useAuditTrail } from '@/hooks/useAudit';
import { Filter, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function AuditTrail() {
  const [filters, setFilters] = useState({
    action: 'all',
    dateRange: 'all',
    searchQuery: '',
  });

  const { data, isLoading } = useAuditTrail({ action: filters.action !== 'all' ? filters.action : undefined });
  const entries = data?.items ?? [];

  const filteredEntries = useMemo(() => {
    if (!filters.searchQuery.trim()) return entries;
    return entries.filter((e) => e.recordId.toLowerCase().includes(filters.searchQuery.toLowerCase()));
  }, [entries, filters.searchQuery]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1">Audit Trail</h1>
            <p className="text-muted-foreground mt-2">
              Complete history of all record actions and changes
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Search Records
                </label>
                <Input
                  placeholder="Record ID..."
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setFilters({ ...filters, searchQuery: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Action Type
                </label>
                <Select value={filters.action} onValueChange={(value) =>
                  setFilters({ ...filters, action: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                    <SelectItem value="requested">Requested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Date Range
                </label>
                <Select value={filters.dateRange} onValueChange={(value) =>
                  setFilters({ ...filters, dateRange: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({ action: 'all', dateRange: 'all', searchQuery: '' })
                  }
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <AuditTimeline entries={filteredEntries} />
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{entries.length}</p>
                <p className="text-sm text-muted-foreground">Total Actions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{entries.filter((e) => e.action === 'verified').length}</p>
                <p className="text-sm text-muted-foreground">Verifications</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{entries.filter((e) => e.action === 'updated').length}</p>
                <p className="text-sm text-muted-foreground">Updates</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{entries.filter((e) => e.action === 'shared').length}</p>
                <p className="text-sm text-muted-foreground">Shares</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
