
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Award, Search, SlidersHorizontal, User, Save } from 'lucide-react';
import { useCollegeData } from '@/context/college-data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type Student, type SubjectResult } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function ResultManagementPage() {
    const { toast } = useToast();
    const currentTeacherId = 'TEACHER01';

    const { departments, years, students, studentResults, updateStudentResults } = useCollegeData();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
    const [editableResults, setEditableResults] = useState<SubjectResult[]>([]);
    
    const availableSemesters = useMemo(() => {
        if (!selectedStudent) return [];
        return studentResults[selectedStudent.id]?.map(r => r.semester) || [];
    }, [selectedStudent, studentResults]);

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearchTerm =
                !searchTerm ||
                student.name.toLowerCase().includes(searchLower) ||
                student.rollNumber.toLowerCase().includes(searchLower) ||
                student.university_number.toLowerCase().includes(searchLower);

            const matchesDepartment = !departmentFilter || student.department === departmentFilter;
            const matchesYear = !yearFilter || student.year === yearFilter;

            return matchesSearchTerm && matchesDepartment && matchesYear;
        });
    }, [searchTerm, departmentFilter, yearFilter, students]);

    useEffect(() => {
        if (selectedStudent) {
            const semesters = studentResults[selectedStudent.id]?.map(r => r.semester) || [];
            setSelectedSemester(semesters[0] || null);
        } else {
            setSelectedSemester(null);
            setEditableResults([]);
        }
    }, [selectedStudent, studentResults]);

    useEffect(() => {
        if (selectedStudent && selectedSemester) {
            const results = studentResults[selectedStudent.id]?.find(r => r.semester === selectedSemester)?.results || [];
            setEditableResults(JSON.parse(JSON.stringify(results)));
        } else {
            setEditableResults([]);
        }
    }, [selectedStudent, selectedSemester, studentResults]);

    const handleResultChange = (subjectCode: string, field: keyof SubjectResult, value: string | number) => {
        setEditableResults(currentResults =>
            currentResults.map(res => {
                if (res.subjectCode === subjectCode) {
                    const updatedRes = { ...res, [field]: value };
                    if (field === 'ciaMarks' || field === 'semesterMarks') {
                        updatedRes.totalMarks = (Number(updatedRes.ciaMarks) || 0) + (Number(updatedRes.semesterMarks) || 0);
                    }
                    return updatedRes;
                }
                return res;
            })
        );
    };

    const handleSaveChanges = (subjectCode: string) => {
        if (!selectedStudent || !selectedSemester) return;
        const resultToUpdate = editableResults.find(r => r.subjectCode === subjectCode);
        if (resultToUpdate) {
            updateStudentResults(selectedStudent.id, selectedSemester, subjectCode, resultToUpdate, currentTeacherId);
            toast({
                title: 'Result Updated',
                description: `Result for ${resultToUpdate.subjectName} has been saved.`,
            });
        }
    };

    return (
        <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><SlidersHorizontal /> Filter Students</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label htmlFor="student-search">Search by Name/ID</Label><Input id="student-search" placeholder="Enter name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Department</Label><Select value={departmentFilter} onValueChange={(value) => setDepartmentFilter(value === 'all' ? '' : value)}><SelectTrigger><SelectValue placeholder="All Departments" /></SelectTrigger><SelectContent><SelectItem value="all">All Departments</SelectItem>{departments.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Year</Label><Select value={yearFilter} onValueChange={(value) => setYearFilter(value === 'all' ? '' : value)}><SelectTrigger><SelectValue placeholder="All Years" /></SelectTrigger><SelectContent><SelectItem value="all">All Years</SelectItem>{years.map((y) => (<SelectItem key={y} value={y}>{y}</SelectItem>))}</SelectContent></Select></div>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader><CardTitle>Student List</CardTitle><CardDescription>Select a student to manage their results.</CardDescription></CardHeader>
                    <CardContent className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <button key={student.id} onClick={() => setSelectedStudent(student)}
                                    className={cn("w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors", selectedStudent?.id === student.id ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
                                    <Avatar className="h-10 w-10 border"><AvatarImage src={student.photoUrl || ''} alt={student.name} data-ai-hint="student portrait" /><AvatarFallback><User /></AvatarFallback></Avatar>
                                    <div>
                                        <p className="font-semibold">{student.name}</p>
                                        <p className={cn("text-sm", selectedStudent?.id === student.id ? "text-primary-foreground/80" : "text-muted-foreground")}>{student.department} - {student.year}</p>
                                    </div>
                                </button>
                            ))
                        ) : (<p className="text-center text-muted-foreground py-8">No students found.</p>)}
                    </CardContent>
                </Card>
            </div>
            
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Award /> Result Management</CardTitle>
                        {selectedStudent ? (
                            <div className="flex flex-col gap-4 mt-2 md:flex-row md:justify-between md:items-center">
                                <CardDescription>Editing results for {selectedStudent.name}.</CardDescription>
                                {availableSemesters.length > 0 && (
                                    <Select value={selectedSemester || ''} onValueChange={setSelectedSemester}>
                                        <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Select Semester" /></SelectTrigger>
                                        <SelectContent>{availableSemesters.map(sem => <SelectItem key={sem} value={sem}>{sem} Semester</SelectItem>)}</SelectContent>
                                    </Select>
                                )}
                            </div>
                        ) : (<CardDescription>Select a student from the list to begin.</CardDescription>)}
                    </CardHeader>
                    <CardContent>
                        {selectedStudent && selectedSemester ? (
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>CIA</TableHead><TableHead>Semester</TableHead><TableHead>Total</TableHead><TableHead>Grade</TableHead><TableHead>Result</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {editableResults.map(res => (
                                            <TableRow key={res.subjectCode}>
                                                <TableCell className="font-medium">{res.subjectName}<br/><span className="text-xs text-muted-foreground">{res.subjectCode}</span></TableCell>
                                                <TableCell><Input type="number" value={res.ciaMarks} onChange={e => handleResultChange(res.subjectCode, 'ciaMarks', e.target.value)} className="w-20" /></TableCell>
                                                <TableCell><Input type="number" value={res.semesterMarks} onChange={e => handleResultChange(res.subjectCode, 'semesterMarks', e.target.value)} className="w-20" /></TableCell>
                                                <TableCell className="font-bold">{res.totalMarks}</TableCell>
                                                <TableCell><Input value={res.grade} onChange={e => handleResultChange(res.subjectCode, 'grade', e.target.value)} className="w-16" /></TableCell>
                                                <TableCell>
                                                    <Select value={res.resultStatus} onValueChange={(value) => handleResultChange(res.subjectCode, 'resultStatus', value as 'Pass' | 'Fail')}>
                                                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                        <SelectContent><SelectItem value="Pass">Pass</SelectItem><SelectItem value="Fail">Fail</SelectItem></SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleSaveChanges(res.subjectCode)}><Save className="h-4 w-4 text-primary" /></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="h-96 flex items-center justify-center text-muted-foreground">
                                <p>{selectedStudent ? "Select a semester to view and edit results." : "Select a student to view and edit their results."}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
