import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { RecordsList } from '@/components/records/RecordsList';
import { useRecords } from '@/hooks/useRecords';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Records() {
  const { data, isLoading } = useRecords();
  const records = data?.items;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = records?.filter((record) =>
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.recordId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1">My Records</h1>
            <p className="text-muted-foreground mt-2">Manage and view your records</p>
          </div>
          <Link to="/dashboard/create-record">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Record
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by title or record ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <div>
          <h2 className="text-heading-3 mb-4">
            {filteredRecords?.length || 0} Records
          </h2>
          <RecordsList
            records={filteredRecords || []}
            isLoading={isLoading}
            onDownload={(record) => console.log('Download:', record.id)}
            onShare={(record) => console.log('Share:', record.id)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
