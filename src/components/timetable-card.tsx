
'use client';

import { memo } from 'react';
import Link from 'next/link';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { defaultTimetable } from '@/lib/mock-data';
import { useCollegeData } from '@/context/college-data-context';

function TimetableCardComponent() {
  const { timeTable, hours, currentUser } = useCollegeData();
  
  if (!currentUser || !('university_number' in currentUser)) {
    return null;
  }
  const student = currentUser;

  const getTodayKey = () => {
    const dayIndex = new Date().getDay(); // Sunday - 0, Monday - 1, etc.
    switch (dayIndex) {
      case 1: return 'D1'; // Monday
      case 2: return 'D2'; // Tuesday
      case 3: return 'D3'; // Wednesday
      case 4: return 'D4'; // Thursday
      case 5: return 'D5'; // Friday
      case 6: return 'D6'; // Saturday
      default: return 'D1'; // Sunday defaults to D1
    }
  };

  const today = getTodayKey();
  
  const studentTimetable = timeTable[student.department]?.[student.year] || defaultTimetable;

  // Fallback to D1 if today is not in timetable or no schedule for today
  const todaySchedule = studentTimetable[today] || studentTimetable['D1'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6" />
          <span>Today's Schedule ({today})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {todaySchedule.map((subject, index) => (
             <div key={index} className="text-sm p-2 rounded-md bg-card-foreground/5">
                <span className="font-medium">{`${hours[index] || `Hour ${index + 1}`}: `}</span>
                <span className="text-muted-foreground">{subject}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4" asChild>
          <Link href="/student/timetable">
            View Full Timetable <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export const TimetableCard = memo(TimetableCardComponent);
