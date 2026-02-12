import { useQuery } from '@tanstack/react-query';
import { Notification } from '@/types';

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user-1',
    type: 'record_verified',
    title: 'Record Verified',
    message: 'Your birth certificate has been verified',
    relatedRecordId: '1',
    read: false,
    createdAt: new Date(),
    actionUrl: '/records/1',
  },
  {
    id: '2',
    userId: 'user-1',
    type: 'record_updated',
    title: 'Record Updated',
    message: 'Property deed details have been updated',
    relatedRecordId: '2',
    read: false,
    createdAt: new Date(),
    actionUrl: '/records/2',
  },
];

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockNotifications;
    },
  });
}

export function useUnreadNotificationCount() {
  const { data: notifications } = useNotifications();
  return notifications?.filter((n) => !n.read).length ?? 0;
}
