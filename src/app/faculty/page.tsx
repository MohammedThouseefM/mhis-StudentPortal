
import Link from 'next/link';
import { ArrowLeft, User, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { teachers } from '@/lib/mock-data';

export default function FacultyPage() {
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
                 <h1 className="text-xl font-bold text-primary">Our Faculty</h1>
            </div>
             <div className="w-10"></div>
        </div>
      </header>
      
      <main className="p-4 md:p-8">
        <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {teachers.map((teacher) => (
                    <Card key={teacher.id} className="text-center">
                        <CardContent className="pt-6 flex flex-col items-center">
                             <Avatar className="h-24 w-24 border mb-4">
                                <AvatarImage src={`https://placehold.co/200x200.png`} alt={teacher.name} data-ai-hint="teacher portrait" className="object-cover" />
                                <AvatarFallback>
                                    <User className="h-12 w-12" />
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-lg">{teacher.name}</CardTitle>
                            <CardDescription className="flex items-center justify-center gap-2 mt-1">
                                <Briefcase className="h-4 w-4" />
                                Staff ID: {teacher.id}
                            </CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
