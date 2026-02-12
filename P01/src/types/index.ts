/* ============================================================================
   CORE DOMAIN TYPES
   ============================================================================ */

export type RecordCategory = 'birth_certificate' | 'property_deed' | 'legal_document' | 'license' | 'permit' | 'certificate' | 'other';
export type RecordStatus = 'draft' | 'pending' | 'verified' | 'rejected' | 'revoked';
export type UserRole = 'citizen' | 'authority' | 'admin';
export type ActionType = 'created' | 'updated' | 'verified' | 'deleted' | 'shared' | 'requested';

/* ============================================================================
   USER & AUTHENTICATION
   ============================================================================ */

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/* ============================================================================
   BLOCKCHAIN & RECORDS
   ============================================================================ */

export interface BlockchainVerification {
  isVerified: boolean;
  blockNumber: number;
  transactionHash: string;
  timestamp: Date;
  gasUsed?: string;
  blockchainNetwork: 'mainnet' | 'testnet';
}

export interface RecordAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface PublicRecord {
  id: string;
  recordId: string;
  title: string;
  category: RecordCategory;
  description: string;
  content: string;
  status: RecordStatus;
  ownerId: string;
  authorityId?: string;
  attachments: RecordAttachment[];
  blockchain: BlockchainVerification;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/* ============================================================================
   AUDIT TRAIL
   ============================================================================ */

export interface AuditEntry {
  id: string;
  recordId: string;
  action: ActionType;
  performedBy: string;
  performedByName: string;
  timestamp: Date;
  changesSummary: string;
  details?: Record<string, any>;
  transactionHash?: string;
  blockNumber?: number;
}

export interface AuditTrail {
  recordId: string;
  entries: AuditEntry[];
  totalCount: number;
}

/* ============================================================================
   DASHBOARD & STATISTICS
   ============================================================================ */

export interface DashboardStats {
  totalRecords: number;
  verifiedRecords: number;
  pendingRecords: number;
  totalAuthorities: number;
  verificationRate: number;
}

export interface RecordStats {
  date: Date;
  created: number;
  verified: number;
  rejected: number;
}

/* ============================================================================
   API RESPONSES
   ============================================================================ */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ============================================================================
   SEARCH & FILTER
   ============================================================================ */

export interface SearchFilters {
  category?: RecordCategory;
  status?: RecordStatus;
  dateFrom?: Date;
  dateTo?: Date;
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  authority?: string;
  searchQuery?: string;
}

export interface SearchResult {
  records: PublicRecord[];
  total: number;
  filters: SearchFilters;
}

/* ============================================================================
   NOTIFICATIONS
   ============================================================================ */

export type NotificationType = 'record_created' | 'record_verified' | 'record_updated' | 'record_shared' | 'access_granted';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedRecordId?: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

/* ============================================================================
   FORMS & REQUESTS
   ============================================================================ */

export interface RecordCreationForm {
  title: string;
  category: RecordCategory;
  description: string;
  content: string;
  attachments?: File[];
}

export interface AccessRequestForm {
  recordId: string;
  requesterEmail: string;
  reason: string;
  expiresIn?: number;
}
