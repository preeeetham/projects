import { useCallback, useState } from 'react';
import { ethers } from 'ethers';

export function useBlockchain() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setIsConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setError(null);
  }, []);

  const verifyOnBlockchain = useCallback(
    async (transactionHash: string) => {
      if (typeof window === 'undefined') return;

      try {
        const provider = new ethers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/your-api-key');
        const receipt = await provider.getTransactionReceipt(transactionHash);

        return receipt ? { success: true, blockNumber: receipt.blockNumber } : { success: false };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed');
        return { success: false };
      }
    },
    []
  );

  return {
    walletAddress,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    verifyOnBlockchain,
  };
}
