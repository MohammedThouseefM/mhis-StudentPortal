
'use client';

import { type PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { studentNavItems } from '@/lib/nav-links';
import { useCollegeData } from '@/context/college-data-context';
import Loading from '@/app/loading';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/components/ui/sidebar';

export default function StudentLayout({ children }: PropsWithChildren) {
  const { currentUser } = useCollegeData();
  const router = useRouter();

  useEffect(() => {
    // This effect checks for a valid logged-in user.
    // A small timeout allows the context to hydrate from localStorage on the client.
    const timer = setTimeout(() => {
      if (!currentUser || !('university_number' in currentUser)) {
        router.push('/');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

  // Render a loading state while we verify the user session.
  // This prevents a brief flash of the dashboard before redirection.
  if (!currentUser || !('university_number' in currentUser)) {
    return <Loading />;
  }
  
  return (
    <AppLayout navItems={studentNavItems} userType="Student" user={currentUser}>
      {children}
    </AppLayout>
  );
}
