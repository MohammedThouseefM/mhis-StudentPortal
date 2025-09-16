
'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/lib/nav-links';
import Link from 'next/link';
import type { Student, Teacher } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';

type AppSidebarProps = {
  navItems: NavItem[];
  userType: 'Student' | 'Teacher';
  user: Student | Teacher;
};

function AppSidebarComponent({ navItems, userType, user }: AppSidebarProps) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  const isStudent = 'university_number' in user;
  const userName = user?.name;
  const userId = isStudent ? `Univ. No: ${user.university_number}` : `Staff ID: ${user.id}`;
  const userAvatarUrl = isStudent ? user.photoUrl : undefined;
  const avatarHint = isStudent ? 'student portrait' : 'teacher portrait';

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarHeader>
        {!isMobile && <SidebarTrigger />}
      </SidebarHeader>
      <SidebarContent>
        {user && (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
                <Avatar className="h-20 w-20 border-2 border-primary group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 transition-all duration-300">
                    <AvatarImage src={userAvatarUrl} alt={userName || 'User'} data-ai-hint={avatarHint} />
                    <AvatarFallback>
                       <User className="h-10 w-10 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 transition-all duration-300" />
                    </AvatarFallback>
                </Avatar>
                <div className="group-data-[collapsible=icon]:hidden">
                    <p className="font-semibold">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userId}</p>
                </div>
            </div>
        )}
        <Separator className="mx-2 mb-2 w-auto group-data-[collapsible=icon]:hidden" />
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.tooltip, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export const AppSidebar = memo(AppSidebarComponent);
