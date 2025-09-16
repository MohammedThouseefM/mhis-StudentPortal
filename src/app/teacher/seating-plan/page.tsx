
'use client';

import { SeatingArrangementGenerator } from '@/components/seating-arrangement-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookCopy } from 'lucide-react';

export default function SeatingPlanPage() {
    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookCopy className="h-6 w-6" /> Exam Seating Plan Generator</CardTitle>
                    <CardDescription>Automatically generate seating plans based on roll number & room size, then export as a PDF.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SeatingArrangementGenerator />
                </CardContent>
            </Card>
        </div>
    );
}
