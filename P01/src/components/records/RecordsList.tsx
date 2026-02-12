import { PublicRecord } from '@/types';
import { RecordCard } from '@/components/records/RecordCard';

interface RecordsListProps {
  records: PublicRecord[];
  isLoading?: boolean;
  onDownload?: (record: PublicRecord) => void;
  onShare?: (record: PublicRecord) => void;
}

export function RecordsList({
  records,
  isLoading,
  onDownload,
  onShare,
}: RecordsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12 bg-card border border-border rounded-lg">
        <p className="text-muted-foreground">No records found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {records.map((record) => (
        <RecordCard
          key={record.id}
          record={record}
          onDownload={onDownload}
          onShare={onShare}
        />
      ))}
    </div>
  );
}
