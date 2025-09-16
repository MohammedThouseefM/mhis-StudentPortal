
'use client';

import { type Student, type studentAttendance, type SemesterFee, type SemesterResult } from "@/lib/mock-data";
import { format, parseISO } from 'date-fns';
import { Progress } from "./ui/progress";

type PrintableReportProps = {
  id: string;
  student: Student;
  attendanceData: typeof studentAttendance;
  feeHistory: SemesterFee[];
  latestResult: SemesterResult | null;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

export function PrintableReport({ id, student, attendanceData, feeHistory, latestResult }: PrintableReportProps) {
  const totalBalance = feeHistory.reduce((acc, fee) => acc + fee.balance, 0);

  return (
    <div id={id} className="p-8 bg-white text-black font-sans w-[210mm]">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Merit Haji Ismail Sahib Arts and Science College</h1>
        <p className="text-xl">Student Progress Report</p>
      </header>

      <section className="mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold mb-2">Student Information</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div><strong>Name:</strong> {student.name}</div>
          <div><strong>Department:</strong> {student.department} - {student.year}</div>
          <div><strong>Roll Number:</strong> {student.rollNumber}</div>
          <div><strong>University Number:</strong> {student.university_number}</div>
          <div><strong>Father's Contact:</strong> {student.fatherContactNumber}</div>
          <div><strong>Academic Year:</strong> {student.academicYear}</div>
          <div className="col-span-2"><strong>Date of Birth:</strong> {format(parseISO(student.dob), 'dd-MM-yyyy')}</div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-3 gap-6">
        <div className="p-4 border rounded-lg text-center">
          <h3 className="font-semibold text-base">Overall Attendance</h3>
          <p className="text-4xl font-bold mt-2">{attendanceData.totalPercentage}%</p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <h3 className="font-semibold text-base">Latest GPA ({latestResult?.semester || 'N/A'})</h3>
          <p className="text-4xl font-bold mt-2">{latestResult?.gpa ? latestResult.gpa.toFixed(2) : 'N/A'}</p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <h3 className="font-semibold text-base">Outstanding Fees</h3>
          <p className="text-4xl font-bold mt-2">{formatCurrency(totalBalance)}</p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Attendance Breakdown</h2>
        <div className="grid grid-cols-2 gap-4">
            {attendanceData.subjects.map((subject) => (
            <div key={subject.name} className="text-sm">
                <div className="flex justify-between mb-1">
                <span className="font-medium">{subject.name}</span>
                <span className="text-gray-600">{subject.percentage}%</span>
                </div>
                <Progress value={subject.percentage} className="h-2" />
            </div>
            ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">Latest Semester Results ({latestResult?.semester || 'N/A'})</h2>
        {latestResult ? (
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Subject</th>
              <th className="p-2 border text-center">CIA</th>
              <th className="p-2 border text-center">Semester</th>
              <th className="p-2 border text-center">Total</th>
              <th className="p-2 border text-center">Grade</th>
              <th className="p-2 border text-center">Result</th>
            </tr>
          </thead>
          <tbody>
            {latestResult.results.map(res => (
              <tr key={res.subjectCode}>
                <td className="p-2 border font-medium">{res.subjectName} ({res.subjectCode})</td>
                <td className="p-2 border text-center">{res.ciaMarks}</td>
                <td className="p-2 border text-center">{res.semesterMarks}</td>
                <td className="p-2 border text-center font-bold">{res.totalMarks}</td>
                <td className="p-2 border text-center">{res.grade}</td>
                <td className="p-2 border text-center font-semibold">{res.resultStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
            <p className="text-sm text-gray-500">No result data available for the latest semester.</p>
        )}
      </section>

    </div>
  );
}
