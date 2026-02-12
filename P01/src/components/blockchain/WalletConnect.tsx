import { useBlockchain } from '@/hooks/useBlockchain';
import { Button } from '@/components/ui/button';
import { Wallet, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WalletConnect() {
  const { walletAddress, isConnecting, error, connectWallet, disconnectWallet } =
    useBlockchain();

  if (walletAddress) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-3 py-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-xs text-green-700 dark:text-green-300 font-mono">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={disconnectWallet}
          title="Disconnect wallet"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="gap-2"
      variant="outline"
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}

interface WalletConnectCardProps {
  onConnect?: () => void;
  className?: string;
}

export function WalletConnectCard({ onConnect, className }: WalletConnectCardProps) {
  const { walletAddress, isConnecting, connectWallet } = useBlockchain();

  const handleConnect = async () => {
    await connectWallet();
    onConnect?.();
  };

  if (walletAddress) {
    return (
      <div className={cn('p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg', className)}>
        <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
          Wallet Connected ✓
        </p>
        <p className="text-xs font-mono text-green-700 dark:text-green-300">
          {walletAddress}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg', className)}>
      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
        Connect Your Wallet
      </p>
      <p className="text-xs text-blue-700 dark:text-blue-300 mb-4">
        Connect your MetaMask wallet to verify records on the blockchain
      </p>
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        size="sm"
        className="w-full gap-2"
      >
        <Wallet className="h-4 w-4" />
        {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
      </Button>
    </div>
  );
}
