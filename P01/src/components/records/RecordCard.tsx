import { Link } from 'react-router-dom';
import { Download, Eye, Share2, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VerificationBadge } from '@/components/blockchain/VerificationBadge';
import { PublicRecord } from '@/types';
import { format } from 'date-fns';

interface RecordCardProps {
  record: PublicRecord;
  onDownload?: (record: PublicRecord) => void;
  onShare?: (record: PublicRecord) => void;
}

export function RecordCard({ record, onDownload, onShare }: RecordCardProps) {
  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    revoked: 'bg-red-100 text-red-800',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow rounded-xl border-gray-200 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <CardTitle className="truncate text-lg">{record.title}</CardTitle>
            </div>
            <CardDescription className="line-clamp-2">
              {record.description}
            </CardDescription>
          </div>
          <VerificationBadge verification={record.blockchain} compact />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Category</p>
            <p className="font-medium capitalize">{record.category.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge
              variant="outline"
              className={`capitalize ${statusColors[record.status]}`}
            >
              {record.status}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground">Issued</p>
            <p className="font-medium">{format(record.createdAt, 'MMM dd, yyyy')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Record ID</p>
            <p className="font-mono text-xs">{record.recordId}</p>
          </div>
        </div>

        {/* Blockchain Hash */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Blockchain Hash</p>
          <p className="font-mono text-xs break-all text-gray-600 dark:text-gray-400">
            {record.blockchain.transactionHash}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link to={`/records/${record.id}`} className="flex-1">
            <Button variant="default" className="w-full gap-2 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0">
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDownload?.(record)}
            title="Download record"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onShare?.(record)}
            title="Share record"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
