'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { useCollegeData } from '@/context/college-data-context';
import { students } from '@/lib/mock-data';
import { isWithinInterval, parseISO } from 'date-fns';

function FeedbackCardComponent() {
  const { feedbackSessions, feedbackData } = useCollegeData();
  const studentId = students[0].id; // Mock student

  const openSession = feedbackSessions.find(s => {
    const today = new Date();
    const start = parseISO(s.startDate);
    const end = parseISO(s.endDate);
    return s.status === 'open' && isWithinInterval(today, { start, end });
  });

  const hasSubmitted = openSession ? feedbackData.some(fb => fb.sessionId === openSession.id && fb.studentId === studentId) : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-6 w-6 text-yellow-400" />
          <span>Course Feedback</span>
        </CardTitle>
        <CardDescription>
          {openSession ? openSession.name : 'Share your anonymous feedback.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!openSession ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            There are no active feedback sessions right now.
          </p>
        ) : hasSubmitted ? (
          <p className="text-sm text-center py-2 text-green-600 dark:text-green-400 font-medium">
            Thank you for submitting your feedback for this session!
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Your feedback is valuable to us and completely anonymous. Please take a moment to rate your subjects.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/student/feedback">
                Provide Feedback <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export const FeedbackCard = memo(FeedbackCardComponent);
