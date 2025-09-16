
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCollegeData } from '@/context/college-data-context';
import { studentAttendance } from '@/lib/mock-data';
import { Slider } from '@/components/ui/slider';
import { isWithinInterval, parseISO } from 'date-fns';
import Loading from '@/app/loading';

const feedbackItemSchema = z.object({
  subject: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

const feedbackFormSchema = z.object({
  feedbacks: z.array(feedbackItemSchema),
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

export default function FeedbackPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { feedbackSessions, feedbackData, submitFeedback, currentUser } = useCollegeData();
  
  if (!currentUser || !('university_number' in currentUser)) {
    return <Loading />;
  }
  const student = currentUser;
  const subjects = studentAttendance.subjects; // Mock student's subjects

  const openSession = feedbackSessions.find(s => {
    const today = new Date();
    const start = parseISO(s.startDate);
    const end = parseISO(s.endDate);
    return s.status === 'open' && isWithinInterval(today, { start, end });
  });

  const hasSubmitted = openSession ? feedbackData.some(fb => fb.sessionId === openSession.id && fb.studentId === student.id) : false;

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      feedbacks: subjects.map(subject => ({
        subject: subject.name,
        rating: 3,
        comment: '',
      })),
    },
  });
  
  const { fields } = useFieldArray({
    control: form.control,
    name: 'feedbacks',
  });

  const onSubmit = (data: FeedbackFormData) => {
    if (!openSession) {
        toast({ variant: 'destructive', title: 'Error', description: 'No active feedback session found.' });
        return;
    }
    submitFeedback(openSession.id, student.id, data.feedbacks);
    toast({
      title: 'Feedback Submitted!',
      description: 'Thank you for your valuable input. It has been recorded anonymously.',
      duration: 5000,
    });
    router.push('/student/dashboard');
  };
  
  if (!openSession) {
      return (
          <div className="p-4 md:p-8 text-center">
              <h1 className="text-2xl font-bold">Feedback Not Available</h1>
              <p className="text-muted-foreground mt-2">There are no open feedback sessions at this time.</p>
              <Button asChild className="mt-4">
                  <Link href="/student/dashboard">Go to Dashboard</Link>
              </Button>
          </div>
      )
  }

  if (hasSubmitted) {
      return (
          <div className="p-4 md:p-8 text-center">
              <h1 className="text-2xl font-bold text-green-600">Feedback Already Submitted</h1>
              <p className="text-muted-foreground mt-2">You have already provided feedback for the "{openSession.name}" session. Thank you!</p>
               <Button asChild className="mt-4">
                  <Link href="/student/dashboard">Go to Dashboard</Link>
              </Button>
          </div>
      )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/student/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold">Course Feedback</h1>
            <p className="text-muted-foreground">{openSession.name}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Feedback</CardTitle>
          <CardDescription>
            Your responses are anonymous and will be used to improve teaching quality. Please rate each subject from 1 (Poor) to 5 (Excellent).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg">{field.subject}</h3>
                  <FormField
                    control={form.control}
                    name={`feedbacks.${index}.rating`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                            <span><Star className="inline-block mr-2 h-4 w-4" />Rating</span>
                            <span className="px-2 py-1 text-sm rounded-md bg-primary text-primary-foreground">{field.value} / 5</span>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`feedbacks.${index}.comment`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><MessageSquare className="inline-block mr-2 h-4 w-4" />Comments (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Share any specific feedback or suggestions..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90">
                  Submit Anonymous Feedback
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
