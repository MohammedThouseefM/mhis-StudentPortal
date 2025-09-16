
'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { PlusCircle, Pencil, Search, BarChart, User, SlidersHorizontal, Users, Send, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { type Student, previousAttendanceData, studentAttendance } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCollegeData } from '@/context/college-data-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { StudentAttendanceSummary } from '@/components/student-attendance-summary';
import { AcademicCalendar } from '@/components/academic-calendar';
import { DownloadPdfButton } from '@/components/download-pdf-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrintableReport } from '@/components/printable-report';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.').regex(/^\d+$/, "Please enter a valid phone number."),
  fatherContactNumber: z.string().min(10, "Father's contact number must be at least 10 digits.").regex(/^\d+$/, "Please enter a valid phone number."),
  rollNumber: z.string().min(1, 'Roll number is required.'),
  university_number: z.string().min(1, 'University number is required.'),
  department: z.string().min(1, 'Please select a department.'),
  year: z.string().min(1, 'Please select a year.'),
  photoUrl: z.string().optional(),
  dob: z.string().min(1, 'Date of birth is required.'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Please select a gender.' }),
  currentSemester: z.string().min(1, 'Semester is required.'),
  academicYear: z.string().min(1, 'Academic year is required.'),
  address: z.string().min(1, 'Address is required.'),
});
type StudentFormData = z.infer<typeof studentSchema>;

