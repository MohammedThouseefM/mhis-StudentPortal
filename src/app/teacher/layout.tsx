
'use client';

import { type PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { teacherNavItems } from '@/lib/nav-links';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { useToast } from '@/hooks/use-toast';
import { useCollegeData } from '@/context/college-data-context';
import Loading from '@/app/loading';

export default function TeacherLayout({ children }: PropsWithChildren) {
  const isOnline = useOnlineStatus();
  const { toast } = useToast();
  const { currentUser } = useCollegeData();
  const router = useRouter();

  useEffect(() => {
    // This effect checks for a valid logged-in user.
    // A small timeout allows the context to hydrate from localStorage on the client.
    const timer = setTimeout(() => {
      if (!currentUser || ('university_number' in currentUser)) {
        router.push('/');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

  useEffect(() => {
    const syncOfflineData = async () => {
      try {
        const pendingKeysJson = localStorage.getItem('pending-attendance-syncs');
        if (!pendingKeysJson) return;

        const pendingKeys: string[] = JSON.parse(pendingKeysJson);
        if (pendingKeys.length === 0) return;

        toast({
          title: 'Reconnected to Internet',
          description: `Syncing ${pendingKeys.length} offline attendance record(s)...`,
        });

        // In a real app, this would loop through keys and make API calls.
        // For this demo, we'll just log the data and clear localStorage.
        let successCount = 0;
        for (const key of pendingKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            console.log(`[SYNCING] Data for key ${key}:`, JSON.parse(data));
            // Simulate successful sync by removing the item
            localStorage.removeItem(key);
            successCount++;
          }
        }

        // Clear the list of pending syncs
        localStorage.removeItem('pending-attendance-syncs');

        toast({
          title: 'Sync Complete!',
          description: `${successCount} offline record(s) have been successfully synced.`,
        });
      } catch (error) {
        console.error("Failed to sync offline data:", error);
        toast({
          variant: "destructive",
          title: 'Sync Failed',
          description: 'There was an error syncing your offline data.',
        });
      }
    };

    if (isOnline) {
      syncOfflineData();
    }
  }, [isOnline, toast]);
  
  if (!currentUser || ('university_number' in currentUser)) {
    return <Loading />;
  }

  return (
    <AppLayout navItems={teacherNavItems} userType="Teacher" user={currentUser}>
      {children}
    </AppLayout>
  );
}
