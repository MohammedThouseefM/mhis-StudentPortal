
'use client';

import { useState, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { useCollegeData } from '@/context/college-data-context';
import { type Student } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookCopy, FileDown, Loader2, PlusCircle, Trash2, Users, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSeatingPlan } from '@/lib/actions';
import { type SeatingArrangementOutput } from '@/ai/flows/seating-arrangement-flow';
import { generateSeatingPlanPdf } from '@/lib/generate-pdf-report';

type Room = {
  id: string;
  name: string;
  capacity: string;
};

export function SeatingArrangementGenerator() {
  const { students, departments, years } = useCollegeData();
  const { toast } = useToast();
  
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [rooms, setRooms] = useState<Room[]>([{ id: nanoid(), name: '', capacity: '' }]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<SeatingArrangementOutput | null>(null);
  const reportId = 'seating-plan-printable';

  const filteredStudents = useMemo(() => {
    if (selectedDepartments.length === 0 || selectedYears.length === 0) {
      return [];
    }
    return students.filter(
      (student) =>
        selectedDepartments.includes(student.department) && selectedYears.includes(student.year)
    );
  }, [students, selectedDepartments, selectedYears]);

  const totalCapacity = useMemo(() => {
    return rooms.reduce((acc, room) => acc + (parseInt(room.capacity, 10) || 0), 0);
  }, [rooms]);

  const handleAddRoom = () => {
    setRooms([...rooms, { id: nanoid(), name: '', capacity: '' }]);
  };

  const handleRemoveRoom = (id: string) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  const handleRoomChange = (id: string, field: 'name' | 'capacity', value: string) => {
    setRooms(rooms.map((room) => (room.id === id ? { ...room, [field]: value } : room)));
  };

  const handleGenerate = async () => {
    if (filteredStudents.length === 0) {
      toast({ variant: 'destructive', title: 'No students selected', description: 'Please select at least one department and year.' });
      return;
    }
    if (rooms.some(r => !r.name || !r.capacity)) {
       toast({ variant: 'destructive', title: 'Incomplete Room Details', description: 'Please provide a name and capacity for all rooms.' });
      return;
    }

    setIsGenerating(true);
    setPlan(null);

    const result = await getSeatingPlan({
      students: filteredStudents.map(s => ({ id: s.id, name: s.name, rollNumber: s.rollNumber })),
      rooms: rooms.map(r => ({ name: r.name, capacity: parseInt(r.capacity, 10) || 0 })),
    });

    setIsGenerating(false);

    if (result.success && result.data) {
      setPlan(result.data);
      toast({ title: 'Plan Generated!', description: result.data.summary });
    } else {
      toast({ variant: 'destructive', title: 'Generation Failed', description: result.error });
    }
  };
  
  const handleDownloadPdf = async () => {
    if (!plan) return;
    toast({ title: 'Generating PDF...' });
    try {
        const pdfBlob = await generateSeatingPlanPdf(plan, reportId);
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Exam-Seating-Plan.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("PDF generation failed", error);
        toast({ variant: 'destructive', title: 'PDF Generation Failed' });
    }
  };

  return (
    <div className="pt-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle>1. Configuration</CardTitle>
            <CardDescription>Select students and define rooms for the exam.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Departments</Label>
              {/* This could be a multi-select component, but for simplicity, we'll use multiple selects */}
              <Select onValueChange={(value) => setSelectedDepartments(value ? [value] : [])}>
                <SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Years</Label>
              <Select onValueChange={(value) => setSelectedYears(value ? [value] : [])}>
                <SelectTrigger><SelectValue placeholder="Select a year" /></SelectTrigger>
                <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Define Exam Rooms</Label>
              <div className="space-y-2">
                {rooms.map((room, index) => (
                  <div key={room.id} className="flex gap-2 items-center">
                    <Input placeholder={`Room Name ${index + 1}`} value={room.name} onChange={(e) => handleRoomChange(room.id, 'name', e.target.value)} />
                    <Input type="number" placeholder="Capacity" value={room.capacity} onChange={(e) => handleRoomChange(room.id, 'capacity', e.target.value)} />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRoom(room.id)} disabled={rooms.length === 1}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={handleAddRoom}><PlusCircle className="mr-2 h-4 w-4" /> Add Room</Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="p-3 rounded-md bg-secondary text-secondary-foreground w-full flex flex-col sm:flex-row justify-between text-sm gap-2">
                <div className="flex items-center gap-2"><Users /><span>{filteredStudents.length} Students Selected</span></div>
                <div className="flex items-center gap-2"><BookCopy /><span>{totalCapacity} Total Seats</span></div>
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookCopy className="mr-2 h-4 w-4" />}
              Generate Seating Plan
            </Button>
          </CardFooter>
        </Card>
        
        {/* Result Card */}
        <Card>
          <CardHeader>
            <CardTitle>2. Generated Plan</CardTitle>
            <CardDescription>Review the generated seating arrangement below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
            {plan ? (
              <div className="space-y-4">
                {Object.entries(plan.arrangement).map(([roomName, seatedStudents]) => (
                  <div key={roomName}>
                    <h3 className="font-bold border-b pb-1 mb-2">{roomName} ({seatedStudents.length} Students)</h3>
                    <ul className="space-y-1 text-sm">
                      {seatedStudents.map(s => (
                        <li key={s.studentId} className="grid grid-cols-3 gap-2">
                           <span>Seat {s.seatNumber}</span>
                           <span>{s.studentName}</span>
                           <span className="text-muted-foreground">{s.rollNumber}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {plan.unassignedStudents.length > 0 && (
                  <div>
                    <h3 className="font-bold text-destructive border-b border-destructive/50 pb-1 mb-2">Unassigned Students ({plan.unassignedStudents.length})</h3>
                    <ul className="space-y-1 text-sm">
                       {plan.unassignedStudents.map(s => (
                        <li key={s.studentId} className="flex items-center gap-2">
                           <XCircle className="h-4 w-4 text-destructive" />
                           <span>{s.studentName} ({s.rollNumber})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-16">
                <p>The seating plan will appear here once generated.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownloadPdf} disabled={!plan} className="w-full">
              <FileDown className="mr-2 h-4 w-4" /> Download as PDF
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Hidden div for PDF generation */}
      <div id={reportId} className="hidden absolute -z-10 -left-[9999px] p-8 bg-white text-black w-[210mm]">
        {plan && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center">Exam Seating Arrangement</h1>
            <p className="text-center text-gray-600">{plan.summary}</p>
            {Object.entries(plan.arrangement).map(([roomName, seatedStudents]) => (
              <div key={roomName} className="page-break-before">
                <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-2">{roomName} ({seatedStudents.length} Students)</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Seat No.</th>
                            <th className="p-2 border">Student Name</th>
                            <th className="p-2 border">Roll Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {seatedStudents.map(s => (
                            <tr key={s.studentId}>
                                <td className="p-2 border">{s.seatNumber}</td>
                                <td className="p-2 border">{s.studentName}</td>
                                <td className="p-2 border">{s.rollNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            ))}
            {plan.unassignedStudents.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold text-red-600 border-b-2 border-red-600 pb-2 mb-2">Unassigned Students ({plan.unassignedStudents.length})</h2>
                <ul className="list-disc list-inside">
                  {plan.unassignedStudents.map(s => (
                    <li key={s.studentId}>{s.studentName} ({s.rollNumber})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
       <style>{`
        @media print {
            .page-break-before {
                page-break-before: always;
            }
        }
       `}</style>
    </div>
  );
}
