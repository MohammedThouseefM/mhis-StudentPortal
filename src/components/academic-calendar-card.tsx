
'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { format, isAfter, parseISO } from 'date-fns';
import { useCollegeData } from '@/context/college-data-context';

function AcademicCalendarCardComponent() {
  const { events } = useCollegeData();

  const upcomingEvents = events
    .filter(event => isAfter(parseISO(event.date), new Date()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          <span>Academic Calendar</span>
        </CardTitle>
        <CardDescription>Upcoming events and deadlines.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
             <div key={event.id} className="text-sm p-3 rounded-md bg-card-foreground/5">
                <p className="font-semibold">{event.title}</p>
                <p className="text-muted-foreground">{format(parseISO(event.date), 'dd-MM-yyyy')}</p>
            </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">No upcoming events.</p>
          )}
        </div>
        <Button variant="outline" className="w-full mt-4" asChild>
          <Link href="/student/calendar">
            View Full Calendar <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export const AcademicCalendarCard = memo(AcademicCalendarCardComponent);
