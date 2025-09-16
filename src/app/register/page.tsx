
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCollegeData } from '@/context/college-data-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.').regex(/^\d+$/, "Please enter a valid phone number."),
  fatherContactNumber: z.string().min(10, "Father's contact number must be at least 10 digits.").regex(/^\d+$/, "Please enter a valid phone number."),
  rollNumber: z.string().min(1, 'Roll number is required.'),
  university_number: z.string().min(1, 'A temporary ID or number is required.'),
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

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addPendingStudent, departments, years } = useCollegeData();

  const form = useForm<StudentFormData>({
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
  
  const photoUrlValue = form.watch('photoUrl');

  const onSubmit = (data: StudentFormData) => {
    addPendingStudent({
      ...data,
      id: data.university_number, // Use a temporary unique ID
    });
    toast({
      title: 'Registration Submitted!',
      description: 'Your application has been sent for approval. You will be notified upon acceptance.',
      duration: 5000,
    });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 md:px-8 flex h-16 items-center">
             <Button variant="outline" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to Home</span>
                </Link>
            </Button>
            <div className="flex-1 text-center">
                 <h1 className="text-xl font-bold text-primary">Student Registration</h1>
            </div>
             <div className="w-10"></div>
        </div>
      </header>
      
      <main className="p-4 md:p-8 flex justify-center">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus /> New Student Application Form
            </CardTitle>
            <CardDescription>
              Please fill out all the details below. Your application will be reviewed by the administration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input placeholder="Enter your full name" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input placeholder="you@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Phone Number</FormLabel> <FormControl><Input placeholder="9876543210" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="fatherContactNumber" render={({ field }) => ( <FormItem> <FormLabel>Father's Contact Number</FormLabel> <FormControl><Input placeholder="9876543210" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="rollNumber" render={({ field }) => ( <FormItem> <FormLabel>Prospective Roll Number</FormLabel> <FormControl><Input placeholder="e.g., 3BCA-29" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="university_number" render={({ field }) => ( <FormItem> <FormLabel>University Application No.</FormLabel> <FormControl><Input placeholder="e.g., 36623U09029" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="department" render={({ field }) => ( <FormItem> <FormLabel>Department</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl> <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="year" render={({ field }) => ( <FormItem> <FormLabel>Year</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a year" /></SelectTrigger></FormControl> <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="dob" render={({ field }) => ( <FormItem> <FormLabel>Date of Birth</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="gender" render={({ field }) => ( <FormItem> <FormLabel>Gender</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select a gender" /></SelectTrigger></FormControl> <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="currentSemester" render={({ field }) => ( <FormItem> <FormLabel>Prospective Semester</FormLabel> <FormControl><Input placeholder="e.g., 1st" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="academicYear" render={({ field }) => ( <FormItem> <FormLabel>Academic Year</FormLabel> <FormControl><Input placeholder="e.g., 2024-2025" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                <FormField control={form.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Address</FormLabel> <FormControl><Textarea placeholder="Enter your full address" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem>
                      <FormLabel>Profile Photo</FormLabel>
                       <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border">
                           <AvatarImage src={photoUrlValue} alt="Student avatar" data-ai-hint="student portrait" className="object-cover" />
                           <AvatarFallback>
                            <User className="h-10 w-10" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              ref={ref}
                              name={name}
                              onBlur={onBlur}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    onChange(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="flex-1"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-2">
                            Upload a picture for your profile.
                          </p>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/">Cancel</Link>
                  </Button>
                  <Button type="submit" className="bg-accent hover:bg-accent/90">
                    Submit Application
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
