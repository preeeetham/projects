import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { Lock, ArrowLeft } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginWithMetaMask, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const role = searchParams.get('role') || 'citizen';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch {
      // error shown via useAuth
    }
  };

  const handleMetaMask = async () => {
    try {
      await loginWithMetaMask();
      navigate('/dashboard');
    } catch {
      // error shown via useAuth
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white via-white to-orange-50/80 px-4">
      <div className="w-full max-w-md">
        {/* Logo + Back button */}
        <div className="relative flex items-center justify-center mb-8 min-h-10">
          <Link
            to="/"
            className="absolute left-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-100 to-white border border-orange-200/50 shadow-sm hover:shadow-md transition-shadow"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5 text-orange-600" />
          </Link>
          <span className="text-2xl font-semibold text-foreground lowercase tracking-tight">blockrecords</span>
        </div>

        <Card className="rounded-xl border border-gray-200 shadow-lg bg-white">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-heading-2">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your {role === 'citizen' ? 'citizen' : 'authority'} account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        rememberMe: checked as boolean,
                      })
                    }
                  />
                  <span className="text-sm">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full gap-2 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0" disabled={isLoading}>
                <Lock className="h-4 w-4" />
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {role === 'citizen' && (
              <p className="text-center text-sm mt-6">
                Don't have an account?{' '}
                <Link
                  to="/register?role=citizen"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up here
                </Link>
              </p>
            )}

            {role === 'authority' && (
              <p className="text-center text-sm mt-6">
                Don't have an authority account?{' '}
                <Link
                  to="/register?role=authority"
                  className="text-primary hover:underline font-medium"
                >
                  Register here
                </Link>
              </p>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" type="button" onClick={handleMetaMask} disabled={isLoading}>
              Continue with MetaMask
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
