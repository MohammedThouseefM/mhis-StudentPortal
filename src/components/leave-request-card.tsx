
'use client';

import { memo } from 'react';
import Link from 'next/link';
import { CalendarPlus, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCollegeData } from '@/context/college-data-context';
import { format, parseISO } from 'date-fns';

function LeaveRequestCardComponent() {
  const { leaveRequests, currentUser } = useCollegeData();
  
  if (!currentUser || !('university_number' in currentUser)) {
    return null; // Or a loading skeleton
  }
  const studentId = currentUser.id;

  const studentLeaveRequests = leaveRequests
    .filter(req => req.studentId === studentId)
    .slice(0, 3);
  
  const statusVariant = {
    pending: 'secondary' as const,
    approved: 'default' as const,
    rejected: 'destructive' as const,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarPlus className="h-6 w-6" />
          <span>Leave Requests</span>
        </CardTitle>
        <CardDescription>Manage your leave applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {studentLeaveRequests.length > 0 ? (
            studentLeaveRequests.map((request) => (
             <div key={request.id} className="text-sm p-3 rounded-md bg-card-foreground/5 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{format(parseISO(request.startDate), 'dd-MM-yyyy')} - {format(parseISO(request.endDate), 'dd-MM-yyyy')}</p>
                  <p className="text-muted-foreground truncate max-w-[150px]">{request.reason}</p>
                </div>
                <Badge variant={statusVariant[request.status]} className="capitalize">{request.status}</Badge>
            </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">No recent leave requests.</p>
          )}
        </div>
        <Button variant="outline" className="w-full mt-4" asChild>
          <Link href="/student/leave">
            Manage All Leave Requests <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export const LeaveRequestCard = memo(LeaveRequestCardComponent);
