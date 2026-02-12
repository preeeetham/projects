import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRecordById, useVerifyRecord } from '@/hooks/useRecords';
import { useAuditTrail } from '@/hooks/useAudit';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VerificationBadge, BlockchainInfo } from '@/components/blockchain/VerificationBadge';
import { AuditTimeline } from '@/components/audit/AuditTimeline';
import { ArrowLeft, Download, Share2, FileText, Lock, History } from 'lucide-react';
import { format } from 'date-fns';

export function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: record, isLoading, error } = useRecordById(id || '');
  const { data: auditData } = useAuditTrail(id ? { recordId: id } : undefined);
  const verifyRecord = useVerifyRecord();
  const mockAuditEntries = auditData?.items ?? [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !record) {
    return (
      <DashboardLayout>
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">Record not found</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const isAuthority = user?.role === 'authority' || user?.role === 'admin';
  const canVerify = isAuthority && !record.blockchain.isVerified && record.status !== 'verified';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-heading-1">{record.title}</h1>
            </div>
            <p className="text-muted-foreground">Record ID: {record.recordId}</p>
          </div>
          <VerificationBadge verification={record.blockchain} />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {canVerify && (
            <Button
              className="gap-2"
              onClick={() => verifyRecord.mutate(record.id)}
              disabled={verifyRecord.isPending}
            >
              {verifyRecord.isPending ? 'Verifying...' : 'Verify on Blockchain'}
            </Button>
          )}
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          {record.blockchain.transactionHash && (
            <Button
              variant="outline"
              onClick={() =>
                window.open(
                  `https://etherscan.io/tx/${record.blockchain.transactionHash}`,
                  '_blank'
                )
              }
              className="gap-2"
            >
              <Lock className="h-4 w-4" />
              View on Explorer
            </Button>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Record Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground">Title</label>
                    <p className="text-lg font-medium">{record.title}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Category</label>
                    <p className="text-lg font-medium capitalize">
                      {record.category.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Status</label>
                    <Badge className="mt-1 capitalize">{record.status}</Badge>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Version</label>
                    <p className="text-lg font-medium">v{record.version}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Created</label>
                    <p className="text-sm">{format(record.createdAt, 'PPP p')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Updated</label>
                    <p className="text-sm">{format(record.updatedAt, 'PPP p')}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Description</label>
                  <p className="text-base mt-1">{record.description}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Content</label>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 mt-2 max-h-96 overflow-y-auto">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {record.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blockchain Tab */}
          <TabsContent value="blockchain">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Verification</CardTitle>
                <CardDescription>
                  {record.blockchain.isVerified
                    ? 'This record has been verified on the blockchain'
                    : 'This record is pending blockchain verification'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BlockchainInfo
                  transactionHash={record.blockchain.transactionHash}
                  blockNumber={record.blockchain.blockNumber}
                  network={record.blockchain.blockchainNetwork}
                  timestamp={record.blockchain.timestamp}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AuditTimeline entries={mockAuditEntries} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
