'use client';

import { memo } from 'react';
import { AlertTriangle, BarChart3, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import type { studentAttendance, Student } from '@/lib/mock-data';
import { Separator } from './ui/separator';

type StudentAttendanceSummaryProps = {
  student: Student;
  attendanceData: typeof studentAttendance;
  showLowAttendanceWarning?: boolean;
}

function StudentAttendanceSummaryComponent({ student, attendanceData, showLowAttendanceWarning = false }: StudentAttendanceSummaryProps) {
  const chartConfig = {
    present: {
      label: 'Present',
      color: 'hsl(var(--primary))',
    },
    total: {
      label: 'Total',
      color: 'hsl(var(--secondary))',
    },
  };

  const isLowAttendance = attendanceData.totalPercentage < 75;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Attendance Report
        </CardTitle>
        <CardDescription>A comprehensive summary of your attendance records.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showLowAttendanceWarning && isLowAttendance && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Low Attendance Warning</AlertTitle>
            <AlertDescription>
              Your overall attendance is below 75%. A fine of 1000rs may be applicable. Please contact your academic advisor.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Overall Section */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">Overall Attendance</p>
            <div className={`text-6xl font-bold ${isLowAttendance ? 'text-destructive' : 'text-primary'}`}>
              {attendanceData.totalPercentage}%
            </div>
            <Progress value={attendanceData.totalPercentage} className="w-3/4" />
        </div>
        
        <Separator />
        
        {/* Subject-wise Section */}
        <div>
            <h3 className="text-lg font-semibold mb-4">Subject-wise Breakdown</h3>
            <div className="space-y-4">
            {attendanceData.subjects.map((subject) => (
              <div key={subject.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{subject.name}</span>
                  <span className="text-sm text-muted-foreground">{subject.percentage}%</span>
                </div>
                <Progress value={subject.percentage} />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Monthly Trend Section */}
        <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Trend
            </h3>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={attendanceData.monthly} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="present" fill="var(--color-present)" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
        </div>

      </CardContent>
    </Card>
  );
}

export const StudentAttendanceSummary = memo(StudentAttendanceSummaryComponent);
