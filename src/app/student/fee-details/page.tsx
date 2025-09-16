
'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, CreditCard, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

import { useCollegeData } from '@/context/college-data-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Loading from '@/app/loading';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

export default function FeeDetailsPage() {
  const { studentFeeDetails, currentUser } = useCollegeData();

  if (!currentUser || !('university_number' in currentUser)) {
    return <Loading />;
  }
  const student = currentUser;

  const feeHistory = studentFeeDetails[student.id] || [];

  const summary = useMemo(() => {
    return feeHistory.reduce(
      (acc, fee) => {
        acc.totalFee += fee.totalFee;
        acc.totalPaid += fee.paid;
        acc.totalBalance += fee.balance;
        return acc;
      },
      { totalFee: 0, totalPaid: 0, totalBalance: 0 }
    );
  }, [feeHistory]);

  const statusVariant = {
    Paid: 'default' as const,
    Pending: 'secondary' as const,
    Overdue: 'destructive' as const,
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/student/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold md:text-3xl">Fee Details</h1>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold sm:text-2xl">{formatCurrency(summary.totalFee)}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold sm:text-2xl">{formatCurrency(summary.totalPaid)}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold sm:text-2xl text-destructive">{formatCurrency(summary.totalBalance)}</div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard />
            Semester-wise Fee History
          </CardTitle>
          <CardDescription>
            A detailed breakdown of your fees for each semester.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Semester</TableHead>
                  <TableHead>Total Fee</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeHistory.length > 0 ? (
                  feeHistory.map((fee) => (
                    <TableRow key={fee.semester}>
                      <TableCell className="font-medium">{fee.semester}</TableCell>
                      <TableCell>{formatCurrency(fee.totalFee)}</TableCell>
                      <TableCell>{formatCurrency(fee.paid)}</TableCell>
                      <TableCell className={cn(fee.balance > 0 && 'text-destructive font-medium')}>
                        {formatCurrency(fee.balance)}
                      </TableCell>
                      <TableCell>{format(parseISO(fee.dueDate), 'dd-MM-yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={statusVariant[fee.status]} className="capitalize">{fee.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Fee details are not available yet.
                    </TableCell>
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
