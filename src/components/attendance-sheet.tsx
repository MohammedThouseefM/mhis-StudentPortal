'use client';

import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, Wifi, WifiOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { useCollegeData } from '@/context/college-data-context';

type AttendanceStatus = 'present' | 'absent';
export type AttendanceState = Record<string, { status: AttendanceStatus }>;

type AttendanceSheetProps = {
  classDetails: {
    department: string;
    year: string;
    subject: string; // This is the 'hour' from the selector
    date: string;
  };
};

export function AttendanceSheet({ classDetails }: AttendanceSheetProps) {
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const { saveAttendance, students } = useCollegeData();

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.department === classDetails.department &&
        student.year === classDetails.year
    );
  }, [classDetails.department, classDetails.year, students]);

  useEffect(() => {
    const initialState: AttendanceState = {};
    filteredStudents.forEach((student) => {
      initialState[student.id] = { status: 'present' };
    });
    setAttendance(initialState);
  }, [filteredStudents]);

  const handleStatusChange = (studentId: string, newStatus: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { status: newStatus ? 'present' : 'absent' },
    }));
  };

  const handleSave = () => {
    // In a real app, user would come from auth session
    const teacherId = 'TEACHER01';
    saveAttendance(classDetails, attendance, teacherId, isOnline);

    if (isOnline) {
      toast({
        title: 'Attendance Saved!',
        description: 'The attendance has been successfully recorded.',
      });
    } else {
      toast({
        title: 'Attendance Saved Offline',
        description: 'This will be synced automatically when you are back online.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Attendance for {classDetails.subject}</CardTitle>
            <CardDescription>
              {classDetails.department} - {classDetails.year} | Date: {classDetails.date}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
             <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full ${isOnline ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Mark Present</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const studentAttendance = attendance[student.id];
                  if (!studentAttendance) return null; // Guard if state isn't synced
                  const { status } = studentAttendance;

                  return (
                    <TableRow key={student.id}>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-center">
                        {status === 'present' ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" /> Present
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600">
                            <XCircle className="h-4 w-4" /> Absent
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Switch
                            checked={status === 'present'}
                            onCheckedChange={(checked) => handleStatusChange(student.id, checked)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No students found for this class.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Save Attendance</Button>
        </div>
      </CardContent>
    </Card>
  );
}
