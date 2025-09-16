
'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Check, X, Send, CalendarX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { type LeaveRequest } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCollegeData } from '@/context/college-data-context';
import { Label } from '@/components/ui/label';

export default function LeaveRequestsPage() {
    const { toast } = useToast();
    const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } = useCollegeData();
    const currentTeacherId = 'TEACHER01';
    
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveRequest | null>(null);

    const pendingLeaveRequests = leaveRequests.filter(r => r.status === 'pending');

    const handleApproveLeave = (request: LeaveRequest) => {
        approveLeaveRequest(request.id, currentTeacherId);
        toast({ title: 'Leave Approved', description: `Leave request for ${request.studentName} has been approved.` });
    };

    const handleOpenRejectDialog = (request: LeaveRequest) => {
        setSelectedLeaveRequest(request);
        setIsRejectDialogOpen(true);
    };

    const handleConfirmRejection = () => {
        if (selectedLeaveRequest && rejectionReason) {
            rejectLeaveRequest(selectedLeaveRequest.id, rejectionReason, currentTeacherId);
            toast({
                variant: 'destructive',
                title: 'Leave Rejected',
                description: `Leave request for ${selectedLeaveRequest.studentName} has been rejected.`,
            });
            setIsRejectDialogOpen(false);
            setRejectionReason('');
            setSelectedLeaveRequest(null);
        } else {
            toast({
                variant: 'destructive',
                title: 'Reason Required',
                description: `Please provide a reason for rejection.`,
            });
        }
    };

    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarX className="h-6 w-6" /> Leave Requests</CardTitle>
                    <CardDescription>Review and respond to pending leave requests from students.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingLeaveRequests.length > 0 ? (
                                    pendingLeaveRequests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell className="font-medium">{request.studentName}</TableCell>
                                            <TableCell>{request.department} - {request.year}</TableCell>
                                            <TableCell>{format(parseISO(request.startDate), 'dd-MM-yyyy')} - {format(parseISO(request.endDate), 'dd-MM-yyyy')}</TableCell>
                                            <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-100" onClick={() => handleApproveLeave(request)}>
                                                    <Check className="h-4 w-4" />
                                                    <span className="sr-only">Approve</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleOpenRejectDialog(request)}>
                                                    <X className="h-4 w-4" />
                                                    <span className="sr-only">Reject</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No pending leave requests.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Leave Request</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting the leave request for {selectedLeaveRequest?.studentName}. This will be visible to the student.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="rejection-reason">Rejection Reason</Label>
                            <Textarea
                                id="rejection-reason"
                                placeholder="e.g., Medical certificate not attached, conflicting with exam schedule..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleConfirmRejection} className="bg-destructive hover:bg-destructive/90">
                            <Send className="mr-2 h-4 w-4" />
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
