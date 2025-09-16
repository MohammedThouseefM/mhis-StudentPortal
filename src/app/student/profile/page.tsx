
'use client';

import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from 'date-fns';
import { useCollegeData } from '@/context/college-data-context';
import Loading from '@/app/loading';

export default function StudentProfilePage() {
  const { currentUser } = useCollegeData();

  if (!currentUser || !('university_number' in currentUser)) {
    return <Loading />;
  }
  const student = currentUser;

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/student/dashboard">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Link>
            </Button>
            <h1 className="text-2xl font-bold md:text-3xl">My Profile</h1>
        </div>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-6 text-center md:text-left">
            <Avatar className="h-24 w-24 border">
                <AvatarImage src={student.photoUrl || `https://placehold.co/200x200.png`} alt="Student avatar" data-ai-hint="student portrait" className="object-cover" />
                <AvatarFallback>
                    <User className="h-12 w-12" />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl">{student.name}</CardTitle>
                <CardDescription className="text-base text-muted-foreground">{student.email}</CardDescription>
                <CardDescription className="text-sm text-muted-foreground mt-1">University Number: {student.university_number}</CardDescription>
            </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Roll Number</p>
              <p className="font-medium">{student.rollNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{student.department}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-medium">{student.year}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{format(parseISO(student.dob), 'dd-MM-yyyy')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{student.phone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Father's Contact</p>
              <p className="font-medium">{student.fatherContactNumber}</p>
            </div>
             <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{student.gender}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Semester</p>
              <p className="font-medium">{student.currentSemester}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Academic Year</p>
              <p className="font-medium">{student.academicYear}</p>
            </div>
             <div className="space-y-1 sm:col-span-2 md:col-span-3">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{student.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
