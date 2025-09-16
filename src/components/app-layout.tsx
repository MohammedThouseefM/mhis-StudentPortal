
'use client';

import { type PropsWithChildren, memo } from 'react';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import type { NavItem } from '@/lib/nav-links';
import type { Student, Teacher } from '@/lib/mock-data';

type AppLayoutProps = {
  navItems: NavItem[];
  userType: 'Student' | 'Teacher';
  user: Student | Teacher;
};

function AppLayoutComponent({ children, navItems, userType, user }: PropsWithChildren<AppLayoutProps>) {
  return (
    <SidebarProvider>
      <AppSidebar navItems={navItems} userType={userType} user={user} />
      <SidebarInset>
          <DashboardHeader userType={userType} />
          {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export const AppLayout = memo(AppLayoutComponent);
