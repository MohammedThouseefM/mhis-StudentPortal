
'use client';

import { Announcements } from "@/components/announcements";
import { DailyAttendanceCard } from "@/components/daily-attendance-card";
import { DownloadPdfButton } from "@/components/download-pdf-button";
import { FeedbackCard } from "@/components/feedback-card";
import { LeaveRequestCard } from "@/components/leave-request-card";
import { MotivationalQuote } from "@/components/motivational-quote";
import { StudentAttendanceSummary } from "@/components/student-attendance-summary";
import { TimetableCard } from "@/components/timetable-card";
import { studentAttendance } from "@/lib/mock-data";
import { AcademicCalendarCard } from "@/components/academic-calendar-card";
import { useCollegeData } from "@/context/college-data-context";
import { PrintableReport } from "@/components/printable-report";
import Loading from "@/app/loading";

export default function StudentDashboardPage() {
  const { currentUser, studentFeeDetails, studentResults } = useCollegeData();
  
  if (!currentUser || !('university_number' in currentUser)) {
    return <Loading />;
  }
  const student = currentUser;

  const feeHistory = studentFeeDetails[student.id] || [];
  const latestResult = (studentResults[student.id] || [])[0] || null;

  const reportId = `student-dashboard-report-${student.id}`;
  const printableReportId = `printable-report-${student.id}`;

  return (
    <div className="p-4 md:p-8">
      <div className="absolute -left-[9999px] top-0">
        <PrintableReport
          id={printableReportId}
          student={student}
          attendanceData={studentAttendance}
          feeHistory={feeHistory}
          latestResult={latestResult}
        />
      </div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Welcome, {student.name}!</h1>
          <p className="text-muted-foreground">
            Here's your complete attendance summary and latest updates.
          </p>
        </div>
        <DownloadPdfButton elementId={printableReportId} studentName={student.name} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content: Attendance */}
        <div className="lg:col-span-2 space-y-8">
          <div id={reportId}>
            <StudentAttendanceSummary
              student={student}
              attendanceData={studentAttendance}
              showLowAttendanceWarning={true}
            />
          </div>
        </div>

        {/* Side Column: Quick Info & Actions */}
        <div className="lg:col-span-1 space-y-8">
          <DailyAttendanceCard />
          <Announcements />
          <MotivationalQuote />
          <LeaveRequestCard />
          <FeedbackCard />
          <AcademicCalendarCard />
          <TimetableCard />
        </div>
      </div>
    </div>
  );
}
