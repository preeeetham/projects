import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  BarChart3,
  Clock,
  Search,
  Settings,
  LogOut,
  X,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isCitizen = user?.role === 'citizen';

  const navItems = isCitizen
    ? [
        { icon: Home, label: 'Home', href: '/' },
        { icon: FileText, label: 'My Records', href: '/dashboard/records' },
        { icon: Clock, label: 'Audit Trail', href: '/audit-trail' },
        { icon: Search, label: 'Search', href: '/search' },
        { icon: Wallet, label: 'Wallet', href: '/wallet' },
        { icon: Settings, label: 'Settings', href: '/settings' },
      ]
    : [
        { icon: Home, label: 'Home', href: '/' },
        { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
        { icon: FileText, label: 'Manage Records', href: '/dashboard/records' },
        { icon: Clock, label: 'Audit Log', href: '/audit-trail' },
        { icon: Search, label: 'Search', href: '/search' },
        { icon: Settings, label: 'Settings', href: '/settings' },
      ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-label="Sidebar overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-card pt-16 lg:sticky lg:z-0 lg:pt-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-screen flex-col">
          {/* Close button (mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start gap-2"
                    onClick={onClose}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border px-4 py-4 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => {
                logout();
                onClose?.();
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
