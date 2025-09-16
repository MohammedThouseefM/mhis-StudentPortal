
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeaveManagement } from '@/components/leave-management';
import { Button } from '@/components/ui/button';

export default function LeavePage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/student/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Leave Management</h1>
      </div>
      <LeaveManagement />
    </div>
  );
}
