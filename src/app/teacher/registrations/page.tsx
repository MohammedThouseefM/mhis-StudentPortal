
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, MailCheck, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { type Student } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCollegeData } from '@/context/college-data-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

export default function RegistrationsPage() {
    const { toast } = useToast();
    const currentTeacherId = 'TEACHER01';
    
    const {
        departments, years,
        pendingStudents, approveStudentRegistration, rejectStudentRegistration, updatePendingStudent,
    } = useCollegeData();

    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isEditPendingStudentDialogOpen, setIsEditPendingStudentDialogOpen] = useState(false);
    
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

    const handleEditPendingStudentClick = (student: Student) => {
        setEditingStudent(student);
        studentForm.reset({
            name: student.name, email: student.email, phone: student.phone,
            fatherContactNumber: student.fatherContactNumber,
            rollNumber: student.rollNumber, university_number: student.university_number,
            department: student.department, year: student.year, photoUrl: student.photoUrl || '',
            dob: student.dob, gender: student.gender,
            currentSemester: student.currentSemester, academicYear: student.academicYear, address: student.address,
        });
        setIsEditPendingStudentDialogOpen(true);
    };

    const onEditPendingStudentSubmit = (data: StudentFormData) => {
        if (!editingStudent) return;
        updatePendingStudent(editingStudent.id, {
            ...data, id: data.university_number,
        }, currentTeacherId);
        toast({ title: 'Registration Updated', description: `Successfully updated application for ${data.name}.` });
        setIsEditPendingStudentDialogOpen(false);
        setEditingStudent(null);
    };

    const handleApproveRegistration = (student: Student) => {
        approveStudentRegistration(student.id, currentTeacherId);
        toast({ title: 'Registration Approved', description: `${student.name} has been added to the roster.` });
    };

    const handleRejectRegistration = (student: Student) => {
        rejectStudentRegistration(student.id, currentTeacherId);
        toast({ variant: 'destructive', title: 'Registration Rejected', description: `Application for ${student.name} has been removed.` });
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
            <FormField
                control={studentForm.control}
                name="photoUrl"
                render={({ field: { onChange, value, onBlur, name, ref } }) => (
                <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border">
                        <AvatarImage src={value} alt="Student avatar" data-ai-hint="student portrait" className="object-cover" />
                        <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                        <FormControl>
                        <Input
                            type="file" accept="image/*" ref={ref} name={name} onBlur={onBlur}
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
                )}
            />
        </div>
    );

    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MailCheck className="h-6 w-6" /> Pending Registrations</CardTitle>
                    <CardDescription>Review, edit, and approve or deny new student registration applications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingStudents.length > 0 ? (
                                    pendingStudents.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Avatar className="h-8 w-8 border">
                                                    <AvatarImage src={student.photoUrl} alt={student.name} data-ai-hint="student portrait" />
                                                    <AvatarFallback><User /></AvatarFallback>
                                                </Avatar>
                                                {student.name}
                                            </TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>{student.department} - {student.year}</TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-100" onClick={() => handleApproveRegistration(student)}>
                                                    <MailCheck className="h-4 w-4" />
                                                    <span className="sr-only">Accept</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleEditPendingStudentClick(student)}>
                                                    <Pencil className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Deny</span>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure you want to deny this application?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the registration request for {student.name}.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleRejectRegistration(student)}>Deny Application</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No pending registration requests.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isEditPendingStudentDialogOpen} onOpenChange={setIsEditPendingStudentDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Pending Application: {editingStudent?.name}</DialogTitle>
                        <DialogDescription>Update the student's registration details below.</DialogDescription>
                    </DialogHeader>
                    <Form {...studentForm}>
                        <form onSubmit={studentForm.handleSubmit(onEditPendingStudentSubmit)}>
                            <StudentFormFields photoUrlValue={studentForm.watch('photoUrl')} />
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsEditPendingStudentDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
