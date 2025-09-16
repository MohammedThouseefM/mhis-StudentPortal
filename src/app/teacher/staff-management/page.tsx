
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Trash2, KeyRound, Eye, EyeOff, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { type Teacher } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCollegeData } from '@/context/college-data-context';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const teacherSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  id: z.string().min(2, 'Staff ID is required.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});
type TeacherFormData = z.infer<typeof teacherSchema>;

const changePasswordSchema = z.object({
  password: z.string().min(6, 'New password must be at least 6 characters.'),
});
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function StaffManagementPage() {
    const { toast } = useToast();
    const { teachers, addTeacher, updateTeacherPassword, deleteTeacher, toggleTeacherStatus, currentUser } = useCollegeData();
    const currentTeacherId = currentUser?.id || '';
    
    const [isAddTeacherDialogOpen, setIsAddTeacherDialogOpen] = useState(false);
    const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [showAddTeacherPassword, setShowAddTeacherPassword] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const teacherForm = useForm<TeacherFormData>({
        resolver: zodResolver(teacherSchema),
        defaultValues: {
            name: '',
            id: '',
            password: '',
        },
    });
    const changePasswordForm = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            password: '',
        },
    });

    const onAddTeacherSubmit = (data: TeacherFormData) => {
        addTeacher(data.name, data.id, data.password, currentTeacherId);
        toast({ title: 'Teacher Added', description: `Successfully added ${data.name}.` });
        setIsAddTeacherDialogOpen(false);
    };

    const onChangePasswordSubmit = (data: ChangePasswordFormData) => {
        if (editingTeacher) {
            updateTeacherPassword(editingTeacher.id, data.password, currentTeacherId);
            toast({ title: 'Password Updated', description: `Password for ${editingTeacher.name} has been changed.` });
            setIsChangePasswordDialogOpen(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="h-6 w-6" /> Staff Management</CardTitle>
                    <CardDescription>Add new staff members, manage credentials, and remove accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end mb-4">
                        <Button onClick={() => { teacherForm.reset(); setIsAddTeacherDialogOpen(true); }}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Staff
                        </Button>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Staff ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teachers.map((teacher) => (
                                    <TableRow key={teacher.id} className={cn(!teacher.isActive && 'opacity-60')}>
                                        <TableCell className={cn("font-medium", !teacher.isActive && 'line-through')}>{teacher.name}</TableCell>
                                        <TableCell>{teacher.id}</TableCell>
                                        <TableCell>
                                            <Badge variant={teacher.isActive ? 'default' : 'secondary'}>
                                                {teacher.isActive ? 'Active' : 'Deactivated'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={teacher.isActive}
                                                onCheckedChange={() => toggleTeacherStatus(teacher.id, currentTeacherId)}
                                                disabled={teacher.id === currentTeacherId}
                                                aria-label="Toggle teacher status"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingTeacher(teacher); changePasswordForm.reset(); setIsChangePasswordDialogOpen(true); }}>
                                                <KeyRound className="h-4 w-4" /><span className="sr-only">Change Password</span>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" disabled={teacher.id === currentTeacherId}>
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>This will permanently delete the staff account for {teacher.name}. They will lose all access.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteTeacher(teacher.id, currentTeacherId)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isAddTeacherDialogOpen} onOpenChange={setIsAddTeacherDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                        <DialogDescription>Create a new account for a teacher.</DialogDescription>
                    </DialogHeader>
                    <Form {...teacherForm}>
                        <form onSubmit={teacherForm.handleSubmit(onAddTeacherSubmit)} className="space-y-4 py-4">
                            <FormField control={teacherForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Dr. Evelyn Reed" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={teacherForm.control} name="id" render={({ field }) => (<FormItem><FormLabel>Staff ID</FormLabel><FormControl><Input placeholder="e.g., TEACHER03" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={teacherForm.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type={showAddTeacherPassword ? 'text' : 'password'} placeholder="Min. 6 characters" className="pr-10" {...field} />
                                            <Button type="button" variant="ghost" size="icon" className="absolute inset-y-0 right-0" onClick={() => setShowAddTeacherPassword((prev) => !prev)}>
                                                {showAddTeacherPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                <span className="sr-only">{showAddTeacherPassword ? "Hide password" : "Show password"}</span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddTeacherDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Add Staff</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Change Password for {editingTeacher?.name}</DialogTitle>
                        <DialogDescription>Enter a new password for Staff ID: {editingTeacher?.id}</DialogDescription>
                    </DialogHeader>
                    <Form {...changePasswordForm}>
                        <form onSubmit={changePasswordForm.handleSubmit(onChangePasswordSubmit)} className="space-y-4 py-4">
                            <FormField control={changePasswordForm.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type={showChangePassword ? 'text' : 'password'} placeholder="Min. 6 characters" className="pr-10" {...field} />
                                            <Button type="button" variant="ghost" size="icon" className="absolute inset-y-0 right-0" onClick={() => setShowChangePassword((prev) => !prev)}>
                                                {showChangePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                <span className="sr-only">{showChangePassword ? "Hide password" : "Show password"}</span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsChangePasswordDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Password</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
