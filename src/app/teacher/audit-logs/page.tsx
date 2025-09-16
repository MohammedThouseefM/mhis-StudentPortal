
'use client';

import { formatDistanceToNow, format } from 'date-fns';
import { History, User, Users, Megaphone, CalendarCheck, CalendarX, ClipboardEdit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollegeData, type AuditLog } from '@/context/college-data-context';

const logIcons: Record<AuditLog['type'], React.ReactNode> = {
  student: <User className="h-4 w-4" />,
  teacher: <Users className="h-4 w-4" />,
  announcement: <Megaphone className="h-4 w-4" />,
  attendance: <CalendarCheck className="h-4 w-4" />,
  leave: <CalendarX className="h-4 w-4" />,
  academic: <ClipboardEdit className="h-4 w-4" />,
};

export default function AuditLogsPage() {
    const { auditLogs } = useCollegeData();
    
    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><History className="h-6 w-6" /> Audit Logs</CardTitle>
                    <CardDescription>A chronological record of all administrative actions taken in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[180px]">Timestamp</TableHead>
                                    <TableHead className="w-[120px]">User</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {auditLogs.length > 0 ? (
                                    auditLogs.map(log => (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-muted-foreground">
                                                {format(log.timestamp, 'dd-MM-yyyy, h:mm a')}
                                                <p className="text-xs">({formatDistanceToNow(log.timestamp, { addSuffix: true })})</p>
                                            </TableCell>
                                            <TableCell className="font-medium">{log.user}</TableCell>
                                            <TableCell>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-muted-foreground mt-0.5">{logIcons[log.type]}</span>
                                                    <span>{log.action}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">No audit logs found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
