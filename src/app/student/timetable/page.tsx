
'use client';

import { ArrowLeft, CalendarDays } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { defaultTimetable } from '@/lib/mock-data';
import { useCollegeData } from '@/context/college-data-context';
import Loading from '@/app/loading';

const daysOfWeek = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];

export default function TimetablePage() {
  const { timeTable, hours, currentUser } = useCollegeData();
  
  if (!currentUser || !('university_number' in currentUser)) {
    return <Loading />;
  }
  const student = currentUser;
  const studentTimetable = timeTable[student.department]?.[student.year] || defaultTimetable;

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/student/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Class Timetable</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays /> Weekly Schedule for {student.department} - {student.year}
          </CardTitle>
          <CardDescription>Your class schedule for the week.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Day</TableHead>
                  {hours.map((hour, index) => (
                    <TableHead key={index}>{hour}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {daysOfWeek.map((day) => (
                  <TableRow key={day}>
                    <TableCell className="font-medium">{day}</TableCell>
                    {(studentTimetable[day] || []).map((subject, index) => (
                      <TableCell key={index}>{subject}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
