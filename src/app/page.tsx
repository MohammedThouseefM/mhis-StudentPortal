
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { School, Building, GraduationCap, RefreshCw, UserPlus, Eye, EyeOff, Menu, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { validateStudent, validateTeacher } from '@/lib/auth';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCollegeData } from '@/context/college-data-context';

export default function LandingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setCurrentUser, students, teachers, isLoaded } = useCollegeData();
  const [studentId, setStudentId] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [studentCaptchaInput, setStudentCaptchaInput] = useState('');
  const [teacherCaptchaInput, setTeacherCaptchaInput] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginTab, setLoginTab] = useState<'student' | 'teacher'>('student');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showTeacherPassword, setShowTeacherPassword] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captchaText = '';
    for (let i = 0; i < 6; i++) {
        captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(captchaText);
  };
  
  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (isLoginOpen) {
        generateCaptcha();
        setStudentCaptchaInput('');
        setTeacherCaptchaInput('');
    }
  }, [isLoginOpen]);

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentCaptchaInput.toUpperCase() !== captcha.toUpperCase()) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid Captcha. Please try again.',
      });
      generateCaptcha();
      setStudentCaptchaInput('');
      return;
    }
    
    const result = validateStudent(studentId, studentPassword, students);
    if (result && typeof result !== 'string') {
      setCurrentUser(result);
      router.push('/student/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: result === 'inactive' 
          ? 'Your account has been deactivated. Please contact administration.' 
          : 'Invalid University Number or Password.',
      });
      generateCaptcha();
      setStudentCaptchaInput('');
    }
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherCaptchaInput.toUpperCase() !== captcha.toUpperCase()) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid Captcha. Please try again.',
      });
      generateCaptcha();
      setTeacherCaptchaInput('');
      return;
    }
    const result = validateTeacher(teacherId, teacherPassword, teachers);
    if (result && typeof result !== 'string') {
      setCurrentUser(result);
      router.push('/teacher/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: result === 'inactive'
         ? 'Your account has been deactivated. Please contact administration.'
         : 'Invalid Staff ID or Password.',
      });
      generateCaptcha();
      setTeacherCaptchaInput('');
    }
  };
  
  const handleLoginClick = (tab: 'student' | 'teacher') => {
    setLoginTab(tab);
    setIsLoginOpen(true);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <School className="h-10 w-10 text-primary" />
            <h1 className="text-xl font-bold text-primary">MHIS College</h1>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                    <Link href="/faculty">Faculty</Link>
                </Button>
                <Button variant="outline" onClick={() => handleLoginClick('student')}>
                    Student Login
                </Button>
                <Button onClick={() => handleLoginClick('teacher')}>
                    Teacher Login
                </Button>
                 <Button variant="secondary" asChild>
                    <Link href="/register">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register
                    </Link>
                </Button>
            </div>
          </div>
          {/* Mobile Nav */}
           <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href="/faculty">Faculty</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLoginClick('student')}>Student Login</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLoginClick('teacher')}>Teacher Login</DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/register">Register</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main>
        {/* 2. Hero Section */}
        <section className="relative h-[60vh] w-full">
          <Image
            src="/clg-img.jpg"
            alt="Entrance of Merit Haji Ismail Sahib Arts and Science College"
            data-ai-hint="college entrance"
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
             <h2 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">Merit Haji Ismail Sahib Arts and Science College</h2>
             <p className="mt-4 max-w-3xl text-lg md:text-xl text-white/90 drop-shadow-md">
                Kondamalli, Pernambut-635810.
             </p>
             <p className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow-md">
                Empowering the next generation of leaders through innovative teaching and research.
             </p>
          </div>
        </section>

        {/* 3. About Section */}
        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl inline-block relative pb-2">
                        About Our College
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-primary rounded-full"></span>
                    </h2>
                    <p className="mt-8 text-lg/relaxed text-muted-foreground">
                        Founded in 1985, Merit Haji Ismail Sahib Arts and Science College has been a beacon of knowledge and innovation for nearly four decades. Our mission is to provide a holistic education that not only imparts knowledge but also fosters critical thinking, creativity, and a sense of social responsibility.
                    </p>
                    <p className="mt-4 text-lg/relaxed text-muted-foreground">
                        With a diverse student body and a world-class faculty, we are proud of our numerous achievements in research, academia, and community service. We are committed to creating an environment where every student can thrive and achieve their full potential.
                    </p>
                </div>
            </div>
        </section>
      </main>

      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl">Welcome Back!</DialogTitle>
            <DialogDescription>
              {loginTab === 'student'
                ? "Student ID is your University Number. The password is your Date of Birth in DD-MM-YYYY format."
                : "Teacher ID is your Staff ID. For demo, use ID: TEACHER01 / Pass: Teacher@Pass1"
              }
            </DialogDescription>
          </DialogHeader>
          <Tabs value={loginTab} onValueChange={(value) => setLoginTab(value as 'student' | 'teacher')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">
                <GraduationCap className="mr-2 h-4 w-4" /> Student
              </TabsTrigger>
              <TabsTrigger value="teacher">
                <Building className="mr-2 h-4 w-4" /> Teacher
              </TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <form onSubmit={handleStudentLogin}>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID (University Number)</Label>
                    <Input
                      id="student-id"
                      placeholder="Enter your university number"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password (Date of Birth)</Label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        type={showStudentPassword ? 'text' : 'password'}
                        placeholder="DD-MM-YYYY"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-0 right-0"
                        onClick={() => setShowStudentPassword((prev) => !prev)}
                      >
                        {showStudentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">
                          {showStudentPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="student-captcha">Captcha</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 select-none rounded-md border bg-muted p-2 text-center text-xl font-bold tracking-widest">
                        <span className="uppercase">{captcha}</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={generateCaptcha}
                        aria-label="Refresh captcha"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      id="student-captcha"
                      placeholder="Enter the captcha above"
                      value={studentCaptchaInput}
                      onChange={(e) => setStudentCaptchaInput(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={!isLoaded}>
                    {!isLoaded && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoaded ? 'Login as Student' : 'Loading...'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="teacher">
              <form onSubmit={handleTeacherLogin}>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-id">Staff ID</Label>
                    <Input
                      id="teacher-id"
                      placeholder="Enter your staff ID"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="teacher-password"
                        type={showTeacherPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={teacherPassword}
                        onChange={(e) => setTeacherPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-0 right-0"
                        onClick={() => setShowTeacherPassword((prev) => !prev)}
                      >
                        {showTeacherPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">
                          {showTeacherPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="teacher-captcha">Captcha</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 select-none rounded-md border bg-muted p-2 text-center text-xl font-bold tracking-widest">
                         <span className="uppercase">{captcha}</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={generateCaptcha}
                        aria-label="Refresh captcha"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      id="teacher-captcha"
                      placeholder="Enter the captcha above"
                      value={teacherCaptchaInput}
                      onChange={(e) => setTeacherCaptchaInput(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={!isLoaded}>
                    {!isLoaded && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoaded ? 'Login as Teacher' : 'Loading...'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Merit Haji Ismail Sahib Arts and Science College. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
