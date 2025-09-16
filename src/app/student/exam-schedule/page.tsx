
'use client';

import Link from 'next/link';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { useCollegeData } from '@/context/college-data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import Loading from '@/app/loading';

export default function ExamSchedulePage() {
  const { examTimeTable, currentUser } = useCollegeData();
  
  if (!currentUser || !('university_number' in currentUser)) {
    return <Loading />;
  }
  const student = currentUser;

  const schedule = examTimeTable[student.department]?.[student.year] || [];

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/student/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Exam Schedule</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList />
            Final Exam Timetable for {student.department} - {student.year}
          </CardTitle>
          <CardDescription>
            Please check the date, time, and subject for your upcoming exams carefully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject Code</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.length > 0 ? (
                  schedule.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{format(parseISO(exam.date), 'dd-MM-yyyy')}</TableCell>
                      <TableCell>{exam.subjectCode}</TableCell>
                      <TableCell>{exam.subject}</TableCell>
                      <TableCell>{exam.time}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Exam schedule has not been published yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
