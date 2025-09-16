
'use client';

import { useState, useEffect } from 'react';
import { useCollegeData } from '@/context/college-data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClipboardEdit, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Exam } from '@/lib/mock-data';
import { nanoid } from 'nanoid';

export default function ExamScheduleEditorPage() {
  const { departments, years, examTimeTable, updateExamTimeTable } = useCollegeData();
  const { toast } = useToast();
  const currentTeacherId = 'TEACHER01';

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [editableSchedule, setEditableSchedule] = useState<Exam[] | null>(null);

  useEffect(() => {
    if (selectedDept && selectedYear) {
      // Deep copy to prevent direct state mutation
      const schedule = examTimeTable[selectedDept]?.[selectedYear] || [];
      setEditableSchedule(JSON.parse(JSON.stringify(schedule)));
    } else {
      setEditableSchedule(null);
    }
  }, [selectedDept, selectedYear, examTimeTable]);

  const handleScheduleChange = (examId: string, field: keyof Omit<Exam, 'id'>, value: string) => {
    if (!editableSchedule) return;
    setEditableSchedule(
      editableSchedule.map((exam) =>
        exam.id === examId ? { ...exam, [field]: value } : exam
      )
    );
  };

  const handleAddExam = () => {
    if (!editableSchedule) return;
    const newExam: Exam = {
      id: nanoid(),
      subjectCode: '',
      subject: '',
      date: '',
      time: '',
    };
    setEditableSchedule([...editableSchedule, newExam]);
  };

  const handleRemoveExam = (examId: string) => {
    if (!editableSchedule) return;
    setEditableSchedule(editableSchedule.filter((exam) => exam.id !== examId));
  };

  const handleSaveChanges = () => {
    if (selectedDept && selectedYear && editableSchedule) {
      // Basic validation
      if (editableSchedule.some(e => !e.subjectCode || !e.subject || !e.date || !e.time)) {
          toast({ variant: 'destructive', title: 'Incomplete Details', description: 'Please fill out all fields for each exam entry.' });
          return;
      }
      updateExamTimeTable(selectedDept, selectedYear, editableSchedule, currentTeacherId);
      toast({
        title: 'Schedule Saved',
        description: `Exam timetable for ${selectedDept} - ${selectedYear} has been updated.`,
      });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardEdit className="h-6 w-6" /> Exam Timetable Editor
          </CardTitle>
          <CardDescription>
            Create and manage exam schedules for different classes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <Label>Department</Label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {editableSchedule ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject Code</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date (YYYY-MM-DD)</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editableSchedule.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>
                          <Input
                            value={exam.subjectCode}
                            onChange={(e) => handleScheduleChange(exam.id, 'subjectCode', e.target.value)}
                            placeholder="e.g., BCA301"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={exam.subject}
                            onChange={(e) => handleScheduleChange(exam.id, 'subject', e.target.value)}
                            placeholder="e.g., Data Structures"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={exam.date}
                            onChange={(e) => handleScheduleChange(exam.id, 'date', e.target.value)}
                            placeholder="e.g., 2024-11-10"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={exam.time}
                            onChange={(e) => handleScheduleChange(exam.id, 'time', e.target.value)}
                            placeholder="e.g., 10AM - 1PM"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveExam(exam.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleAddExam}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Exam
                </Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Select a department and year to manage the exam schedule.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
