import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecordCard } from '@/components/records/RecordCard';
import { useRecords } from '@/hooks/useRecords';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/useStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Plus, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useRecords();
  const { data: stats } = useDashboardStats();
  const records = data?.items;
  const chartData = stats?.chartData ?? [
    { name: 'Jan', created: 0, verified: 0 },
    { name: 'Feb', created: 0, verified: 0 },
    { name: 'Mar', created: 0, verified: 0 },
    { name: 'Apr', created: 0, verified: 0 },
    { name: 'May', created: 0, verified: 0 },
    { name: 'Jun', created: 0, verified: 0 },
  ];
  const isCitizen = user?.role === 'citizen';

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      label: 'Total Records',
      value: records?.length || 0,
      icon: CheckCircle,
      color: 'text-orange-600',
    },
    {
      label: 'Verified',
      value: records?.filter(r => r.blockchain.isVerified).length || 0,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      label: 'Pending',
      value: records?.filter(r => r.status === 'pending').length || 0,
      icon: Clock,
      color: 'text-amber-600',
    },
    {
      label: 'Verification Rate',
      value: `${records ? Math.round((records.filter(r => r.blockchain.isVerified).length / records.length) * 100) : 0}%`,
      icon: TrendingUp,
      color: 'text-green-600',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.name}! Here's your {isCitizen ? 'records' : 'authority'} overview.
            </p>
          </div>
          {!isCitizen && (
            <Link to="/dashboard/create-record">
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                New Record
              </Button>
            </Link>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="rounded-xl border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label === 'Verified' ? 'Successfully verified' : 'Current status'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Records Created</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="created" fill="#ea580c" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="verified" stroke="#ea580c" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Records */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-3">Recent Records</h2>
            <Link to="/dashboard/records">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          {records && records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.slice(0, 3).map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  onDownload={() => console.log('Download:', record.id)}
                  onShare={() => console.log('Share:', record.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">No records found</p>
                {!isCitizen && (
                  <Link to="/dashboard/create-record">
                    <Button>Create Your First Record</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
