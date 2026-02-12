import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { apiFetch, auth } from '@/lib/api';
import { ethers } from 'ethers';

type ApiUser = {
  id: string;
  email: string | null;
  name: string;
  role: string;
  walletAddress: string | null;
  avatar: string | null;
  createdAt: string;
};

function toUser(u: ApiUser | null) {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email ?? '',
    name: u.name,
    role: u.role as 'citizen' | 'authority' | 'admin',
    avatar: u.avatar ?? undefined,
    walletAddress: u.walletAddress ?? undefined,
    createdAt: new Date(u.createdAt),
    updatedAt: new Date(u.createdAt),
  };
}

export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error, setUser, setLoading, setError, logout } = useAuthStore();

  const logoutAndClear = useCallback(() => {
    auth.clearToken();
    logout();
    navigate('/');
  }, [logout, navigate]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ user: ApiUser; token: string }>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        auth.setToken(res.token);
        setUser(toUser(res.user));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setUser]
  );

  const signup = useCallback(
    async (email: string, password: string, name: string, role: 'citizen' | 'authority') => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ user: ApiUser; token: string }>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password, name, role }),
        });
        auth.setToken(res.token);
        setUser(toUser(res.user));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Signup failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setUser]
  );

  const loginWithMetaMask = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts.length === 0) throw new Error('No accounts found');

      const address = accounts[0];
      const nonceRes = await apiFetch<{ message: string }>('/api/auth/wallet/nonce', {
        method: 'POST',
        body: JSON.stringify({ address }),
      });
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(nonceRes.message);

      const res = await apiFetch<{ user: ApiUser; token: string }>('/api/auth/wallet/login', {
        method: 'POST',
        body: JSON.stringify({ address, signature }),
      });
      auth.setToken(res.token);
      setUser(toUser(res.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'MetaMask login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);

  useEffect(() => {
    const token = auth.getToken();
    if (!token) return;
    setLoading(true);
    apiFetch<ApiUser>('/api/auth/me')
      .then((u) => setUser(toUser(u)))
      .catch(() => auth.clearToken())
      .finally(() => setLoading(false));
  }, [setLoading, setUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    loginWithMetaMask,
    logout: logoutAndClear,
  };
}
