'use client';

import { useState, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCollegeData } from '@/context/college-data-context';

export function FeedbackAnalytics() {
  const { feedbackSessions, feedbackData } = useCollegeData();
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(feedbackSessions.find(s => s.status === 'closed')?.id);

  const analyticsData = useMemo(() => {
    if (!selectedSessionId) return { chartData: [], commentsBySubject: {} };
    
    const sessionFeedback = feedbackData.filter(fb => fb.sessionId === selectedSessionId);
    
    const subjectData = new Map<string, { ratings: number[], comments: string[] }>();

    sessionFeedback.forEach(fb => {
      if (!subjectData.has(fb.subject)) {
        subjectData.set(fb.subject, { ratings: [], comments: [] });
      }
      const data = subjectData.get(fb.subject)!;
      data.ratings.push(fb.rating);
      if (fb.comment) {
        data.comments.push(fb.comment);
      }
    });
    
    const chartData = Array.from(subjectData.entries()).map(([subject, data]) => ({
      subject,
      averageRating: data.ratings.length > 0 ? (data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length) : 0,
    }));

    const commentsBySubject = Array.from(subjectData.entries()).reduce((acc, [subject, data]) => {
      acc[subject] = data.comments;
      return acc;
    }, {} as Record<string, string[]>);

    return { chartData, commentsBySubject };

  }, [selectedSessionId, feedbackData]);
  
  const chartConfig = {
    averageRating: {
      label: 'Avg. Rating',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <div className="space-y-6">
      <div className="max-w-xs">
          <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
              <SelectTrigger>
                  <SelectValue placeholder="Select a feedback session" />
              </SelectTrigger>
              <SelectContent>
                  {feedbackSessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>{session.name}</SelectItem>
                  ))}
              </SelectContent>
          </Select>
      </div>
      
      {!selectedSessionId ? (
          <p className="text-center text-muted-foreground py-16">Please select a feedback session to view analytics.</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Average Ratings by Subject</CardTitle>
                    <CardDescription>Average student rating for each subject on a scale of 1-5.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-80 w-full">
                        <ResponsiveContainer>
                            <BarChart data={analyticsData.chartData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid horizontal={false} />
                                <YAxis 
                                    dataKey="subject" 
                                    type="category"
                                    tickLine={false}
                                    axisLine={false}
                                    width={120}
                                />
                                <XAxis dataKey="averageRating" type="number" domain={[0, 5]} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Bar dataKey="averageRating" fill="var(--color-averageRating)" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Anonymous Comments</CardTitle>
                    <CardDescription>Student comments submitted for each subject.</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[25rem] overflow-y-auto">
                    <Accordion type="single" collapsible className="w-full">
                        {Object.entries(analyticsData.commentsBySubject).map(([subject, comments]) => (
                            comments.length > 0 && (
                            <AccordionItem value={subject} key={subject}>
                                <AccordionTrigger>{subject} ({comments.length} comments)</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-3">
                                        {comments.map((comment, index) => (
                                            <blockquote key={index} className="border-l-2 pl-4 italic text-sm text-muted-foreground">
                                                "{comment}"
                                            </blockquote>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            )
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
