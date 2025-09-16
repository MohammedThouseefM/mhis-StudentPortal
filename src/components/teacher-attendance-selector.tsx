
'use client';

import { useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCollegeData } from '@/context/college-data-context';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

function TeacherAttendanceSelectorComponent() {
  const router = useRouter();
  const [department, setDepartment] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [hour, setHour] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const { departments, years, hours } = useCollegeData();

  const handleTakeAttendance = () => {
    if (department && year && hour && date) {
      router.push(
        `/teacher/attendance?dept=${department}&year=${year}&hour=${hour}&date=${format(date, 'yyyy-MM-dd')}`
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark Attendance</CardTitle>
        <CardDescription>Select the class and date to mark attendance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Hour</Label>
            <Select value={hour} onValueChange={setHour}>
              <SelectTrigger>
                <SelectValue placeholder="Select Hour" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd-MM-yyyy') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button
          onClick={handleTakeAttendance}
          disabled={!department || !year || !hour || !date}
          className="w-full bg-accent hover:bg-accent/90"
        >
          Take Attendance
        </Button>
      </CardContent>
    </Card>
  );
}

export const TeacherAttendanceSelector = memo(TeacherAttendanceSelectorComponent);