// Helper function to calculate attendance
const calculateAttendancePercentage = (studentId: string) => {
  const studentRecords = previousAttendanceData.filter(record => record.studentId === studentId);
  if (studentRecords.length === 0) return 0;
  const presentCount = studentRecords.filter(record => record.attendanceStatus === 'present').length;
  return Math.round((presentCount / studentRecords.length) * 100);
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

export default function StudentManagementPage() {
    const { toast } = useToast();
    const currentTeacherId = 'TEACHER01';
    
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
    const [isEditStudentDialogOpen, setIsEditStudentDialogOpen] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [attendanceRangeFilter, setAttendanceRangeFilter] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const { 
        departments, years,
        students, addStudent, updateStudent, deleteStudent, toggleStudentStatus,
        studentFeeDetails, studentResults
    } = useCollegeData();
  
    const studentForm = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            fatherContactNumber: '',
            rollNumber: '',
            university_number: '',
            department: '',
            year: '',
            photoUrl: '',
            gender: undefined,
            currentSemester: '',
            academicYear: '',
            address: '',
            dob: '',
        },
    });
    const reportId = selectedStudent ? `teacher-view-report-${selectedStudent.id}` : '';
    const printableReportId = selectedStudent ? `printable-report-${selectedStudent.id}` : '';

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

            const matchesAttendance = (() => {
                if (!attendanceRangeFilter) return true;
                const attendance = calculateAttendancePercentage(student.id);
                if (attendanceRangeFilter === "0") return attendance === 0;
                if (attendanceRangeFilter === 'all') return true;
                const [min, max] = attendanceRangeFilter.split('-').map(Number);
                return attendance >= min && attendance <= max;
            })();

            return matchesSearchTerm && matchesDepartment && matchesYear && matchesAttendance;
        });
    }, [searchTerm, departmentFilter, yearFilter, attendanceRangeFilter, students]);
    
    const attendanceRanges = [
        { label: "All Attendance", value: "all" },
        { label: "Long Absentees (0%)", value: "0" },
        { label: "1% - 20%", value: "1-20" },
        { label: "21% - 40%", value: "21-40" },
        { label: "41% - 60%", value: "41-60" },
        { label: "61% - 75%", value: "61-75" },
        { label: "76% - 100%", value: "76-100" },
    ];

    const onStudentSubmit = (data: StudentFormData) => {
        addStudent({
        ...data,
        id: data.university_number,
        isActive: true,
        }, currentTeacherId);
        toast({ title: 'Student Added', description: `Successfully added ${data.name}.` });
        setIsAddStudentDialogOpen(false);
    };

    const handleAddStudentClick = () => {
        setEditingStudent(null);
        studentForm.reset({
        name: '', email: '', phone: '', fatherContactNumber: '', rollNumber: '', university_number: '',
        department: '', year: '', photoUrl: '', dob: '', gender: undefined,
        currentSemester: '', academicYear: '', address: ''
        });
        setIsAddStudentDialogOpen(true);
    };
    
    const handleEditStudentClick = (student: Student) => {
        setEditingStudent(student);
        studentForm.reset({
            name: student.name, email: student.email, phone: student.phone,
            fatherContactNumber: student.fatherContactNumber,
            rollNumber: student.rollNumber, university_number: student.university_number,
            department: student.department, year: student.year, photoUrl: student.photoUrl || '',
            dob: student.dob, gender: student.gender,
            currentSemester: student.currentSemester, academicYear: student.academicYear, address: student.address,
        });
        setIsEditStudentDialogOpen(true);
    };
    
    const onEditStudentSubmit = (data: StudentFormData) => {
        if (!editingStudent) return;
        updateStudent(editingStudent.id, { ...data, id: data.university_number, isActive: editingStudent.isActive }, currentTeacherId);
        toast({ title: 'Student Updated', description: `Successfully updated ${data.name}.` });
        setIsEditStudentDialogOpen(false);
        setEditingStudent(null);
    };

    const handleSendToParent = (student: Student) => {
        const attendance = calculateAttendancePercentage(student.id);
        const fees = studentFeeDetails[student.id] || [];
        const totalBalance = fees.reduce((acc, fee) => acc + fee.balance, 0);
        const results = studentResults[student.id] || [];
        const latestResult = results.length > 0 ? results[0] : null;

        let resultSummary = "Latest Semester Result: N/A";
        if (latestResult) {
            resultSummary = `Latest Result (${latestResult.semester} Sem): GPA ${latestResult.gpa.toFixed(2)} (${latestResult.overallResult})`;
        }

        const message = `*Student Progress Report*
*Merit Haji Ismail Sahib Arts and Science College*

Dear Parent,
Here is a summary of your child's progress:

*Student Details*
- Name: ${student.name}
- Roll No: ${student.rollNumber}
- Department: ${student.department} - ${student.year}

*Academic Performance*
- Overall Attendance: ${attendance}%
- ${resultSummary}

*Financials*
- Outstanding Balance: ${formatCurrency(totalBalance)}

Please contact the college administration for further details.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/91${student.fatherContactNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        toast({
            title: "Redirecting to WhatsApp",
            description: "A new tab has been opened to share the report.",
        });
    };
    
    const handleDeleteStudent = (student: Student) => {
        deleteStudent(student.id, currentTeacherId);
        toast({ variant: 'destructive', title: 'Student Removed', description: `${student.name} has been removed from the roster.` });
    };

    const StudentFormFields = ({ photoUrlValue }: { photoUrlValue?: string }) => (
        <div className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={studentForm.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input placeholder="Enter student's name" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={studentForm.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input placeholder="student@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={studentForm.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Phone Number</FormLabel> <FormControl><Input placeholder="9876543210" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={studentForm.control} name="fatherContactNumber" render={({ field }) => ( <FormItem> <FormLabel>Father's Contact Number</FormLabel> <FormControl><Input placeholder="9876543210" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={studentForm.control} name="rollNumber" render={({ field }) => ( <FormItem> <FormLabel>Roll Number</FormLabel> <FormControl><Input placeholder="e.g., 3BCA-29" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={studentForm.control} name="university_number" render={({ field }) => ( <FormItem> <FormLabel>University Number</FormLabel> <FormControl><Input placeholder="e.g., 36623U09029" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={studentForm.control} name="department" render={({ field }) => ( <FormItem> <FormLabel>Department</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl> <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                <FormField control={studentForm.control} name="year" render={({ field }) => ( <FormItem> <FormLabel>Year</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a year" /></SelectTrigger></FormControl> <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                <FormField control={studentForm.control} name="dob" render={({ field }) => ( <FormItem> <FormLabel>Date of Birth</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={studentForm.control} name="gender" render={({ field }) => ( <FormItem> <FormLabel>Gender</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a gender" /></SelectTrigger></FormControl> <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                <FormField control={studentForm.control} name="currentSemester" render={({ field }) => ( <FormItem> <FormLabel>Current Semester</FormLabel> <FormControl><Input placeholder="e.g., 6th" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={studentForm.control} name="academicYear" render={({ field }) => ( <FormItem> <FormLabel>Academic Year</FormLabel> <FormControl><Input placeholder="e.g., 2024-2025" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            </div>
            <FormField control={studentForm.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Address</FormLabel> <FormControl><Textarea placeholder="Enter student's full address" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={studentForm.control} name="photoUrl" render={({ field: { onChange, value, onBlur, name, ref } }) => (
                <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border">
                            <AvatarImage src={value} alt="Student avatar" data-ai-hint="student portrait" className="object-cover" />
                            <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                        </Avatar>
                        <div className="w-full">
                            <FormControl>
                                <Input type="file" accept="image/*" ref={ref} name={name} onBlur={onBlur}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => { onChange(reader.result as string); };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="flex-1"
                                />
                            </FormControl>
                            <p className="text-xs text-muted-foreground mt-2">Upload a picture for the student's profile.</p>
                        </div>
                    </div>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6" /> Student Management</CardTitle>
                    <CardDescription>Search, filter, and manage all students in the college roster.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><SlidersHorizontal /> Filters & Search</h3>
                        <div className="space-y-2">
                            <Label htmlFor="student-search">Search Student</Label>
                            <Input id="student-search" placeholder="Enter name, roll no, or university no..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <Label>Department</Label>
                                <Select value={departmentFilter} onValueChange={(value) => setDepartmentFilter(value === 'all' ? '' : value)}>
                                    <SelectTrigger><SelectValue placeholder="All Departments" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        {departments.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Year</Label>
                                <Select value={yearFilter} onValueChange={(value) => setYearFilter(value === 'all' ? '' : value)}>
                                    <SelectTrigger><SelectValue placeholder="All Years" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Years</SelectItem>
                                        {years.map((y) => (<SelectItem key={y} value={y}>{y}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Attendance Range</Label>
                                <Select value={attendanceRangeFilter} onValueChange={(value) => setAttendanceRangeFilter(value === 'all' ? '' : value)}>
                                    <SelectTrigger><SelectValue placeholder="All Attendance" /></SelectTrigger>
                                    <SelectContent>
                                        {attendanceRanges.map((range) => (<SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <h3 className="font-semibold text-lg">Student Roster ({filteredStudents.length} results)</h3>
                        <Button onClick={handleAddStudentClick}><PlusCircle className="mr-2 h-4 w-4" /> Add New Student</Button>
                    </div>

                    <div className="space-y-4">
                        {filteredStudents.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredStudents.map(student => {
                                    const attendance = calculateAttendancePercentage(student.id);
                                    return (
                                        <Card key={student.id} className={cn("flex flex-col justify-between", !student.isActive && 'opacity-50 bg-muted/50')}>
                                            <div>
                                                <CardHeader className="flex flex-row items-center gap-4 p-4">
                                                    <Avatar className="h-12 w-12 border">
                                                        <AvatarImage src={student.photoUrl || `https://placehold.co/100x100.png`} alt={student.name} data-ai-hint="student portrait" className="object-cover" />
                                                        <AvatarFallback><User /></AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <CardTitle className="text-lg">{student.name}</CardTitle>
                                                        <CardDescription>{student.university_number}</CardDescription>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3 text-sm pt-0 p-4">
                                                    <p><strong>Roll No:</strong> {student.rollNumber}</p>
                                                    <p><strong>Class:</strong> {student.department} - {student.year}</p>
                                                    <div>
                                                        <div className="flex justify-between mb-1">
                                                            <p className="font-medium">Overall Attendance</p>
                                                            <p className="text-muted-foreground">{attendance}%</p>
                                                        </div>
                                                        <Progress value={attendance} />
                                                    </div>
                                                </CardContent>
                                            </div>
                                            <CardFooter className="p-2 pt-0 flex flex-col gap-2">
                                                <div className="grid grid-cols-3 gap-2 w-full">
                                                    <Button variant="outline" className="w-full text-xs px-2" onClick={() => setSelectedStudent(student)}>
                                                        <BarChart className="mr-2 h-4 w-4" /> Report
                                                    </Button>
                                                    <Button variant="outline" className="w-full text-xs px-2" onClick={() => handleEditStudentClick(student)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </Button>
                                                    <Button variant="outline" className="w-full text-xs px-2" onClick={() => handleSendToParent(student)}>
                                                        <Send className="mr-2 h-4 w-4" /> WhatsApp
                                                    </Button>
                                                </div>
                                                <div className="flex items-center justify-between w-full border-t pt-2 mt-2">
                                                     <div className="flex items-center space-x-2">
                                                        <Switch id={`active-switch-${student.id}`} checked={student.isActive} onCheckedChange={() => toggleStudentStatus(student.id, currentTeacherId)} />
                                                        <Label htmlFor={`active-switch-${student.id}`} className="text-xs">{student.isActive ? 'Active' : 'Deactivated'}</Label>
                                                    </div>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>This will permanently remove {student.name} from the roster. This action cannot be undone.</AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteStudent(student)}>Delete Student</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No students found matching your criteria.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
                <DialogContent className="w-[95vw] max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Student</DialogTitle>
                        <DialogDescription>Fill in the details for the new student.</DialogDescription>
                    </DialogHeader>
                    <Form {...studentForm}>
                        <form onSubmit={studentForm.handleSubmit(onStudentSubmit)}>
                            <StudentFormFields photoUrlValue={studentForm.watch('photoUrl')} />
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsAddStudentDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Add Student</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditStudentDialogOpen} onOpenChange={setIsEditStudentDialogOpen}>
                <DialogContent className="w-[95vw] max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Student: {editingStudent?.name}</DialogTitle>
                        <DialogDescription>Update the student's details below. Click save to apply changes.</DialogDescription>
                    </DialogHeader>
                    <Form {...studentForm}>
                        <form onSubmit={studentForm.handleSubmit(onEditStudentSubmit)}>
                            <StudentFormFields photoUrlValue={studentForm.watch('photoUrl')} />
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsEditStudentDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedStudent} onOpenChange={(isOpen) => !isOpen && setSelectedStudent(null)}>
                <DialogContent className="w-[95vw] max-w-5xl">
                    <DialogHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <div>
                                <DialogTitle>Full Attendance Report for {selectedStudent?.name}</DialogTitle>
                                <DialogDescription>
                                    {selectedStudent?.department} - {selectedStudent?.year} | Roll No: {selectedStudent?.rollNumber}
                                </DialogDescription>
                            </div>
                            {selectedStudent && <DownloadPdfButton elementId={printableReportId} studentName={selectedStudent.name} />}
                        </div>
                    </DialogHeader>
                    <div className="mt-4 max-h-[70vh] overflow-y-auto pr-4">
                        <Tabs defaultValue="summary">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="summary"><BarChart className="mr-2 h-4 w-4" />Summary Report</TabsTrigger>
                                <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
                            </TabsList>
                            <TabsContent value="summary" className="mt-4">
                                <div id={reportId}>
                                    {selectedStudent && <StudentAttendanceSummary student={selectedStudent} attendanceData={studentAttendance} />}
                                </div>
                            </TabsContent>
                            <TabsContent value="daily" className="mt-4">
                                <AcademicCalendar />
                            </TabsContent>
                        </Tabs>
                    </div>
                    {selectedStudent && (
                        <div className="absolute -left-[9999px] top-0">
                           <PrintableReport
                                id={printableReportId}
                                student={selectedStudent}
                                attendanceData={studentAttendance}
                                feeHistory={studentFeeDetails[selectedStudent.id] || []}
                                latestResult={(studentResults[selectedStudent.id] || [])[0] || null}
                           />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
