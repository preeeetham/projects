import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { UserPlus, ArrowLeft } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup, loginWithMetaMask, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || 'citizen',
    agreeTerms: false,
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      setFormError('You must agree to the terms and conditions');
      return;
    }

    try {
      await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.role as 'citizen' | 'authority'
      );
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white via-white to-orange-50/80 px-4 py-8">
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
            <CardTitle className="text-heading-2">Create Account</CardTitle>
            <CardDescription>
              Join BlockRecords to secure your public records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {(error || formError) && (
                <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
                  {error || formError}
                </div>
              )}

              {/* Account Type Selection */}
              <div className="space-y-2">
                <Label>Account Type</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <div className="flex items-center space-x-2 mb-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                    <RadioGroupItem value="citizen" id="citizen" />
                    <Label htmlFor="citizen" className="cursor-pointer flex-1">
                      <span className="font-medium">Citizen</span>
                      <span className="block text-xs text-muted-foreground">
                        Manage your personal records
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                    <RadioGroupItem value="authority" id="authority" />
                    <Label htmlFor="authority" className="cursor-pointer flex-1">
                      <span className="font-medium">Authority</span>
                      <span className="block text-xs text-muted-foreground">
                        Issue and verify records
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      agreeTerms: checked as boolean,
                    })
                  }
                  className="mt-1"
                />
                <span className="text-sm">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <Button type="submit" className="w-full gap-2 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0" disabled={isLoading}>
                <UserPlus className="h-4 w-4" />
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm mt-6">
              Already have an account?{' '}
              <Link
                to={`/login?role=${formData.role}`}
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>

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
