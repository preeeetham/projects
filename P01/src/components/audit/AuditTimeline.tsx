import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AuditEntry } from '@/types';
import { CheckCircle, Edit, Trash2, Lock, Share2, Plus } from 'lucide-react';

const actionIcons: Record<string, React.ReactNode> = {
  created: <Plus className="h-4 w-4" />,
  updated: <Edit className="h-4 w-4" />,
  verified: <CheckCircle className="h-4 w-4" />,
  deleted: <Trash2 className="h-4 w-4" />,
  shared: <Share2 className="h-4 w-4" />,
  requested: <Lock className="h-4 w-4" />,
};

const actionColors: Record<string, string> = {
  created: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
  updated: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
  verified: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
  deleted: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
  shared: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
  requested: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
};

interface AuditTimelineProps {
  entries: AuditEntry[];
  isLoading?: boolean;
}

export function AuditTimeline({ entries, isLoading }: AuditTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No audit entries found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {entries.map((entry, index) => (
        <div key={entry.id} className="flex gap-4">
          {/* Timeline connector */}
          <div className="flex flex-col items-center">
            <div className={`rounded-full p-2 ${actionColors[entry.action]} border`}>
              {actionIcons[entry.action]}
            </div>
            {index < entries.length - 1 && (
              <div className="w-0.5 h-12 bg-border my-2" />
            )}
          </div>

          {/* Entry content */}
          <div className={`flex-1 pb-4 border-b border-border last:border-b-0 ${actionColors[entry.action]} border rounded p-4`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-semibold capitalize flex items-center gap-2">
                  {entry.action.replace(/_/g, ' ')}
                  <Badge variant="outline" className="text-xs">
                    v{entry.blockNumber || 'local'}
                  </Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  by <span className="font-medium text-foreground">{entry.performedByName}</span>
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(entry.timestamp, 'MMM dd, yyyy')}
                  </time>
                </TooltipTrigger>
                <TooltipContent>
                  {format(entry.timestamp, 'PPPpppp')}
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Changes */}
            <p className="text-sm text-foreground my-2">{entry.changesSummary}</p>

            {/* Transaction details */}
            {entry.transactionHash && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Blockchain Transaction:</p>
                <a
                  href={`https://etherscan.io/tx/${entry.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline font-mono break-all"
                >
                  {entry.transactionHash}
                </a>
              </div>
            )}

            {/* Details */}
            {entry.details && (
              <details className="mt-3 cursor-pointer">
                <summary className="text-xs font-medium text-muted-foreground hover:text-foreground">
                  View details
                </summary>
                <pre className="mt-2 text-xs bg-black/5 dark:bg-white/5 p-2 rounded overflow-auto">
                  {JSON.stringify(entry.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
