
'use client';

import { useState, useMemo, useEffect } from 'react';
import { DollarSign, Search, SlidersHorizontal, User, Save } from 'lucide-react';
import { useCollegeData, type SemesterFee } from '@/context/college-data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type Student } from '@/lib/mock-data';
import { parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

export default function FeeManagementPage() {
    const { toast } = useToast();
    const currentTeacherId = 'TEACHER01';

    const { departments, years, students, studentFeeDetails, updateStudentFeeDetails } = useCollegeData();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [editableFees, setEditableFees] = useState<SemesterFee[]>([]);

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
            // Deep copy to prevent direct mutation of context state
            const fees = JSON.parse(JSON.stringify(studentFeeDetails[selectedStudent.id] || []));
            setEditableFees(fees);
        } else {
            setEditableFees([]);
        }
    }, [selectedStudent, studentFeeDetails]);

    const handleFeeChange = (semester: string, field: 'totalFee' | 'paid', value: string) => {
        const numericValue = Number(value) || 0;
        setEditableFees(currentFees => 
            currentFees.map(fee => {
                if (fee.semester === semester) {
                    const updatedFee = { ...fee, [field]: numericValue };
                    // Recalculate balance and status
                    const balance = updatedFee.totalFee - updatedFee.paid;
                    const status = balance <= 0 ? 'Paid' : (new Date() > parseISO(updatedFee.dueDate) ? 'Overdue' : 'Pending');
                    return { ...updatedFee, balance, status };
                }
                return fee;
            })
        );
    };

    const handleSaveChanges = (semester: string) => {
        if (!selectedStudent) return;
        const feeToUpdate = editableFees.find(f => f.semester === semester);
        if (feeToUpdate) {
            updateStudentFeeDetails(selectedStudent.id, semester, { paid: feeToUpdate.paid, totalFee: feeToUpdate.totalFee }, currentTeacherId);
            toast({
                title: 'Fees Updated',
                description: `Fee details for ${selectedStudent.name}'s ${semester} semester have been saved.`,
            });
        }
    };

    const statusVariant = {
        Paid: 'default' as const,
        Pending: 'secondary' as const,
        Overdue: 'destructive' as const,
    };

    return (
        <div className="p-4 md:p-8 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><SlidersHorizontal /> Filter Students</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="student-search">Search by Name/ID</Label>
                            <Input id="student-search" placeholder="Enter name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <Select value={departmentFilter} onValueChange={(value) => setDepartmentFilter(value === 'all' ? '' : value)}>
                                <SelectTrigger><SelectValue placeholder="All Departments" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Year</Label>
                            <Select value={yearFilter} onValueChange={(value) => setYearFilter(value === 'all' ? '' : value)}>
                                <SelectTrigger><SelectValue placeholder="All Years" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Years</SelectItem>
                                    {years.map((y) => (<SelectItem key={y} value={y}>{y}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Student List</CardTitle>
                        <CardDescription>Select a student to manage their fees.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <button key={student.id} onClick={() => setSelectedStudent(student)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors",
                                        selectedStudent?.id === student.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                    )}
                                >
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage src={student.photoUrl || ''} alt={student.name} data-ai-hint="student portrait" />
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{student.name}</p>
                                        <p className={cn("text-sm", selectedStudent?.id === student.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                                            {student.department} - {student.year}
                                        </p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No students found.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><DollarSign /> Fee Details Management</CardTitle>
                        {selectedStudent ? (
                            <CardDescription>Editing fee details for {selectedStudent.name}.</CardDescription>
                        ) : (
                            <CardDescription>Select a student from the list to begin.</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        {selectedStudent ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Semester</TableHead>
                                            <TableHead>Total Fee</TableHead>
                                            <TableHead>Amount Paid</TableHead>
                                            <TableHead>Balance</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {editableFees.map(fee => (
                                            <TableRow key={fee.semester}>
                                                <TableCell className="font-medium">{fee.semester}</TableCell>
                                                <TableCell>
                                                    <Input type="number" value={fee.totalFee} onChange={e => handleFeeChange(fee.semester, 'totalFee', e.target.value)} className="w-32" />
                                                </TableCell>
                                                <TableCell>
                                                    <Input type="number" value={fee.paid} onChange={e => handleFeeChange(fee.semester, 'paid', e.target.value)} className="w-32" />
                                                </TableCell>
                                                <TableCell className={cn(fee.balance > 0 && 'text-destructive font-medium')}>
                                                    {formatCurrency(fee.balance)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={statusVariant[fee.status]} className="capitalize">{fee.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleSaveChanges(fee.semester)}>
                                                        <Save className="h-4 w-4 text-primary" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="h-96 flex items-center justify-center text-muted-foreground">
                                <p>Select a student to view and edit their fee details.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
