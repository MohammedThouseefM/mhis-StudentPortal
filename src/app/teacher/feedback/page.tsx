
'use client';

import { FeedbackAnalytics } from '@/components/feedback-analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function FeedbackPage() {
    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star className="h-6 w-6" /> Student Feedback</CardTitle>
                    <CardDescription>Review aggregated anonymous feedback from students on subjects and teaching quality.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FeedbackAnalytics />
                </CardContent>
            </Card>
        </div>
    );
}
