
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Award, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCollegeData } from '@/context/college-data-context';
import { cn } from '@/lib/utils';
import Loading from '@/app/loading';

export default function ResultsPage() {
  const { studentResults, currentUser } = useCollegeData();
  
  if (!currentUser || !('university_number' in currentUser)) {
    return <Loading />;
  }
  const student = currentUser;
  
  const results = useMemo(() => studentResults[student.id] || [], [student.id, studentResults]);
  const availableSemesters = useMemo(() => results.map(r => r.semester), [results]);

  const [selectedSemester, setSelectedSemester] = useState<string | undefined>(
    availableSemesters.length > 0 ? availableSemesters[0] : undefined
  );

  const selectedResult = useMemo(() => {
    if (!selectedSemester) return null;
    return results.find(r => r.semester === selectedSemester) || null;
  }, [selectedSemester, results]);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/student/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Exam Results</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award />
              Semester Performance Report
            </CardTitle>
            <CardDescription>
              View your CIA and Final Exam results for each semester.
            </CardDescription>
          </div>
          <div className="w-full md:w-auto md:max-w-xs mt-4 md:mt-0">
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Semester" />
              </SelectTrigger>
              <SelectContent>
                {availableSemesters.length > 0 ? (
                  availableSemesters.map(sem => (
                    <SelectItem key={sem} value={sem}>
                      {sem} Semester
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No results available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {selectedResult ? (
          <CardContent>
            {/* GPA and Summary Card */}
            <Card className="bg-muted/50 mb-6">
              <CardHeader className="flex flex-row items-center justify-between p-4">
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">GPA (Grade Point Average)</p>
                    <p className="text-3xl font-bold">{selectedResult.gpa.toFixed(2)}</p>
                 </div>
                 <div className="space-y-1 text-right">
                    <p className="text-sm font-medium text-muted-foreground">Overall Result</p>
                    <Badge variant={selectedResult.overallResult === 'Pass' ? 'default' : 'destructive'} className="text-lg">
                        {selectedResult.overallResult}
                    </Badge>
                 </div>
              </CardHeader>
            </Card>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Code</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead className="text-center">CIA Marks</TableHead>
                    <TableHead className="text-center">Semester Marks</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-right">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedResult.results.map((res) => (
                    <TableRow key={res.subjectCode}>
                      <TableCell>{res.subjectCode}</TableCell>
                      <TableCell className="font-medium">{res.subjectName}</TableCell>
                      <TableCell className="text-center">{res.ciaMarks}</TableCell>
                      <TableCell className="text-center">{res.semesterMarks}</TableCell>
                      <TableCell className="text-center font-bold">{res.totalMarks}</TableCell>
                      <TableCell className="text-center">{res.grade}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            'flex items-center justify-end gap-2 font-semibold',
                            res.resultStatus === 'Pass'
                              ? 'text-green-600'
                              : 'text-destructive'
                          )}
                        >
                          {res.resultStatus === 'Pass' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          {res.resultStatus}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>
                {availableSemesters.length > 0 
                  ? 'Please select a semester to view your results.'
                  : 'Your results have not been published yet.'
                }
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
