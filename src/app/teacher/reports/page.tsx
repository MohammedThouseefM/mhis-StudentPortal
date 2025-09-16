'use client';

import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getDefaulterReport } from '@/lib/actions';
import type { DefaulterReportOutput } from '@/ai/flows/defaulter-report-flow';
import { DepartmentAnalytics } from '@/components/department-analytics';
import { Separator } from '@/components/ui/separator';

export default function ReportsPage() {
    const { toast } = useToast();
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [reportData, setReportData] = useState<DefaulterReportOutput | null>(null);
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        const result = await getDefaulterReport();
        if (result.success && result.data) {
            setReportData(result.data);
            setIsReportDialogOpen(true);
        } else {
            toast({ variant: 'destructive', title: 'Report Failed', description: result.error });
        }
        setIsGeneratingReport(false);
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-6 w-6" /> AI-Powered Defaulter Report</CardTitle>
                    <CardDescription>Instantly generate an AI-summarized report of all students with attendance below the 75% threshold. Ideal for administrative review.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
                        {isGeneratingReport ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Report...</>) : (<><FileText className="mr-2 h-4 w-4" />Generate Defaulter Report</>)}
                    </Button>
                </CardContent>
            </Card>

            <Separator />
            
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">College Analytics</h2>
                <p className="text-muted-foreground">
                    An overview of attendance performance across different departments and classes.
                </p>
            </div>
            
            <DepartmentAnalytics />

            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Attendance Defaulter Report</DialogTitle>
                        <DialogDescription>An AI-generated summary and list of students with attendance below 75%.</DialogDescription>
                    </DialogHeader>
                    {reportData && (
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                            <blockquote className="mt-2 border-l-2 pl-6 italic">"{reportData.summary}"</blockquote>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Roll No.</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead className="text-right">Attendance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.defaulters.map(student => (
                                            <TableRow key={student.id}>
                                                <TableCell>{student.rollNumber}</TableCell>
                                                <TableCell className="font-medium">{student.name}</TableCell>
                                                <TableCell>{student.department}</TableCell>
                                                <TableCell className="text-right text-destructive font-bold">{student.attendancePercentage}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
