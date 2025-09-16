
'use client';

import { useState } from 'react';
import { PlusCircle, X, ClipboardEdit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCollegeData } from '@/context/college-data-context';

export default function AcademicStructurePage() {
    const { toast } = useToast();
    const currentTeacherId = 'TEACHER01';
    
    const [newDepartment, setNewDepartment] = useState('');
    const [newYear, setNewYear] = useState('');
    const [newHour, setNewHour] = useState('');
    
    const {
        departments, addDepartment, deleteDepartment,
        years, addYear, deleteYear,
        hours, addHour, deleteHour,
    } = useCollegeData();

    const handleAddDepartmentSubmit = () => { if (newDepartment) { addDepartment(newDepartment, currentTeacherId); setNewDepartment(''); toast({ title: 'Department Added' }); } };
    const handleAddYearSubmit = () => { if (newYear) { addYear(newYear, currentTeacherId); setNewYear(''); toast({ title: 'Year Added' }); } };
    const handleAddHourSubmit = () => { if (newHour) { addHour(newHour, currentTeacherId); setNewHour(''); toast({ title: 'Hour Added' }); } };

    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ClipboardEdit className="h-6 w-6" /> Academic Structure</CardTitle>
                    <CardDescription>Define the core academic structure of the college, including departments, years, and class hours.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-8 pt-4">
                        <div className="space-y-4 p-4 border rounded-lg">
                            <Label className="font-semibold text-lg">Departments</Label>
                            <div className="flex flex-wrap gap-2 min-h-16">
                                {departments.map(dept => (
                                    <div key={dept} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm h-fit">
                                        <span>{dept}</span>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button className="flex items-center justify-center h-4 w-4 rounded-full bg-secondary-foreground/20 text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"><X className="h-3 w-3" /></button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>Deleting "{dept}" will remove it from the list of available departments.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteDepartment(dept, currentTeacherId)}>Delete</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2"><Label htmlFor="new-department">Add New Department</Label><div className="flex gap-2"><Input id="new-department" value={newDepartment} onChange={e => setNewDepartment(e.target.value)} placeholder="e.g., B.Tech"/><Button onClick={handleAddDepartmentSubmit}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button></div></div>
                        </div>
                        <div className="space-y-4 p-4 border rounded-lg">
                            <Label className="font-semibold text-lg">Years</Label>
                            <div className="flex flex-wrap gap-2 min-h-16">
                                {years.map(year => (
                                    <div key={year} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm h-fit">
                                        <span>{year}</span>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button className="flex items-center justify-center h-4 w-4 rounded-full bg-secondary-foreground/20 text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"><X className="h-3 w-3" /></button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>Deleting "{year}" will remove it from the list of available years.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteYear(year, currentTeacherId)}>Delete</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2"><Label htmlFor="new-year">Add New Year</Label><div className="flex gap-2"><Input id="new-year" value={newYear} onChange={e => setNewYear(e.target.value)} placeholder="e.g., 4th Year"/><Button onClick={handleAddYearSubmit}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button></div></div>
                        </div>
                        <div className="space-y-4 p-4 border rounded-lg">
                            <Label className="font-semibold text-lg">Class Hours</Label>
                            <div className="flex flex-wrap gap-2 min-h-16">
                                {hours.map(hour => (
                                    <div key={hour} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm h-fit">
                                        <span>{hour}</span>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button className="flex items-center justify-center h-4 w-4 rounded-full bg-secondary-foreground/20 text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"><X className="h-3 w-3" /></button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>Deleting "{hour}" will remove it from the list of available class hours.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteHour(hour, currentTeacherId)}>Delete</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2"><Label htmlFor="new-hour">Add New Hour</Label><div className="flex gap-2"><Input id="new-hour" value={newHour} onChange={e => setNewHour(e.target.value)} placeholder="e.g., 6th Hour"/><Button onClick={handleAddHourSubmit}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button></div></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
