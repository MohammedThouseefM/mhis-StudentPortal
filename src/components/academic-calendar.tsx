
'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Calendar as DayPicker } from '@/components/ui/calendar';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useCollegeData, type CalendarEventWithId } from '@/context/college-data-context';
import { studentDailyAttendanceHistory, type DailyAttendance } from '@/lib/mock-data';

const eventColors = {
  holiday: 'bg-green-500',
  exam: 'bg-red-500',
  assignment: 'bg-blue-500',
  event: 'bg-purple-500',
};

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

export function AcademicCalendar() {
  const { events } = useCollegeData();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEventWithId[]>);

  const selectedDayEvents = selectedDay ? eventsByDate[format(selectedDay, 'yyyy-MM-dd')] || [] : [];

  const attendanceByDate = studentDailyAttendanceHistory.reduce((acc, item) => {
    acc[item.date] = item.schedule;
    return acc;
  }, {} as Record<string, DailyAttendance[]>);

  const selectedDayAttendance = selectedDay ? attendanceByDate[format(selectedDay, 'yyyy-MM-dd')] : null;

  const modifiers = {
    event: Object.keys(eventsByDate).map(dateStr => parseISO(dateStr)),
    attendanceMarked: Object.keys(attendanceByDate).map(dateStr => parseISO(dateStr)),
  };

  const modifiersClassNames = {
    event: 'has-event',
    attendanceMarked: 'has-attendance'
  };

  const EventCell = (props: { date: Date }) => {
    const dateStr = format(props.date, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dateStr];
    const dayAttendance = attendanceByDate[dateStr];

    return (
      <>
        {format(props.date, 'd')}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5">
          {dayEvents && dayEvents.slice(0, 2).map((event, i) => (
            <div
              key={`event-${i}`}
              className={cn('h-1.5 w-1.5 rounded-full', eventColors[event.type])}
            />
          ))}
          {dayAttendance && (
            <div className="h-1.5 w-1.5 rounded-full bg-sky-500" title="Attendance Marked" />
          )}
        </div>
      </>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar /> Academic & Attendance Calendar
        </CardTitle>
        <CardDescription>
          View important dates, events, and your daily attendance. Click a date to see details.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
           <style>{`
            .has-event {
              position: relative;
            }
          `}</style>
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            components={{
              DayContent: EventCell,
            }}
            className="rounded-md border not-prose"
            disabled={{ after: new Date() }}
          />
           <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500"></span> Exam</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-500"></span> Assignment</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500"></span> Holiday</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-purple-500"></span> Event</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-sky-500"></span> Attendance Marked</div>
           </div>
        </div>
        <div className="md:col-span-1">
          <h3 className="font-semibold text-lg mb-4">
            Details for {selectedDay ? format(selectedDay, 'dd-MM-yyyy') : '...'}
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <div>
              <h4 className="font-medium text-base mb-2">Events</h4>
               {selectedDayEvents.length > 0 ? (
                <div className="space-y-4">
                {selectedDayEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-md border bg-card-foreground/5 flex items-start gap-3">
                    <span className={cn('mt-1 h-4 w-4 shrink-0 rounded-full', eventColors[event.type])} />
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                    </div>
                  </div>
                ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No events on this day.</p>
              )}
            </div>

            <Separator />
            
            <div>
              <h4 className="font-medium text-base mb-2">Daily Attendance</h4>
              {selectedDayAttendance ? (
                <div className="space-y-3">
                  {selectedDayAttendance.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-md bg-card-foreground/5">
                      <div className="font-medium text-sm">
                        <p>{item.hour}</p>
                        <p className="text-xs text-muted-foreground">{item.subject}</p>
                      </div>
                      <div className={cn("flex items-center gap-2 text-sm font-semibold capitalize", statusColors[item.status])}>
                        {statusIcons[item.status]}
                        <span>{item.status.replace('-', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Attendance not available for this day.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
