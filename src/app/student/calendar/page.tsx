import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AcademicCalendar } from '@/components/academic-calendar';
import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/student/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Academic & Attendance Calendar</h1>
      </div>
      <AcademicCalendar />
    </div>
  );
}
