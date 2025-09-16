
'use client';

import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, HelpCircle, CalendarCheck } from 'lucide-react';
import { dailyAttendanceData } from '@/lib/mock-data';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const statusIcons = {
  present: <CheckCircle className="h-5 w-5 text-green-500" />,
  absent: <XCircle className="h-5 w-5 text-red-500" />,
  'not-marked': <HelpCircle className="h-5 w-5 text-gray-400" />,
};

const statusColors = {
    present: 'text-green-600 dark:text-green-400',
    absent: 'text-red-600 dark:text-red-400',
    'not-marked': 'text-muted-foreground',
}

function DailyAttendanceCardComponent() {
  const today = format(new Date(), 'dd-MM-yyyy');
  // In a real app, you'd fetch this for the current day for the logged in student
  const attendance = dailyAttendanceData; 

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-6 w-6" />
            <span>Today's Attendance</span>
        </CardTitle>
        <CardDescription>{today}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {attendance.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-md bg-card-foreground/5">
              <div className="font-medium">
                <p>{item.hour}</p>
                <p className="text-sm text-muted-foreground">{item.subject}</p>
              </div>
              <div className={cn("flex items-center gap-2 text-sm font-semibold capitalize", statusColors[item.status])}>
                {statusIcons[item.status]}
                <span>{item.status.replace('-', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const DailyAttendanceCard = memo(DailyAttendanceCardComponent);
