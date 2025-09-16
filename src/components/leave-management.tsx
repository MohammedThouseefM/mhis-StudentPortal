
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { CalendarPlus, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCollegeData } from '@/context/college-data-context';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from './ui/table';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from './ui/input';
import Loading from '../app/loading';

const leaveSchema = z.object({
  startDate: z.string().min(1, 'A start date is required.'),
  endDate: z.string().min(1, 'An end date is required.'),
  reason: z.string().min(10, 'Reason must be at least 10 characters.'),
}).refine((data) => {
    if (!data.startDate || !data.endDate) return true; // Don't validate if dates are not present
    return data.endDate >= data.startDate;
}, {
  message: "End date cannot be before start date.",
  path: ["endDate"], 
});

type LeaveFormData = z.infer<typeof leaveSchema>;

export function LeaveManagement() {
  const { toast } = useToast();
  const { leaveRequests, addLeaveRequest, currentUser } = useCollegeData();
  
  if (!currentUser || !('university_number' in currentUser)) {
    return <Loading />;
  }
  const studentId = currentUser.id;

  const studentLeaveRequests = leaveRequests.filter(req => req.studentId === studentId);

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      reason: '',
    },
  });

  const onSubmit = (data: LeaveFormData) => {
    addLeaveRequest(
      studentId,
      data.startDate,
      data.endDate,
      data.reason
    );
    toast({
      title: 'Leave Request Submitted!',
      description: 'Your request has been sent for approval.',
    });
    form.reset();
  };
  
  const statusVariant = {
    pending: 'secondary' as const,
    approved: 'default' as const,
    rejected: 'destructive' as const,
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarPlus /> Apply for Leave
            </CardTitle>
            <CardDescription>
              Fill out the form to request leave. Please apply at least 3 days in advance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="startDate" render={({ field }) => ( <FormItem> <FormLabel>Start Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                  <FormField control={form.control} name="endDate" render={({ field }) => ( <FormItem> <FormLabel>End Date</FormLabel> <FormControl><Input type="date" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Leave</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Explain your reason for leave in detail..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                  Submit Request
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>My Leave History</CardTitle>
            <CardDescription>A record of all your past and pending leave applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentLeaveRequests.length > 0 ? (
                    studentLeaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{format(parseISO(request.startDate), 'dd-MM-yyyy')}</TableCell>
                        <TableCell>{format(parseISO(request.endDate), 'dd-MM-yyyy')}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {request.status === 'rejected' && request.rejectionReason && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Reason: {request.rejectionReason}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <Badge variant={statusVariant[request.status]} className="capitalize">{request.status}</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        You haven't applied for any leave yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
