
import { Announcements } from "@/components/announcements";
import { TeacherAttendanceSelector } from "@/components/teacher-attendance-selector";

export default function TeacherDashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold md:text-3xl mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <TeacherAttendanceSelector />
        <Announcements />
      </div>
    </div>
  );
}
