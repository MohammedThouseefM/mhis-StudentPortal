
'use client';

import { memo } from 'react';
import { LogOut, School, User, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { ModeToggle } from './mode-toggle';
import { useCollegeData } from '@/context/college-data-context';
import { Student } from '@/lib/mock-data';

type DashboardHeaderProps = {
  userType: 'Student' | 'Teacher';
};

function DashboardHeaderComponent({ userType }: DashboardHeaderProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { logout, currentUser } = useCollegeData();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const goToProfile = () => {
    router.push('/student/profile');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        {isMobile && <SidebarTrigger />}
        <Link href="/" className="hidden items-center space-x-2 md:flex">
            <School className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary sm:inline-block">AttendEase</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={(currentUser as Student)?.photoUrl || `https://placehold.co/100x100.png`} alt="User avatar" data-ai-hint="user avatar" />
                <AvatarFallback>
                  <UserCircle />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser && 'email' in currentUser ? currentUser.email : userType}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userType === 'Student' && (
              <DropdownMenuItem onClick={goToProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export const DashboardHeader = memo(DashboardHeaderComponent);
