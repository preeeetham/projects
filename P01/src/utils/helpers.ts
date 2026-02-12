import { PublicRecord, RecordCategory, RecordStatus } from '@/types';

export function formatRecordCategory(category: RecordCategory): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatRecordStatus(status: RecordStatus): string {
  const statusMap: Record<RecordStatus, string> = {
    draft: 'Draft',
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected',
    revoked: 'Revoked',
  };
  return statusMap[status];
}

export function truncateHash(hash: string, startChars = 10, endChars = 8): string {
  if (hash.length <= startChars + endChars) return hash;
  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
}

export function getRecordTypeIcon(category: RecordCategory): string {
  const icons: Record<RecordCategory, string> = {
    birth_certificate: '👶',
    property_deed: '🏠',
    legal_document: '⚖️',
    license: '🎫',
    permit: '📋',
    certificate: '🏆',
    other: '📄',
  };
  return icons[category];
}

export function filterRecords(
  records: PublicRecord[],
  filters: {
    category?: RecordCategory;
    status?: RecordStatus;
    verified?: boolean;
    searchQuery?: string;
  }
): PublicRecord[] {
  return records.filter((record) => {
    if (
      filters.category &&
      record.category !== filters.category
    ) {
      return false;
    }
    if (filters.status && record.status !== filters.status) {
      return false;
    }
    if (
      filters.verified !== undefined &&
      record.blockchain.isVerified !== filters.verified
    ) {
      return false;
    }
    if (
      filters.searchQuery &&
      !record.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !record.recordId.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
}

export function downloadFile(content: string, filename: string, mimeType = 'application/json') {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`
  );
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
