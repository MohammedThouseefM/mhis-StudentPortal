'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { students, previousAttendanceData } from '@/lib/mock-data';
import { useMemo } from 'react';
import { Trophy, TrendingDown } from 'lucide-react';

type ClassAttendance = {
  name: string;
  department: string;
  year: string;
  attendance: number;
};

// Helper function to calculate attendance percentage for a single student
const calculateStudentAttendance = (studentId: string) => {
  const records = previousAttendanceData.filter(r => r.studentId === studentId);
  if (records.length === 0) return { present: 0, total: 0 };
  const present = records.filter(r => r.attendanceStatus === 'present').length;
  return { present, total: records.length };
};

export function DepartmentAnalytics() {

  const analyticsData = useMemo(() => {
    const classAttendanceMap = new Map<string, { present: number; total: number; studentCount: number }>();

    students.forEach(student => {
      const className = `${student.department} - ${student.year}`;
      if (!classAttendanceMap.has(className)) {
        classAttendanceMap.set(className, { present: 0, total: 0, studentCount: 0 });
      }

      const { present, total } = calculateStudentAttendance(student.id);
      const classData = classAttendanceMap.get(className)!;
      classData.present += present;
      classData.total += total;
      classData.studentCount++;
    });

    const departmentAttendanceMap = new Map<string, { present: number; total: number }>();
    const classes: ClassAttendance[] = [];

    classAttendanceMap.forEach((data, className) => {
      const [department, year] = className.split(' - ');
      if (!departmentAttendanceMap.has(department)) {
        departmentAttendanceMap.set(department, { present: 0, total: 0 });
      }
      const deptData = departmentAttendanceMap.get(department)!;
      deptData.present += data.present;
      deptData.total += data.total;

      const attendance = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0;
      classes.push({ name: className, department, year, attendance });
    });

    const departmentChartData = Array.from(departmentAttendanceMap.entries()).map(([department, data]) => ({
      name: department,
      attendance: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
    }));
    
    classes.sort((a, b) => b.attendance - a.attendance);

    const bestClass = classes.length > 0 ? classes[0] : null;
    const worstClass = classes.length > 0 ? classes[classes.length - 1] : null;

    return { departmentChartData, bestClass, worstClass };
  }, []);
  
  const chartConfig = {
    attendance: {
      label: 'Attendance',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Department-wise Average Attendance</CardTitle>
          <CardDescription>A comparison of average attendance across all departments.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={analyticsData.departmentChartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} unit="%" />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="attendance" fill="var(--color-attendance)" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center gap-4 space-y-0">
             <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
                <CardTitle>Top Performing Class</CardTitle>
                <CardDescription>Class with the highest attendance percentage.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-2xl font-bold">{analyticsData.bestClass?.name || 'N/A'}</p>
            <p className="text-5xl font-extrabold text-green-600 mt-2">{analyticsData.bestClass?.attendance || 0}%</p>
          </CardContent>
        </Card>
         <Card className="flex flex-col">
          <CardHeader className="flex-row items-center gap-4 space-y-0">
             <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div>
                <CardTitle>Lowest Performing Class</CardTitle>
                <CardDescription>Class with the lowest attendance percentage.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-2xl font-bold">{analyticsData.worstClass?.name || 'N/A'}</p>
            <p className="text-5xl font-extrabold text-destructive mt-2">{analyticsData.worstClass?.attendance || 0}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
