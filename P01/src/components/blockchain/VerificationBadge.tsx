import { Check, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BlockchainVerification } from '@/types';
import { format } from 'date-fns';

interface VerificationBadgeProps {
  verification: BlockchainVerification;
  compact?: boolean;
}

export function VerificationBadge({
  verification,
  compact = false,
}: VerificationBadgeProps) {
  if (verification.isVerified) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="badge-verified gap-1 cursor-pointer">
            <Check className="h-3 w-3" />
            {!compact && 'Verified'}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="right" className="space-y-1">
          <div className="text-xs">
            <p className="font-semibold">Blockchain Verified</p>
            <p>Block #{verification.blockNumber}</p>
            <p className="font-mono text-xs">{verification.transactionHash}</p>
            <p>{format(verification.timestamp, 'PPP p')}</p>
            <p className="text-xs capitalize">{verification.blockchainNetwork}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className="badge-pending gap-1 cursor-pointer">
          <Clock className="h-3 w-3" />
          {!compact && 'Pending'}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p className="text-xs">Waiting for blockchain confirmation</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface BlockchainInfoProps {
  transactionHash: string;
  blockNumber: number;
  network: 'mainnet' | 'testnet';
  timestamp: Date;
}

export function BlockchainInfo({
  transactionHash,
  blockNumber,
  network,
  timestamp,
}: BlockchainInfoProps) {
  const explorerUrl =
    network === 'mainnet'
      ? `https://etherscan.io/tx/${transactionHash}`
      : `https://sepolia.etherscan.io/tx/${transactionHash}`;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Transaction Hash:</span>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-mono text-xs"
        >
          {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
        </a>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Block Number:</span>
        <span className="font-mono">{blockNumber.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Network:</span>
        <span className="capitalize px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
          {network}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Timestamp:</span>
        <span>{format(timestamp, 'PPP p')}</span>
      </div>
    </div>
  );
}
