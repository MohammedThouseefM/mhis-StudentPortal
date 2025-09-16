
'use client';

import { useState, useEffect } from 'react';
import { CalendarClock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { type ClassTimeTable, defaultTimetable } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollegeData } from '@/context/college-data-context';

const daysOfWeek = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];

export default function TimetablePage() {
    const { toast } = useToast();
    const currentTeacherId = 'TEACHER01';
    
    const { 
        timeTable, updateTimeTable,
        departments, years, hours
    } = useCollegeData();

    const [selectedDept, setSelectedDept] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [editableTimetable, setEditableTimetable] = useState<ClassTimeTable | null>(null);

    useEffect(() => {
        if (selectedDept && selectedYear) {
            setEditableTimetable(JSON.parse(JSON.stringify(timeTable[selectedDept]?.[selectedYear] || defaultTimetable)));
        } else {
            setEditableTimetable(null);
        }
    }, [selectedDept, selectedYear, timeTable]);
    
    const handleTimetableChange = (day: string, hourIndex: number, value: string) => {
        if (!editableTimetable) return;
        const newTimetable = { ...editableTimetable };
        if (!newTimetable[day]) { newTimetable[day] = []; }
        const newDaySchedule = [...newTimetable[day]];
        newDaySchedule[hourIndex] = value;
        setEditableTimetable({ ...newTimetable, [day]: newDaySchedule });
    };

    const handleSaveTimetable = () => {
        if (selectedDept && selectedYear && editableTimetable) {
            updateTimeTable(selectedDept, selectedYear, editableTimetable, currentTeacherId);
            toast({ title: 'Timetable Saved', description: `Timetable for ${selectedDept} - ${selectedYear} has been updated.` });
        }
    };

    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarClock className="h-6 w-6" /> Timetable Editor</CardTitle>
                    <CardDescription>Select a class to view and edit the weekly timetable.</CardDescription>
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

                    {editableTimetable ? (
                        <div className="space-y-4">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Day</TableHead>
                                            {hours.map(h => <TableHead key={h}>{h}</TableHead>)}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {daysOfWeek.map((day) => (
                                            <TableRow key={day}>
                                                <TableCell className="font-medium">{day}</TableCell>
                                                {hours.map((_, hourIndex) => (
                                                    <TableCell key={hourIndex}>
                                                        <Input
                                                            value={editableTimetable[day]?.[hourIndex] || ''}
                                                            onChange={(e) => handleTimetableChange(day, hourIndex, e.target.value)}
                                                            className="h-8"
                                                        />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <Button onClick={handleSaveTimetable} className="w-full md:w-auto">Save Timetable</Button>
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">Select a department and year to edit the timetable.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
