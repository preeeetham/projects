import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Lock, User, Palette, Shield } from 'lucide-react';

export function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      recordVerified: true,
      recordUpdated: true,
      recordShared: true,
      auditLog: false,
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
    },
    privacy: {
      profilePublic: false,
      allowSharing: true,
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-heading-1">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account, security, and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user?.name || ''}
                    className="mt-1"
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    className="mt-1"
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="role">Account Type</Label>
                  <Input
                    id="role"
                    value={user?.role.charAt(0).toUpperCase() + user?.role.slice(1) || ''}
                    className="mt-1"
                    readOnly
                  />
                </div>
                {user?.walletAddress && (
                  <div>
                    <Label htmlFor="wallet">Connected Wallet</Label>
                    <Input
                      id="wallet"
                      value={user.walletAddress}
                      className="mt-1 font-mono text-sm"
                      readOnly
                    />
                  </div>
                )}
                <Button>Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactor}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, twoFactor: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="font-medium">Login Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Notify me of new login attempts
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.loginAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, loginAlerts: checked },
                      })
                    }
                  />
                </div>

                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: 'recordVerified',
                    label: 'Record Verified',
                    description: 'When your record is verified on the blockchain',
                  },
                  {
                    key: 'recordUpdated',
                    label: 'Record Updated',
                    description: 'When your record details are updated',
                  },
                  {
                    key: 'recordShared',
                    label: 'Record Shared',
                    description: 'When someone shares a record with you',
                  },
                  {
                    key: 'auditLog',
                    label: 'Audit Log Summary',
                    description: 'Weekly audit log summary',
                  },
                ].map((notif) => (
                  <div key={notif.key} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                    <Checkbox
                      id={notif.key}
                      checked={
                        settings.notifications[
                          notif.key as keyof typeof settings.notifications
                        ]
                      }
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            [notif.key]: checked,
                          },
                        })
                      }
                    />
                    <div>
                      <label
                        htmlFor={notif.key}
                        className="font-medium cursor-pointer block"
                      >
                        {notif.label}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {notif.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="font-medium">Public Profile</p>
                    <p className="text-sm text-muted-foreground">
                      Allow others to view your profile
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.profilePublic}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, profilePublic: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Record Sharing</p>
                    <p className="text-sm text-muted-foreground">
                      Allow others to request access to your records
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.allowSharing}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, allowSharing: checked },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Settings */}
        <div className="flex gap-4">
          <Button>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
