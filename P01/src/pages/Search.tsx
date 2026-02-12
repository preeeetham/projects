import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RecordCard } from '@/components/records/RecordCard';
import { useRecords } from '@/hooks/useRecords';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search as SearchIcon, Filter } from 'lucide-react';

export function Search() {
  const { data } = useRecords({
    category: filters.category !== 'all' ? filters.category : undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
    verified: filters.verification !== 'all' ? filters.verification : undefined,
    search: searchQuery.trim() || undefined,
  });
  const allRecords = data?.items;
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    verification: 'all',
  });

  const results = useMemo(() => {
    if (!allRecords) return [];

    return allRecords.filter((record) => {
      // Search query
      if (
        searchQuery &&
        !record.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !record.recordId.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && record.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && record.status !== filters.status) {
        return false;
      }

      // Verification filter
      if (filters.verification === 'verified' && !record.blockchain.isVerified) {
        return false;
      }
      if (filters.verification === 'pending' && record.blockchain.isVerified) {
        return false;
      }

      return true;
    });
  }, [allRecords, searchQuery, filters]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-heading-1">Search Records</h1>
          <p className="text-muted-foreground mt-2">
            Find and filter public records by category, status, and verification status
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by title or record ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <SearchIcon className="h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Category</label>
                <Select value={filters.category} onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="birth_certificate">Birth Certificate</SelectItem>
                    <SelectItem value="property_deed">Property Deed</SelectItem>
                    <SelectItem value="legal_document">Legal Document</SelectItem>
                    <SelectItem value="license">License</SelectItem>
                    <SelectItem value="permit">Permit</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Status</label>
                <Select value={filters.status} onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Verification Status
                </label>
                <Select value={filters.verification} onValueChange={(value) =>
                  setFilters({ ...filters, verification: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Records</SelectItem>
                    <SelectItem value="verified">Blockchain Verified</SelectItem>
                    <SelectItem value="pending">Pending Verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setFilters({ category: 'all', status: 'all', verification: 'all' })
              }
              className="mt-4 w-full md:w-auto"
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <h2 className="text-heading-3 mb-4">
            Results{' '}
            <span className="text-muted-foreground text-lg font-normal">
              ({results.length} found)
            </span>
          </h2>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  onDownload={() => console.log('Download:', record.id)}
                  onShare={() => console.log('Share:', record.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-2">No records found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
