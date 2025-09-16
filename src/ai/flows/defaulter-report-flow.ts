'use server';
/**
 * @fileOverview A Genkit flow to generate a report of students with low attendance.
 *
 * - generateDefaulterReport - Identifies students below an attendance threshold and generates a summary.
 * - DefaulterReportInput - The input type for the generateDefaulterReport function.
 * - DefaulterReportOutput - The return type for the generateDefaulterReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DefaulterStudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  rollNumber: z.string(),
  department: z.string(),
  year: z.string(),
  attendancePercentage: z.number(),
});

const DefaulterReportInputSchema = z.object({
  students: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      rollNumber: z.string(),
      department: z.string(),
      year: z.string(),
    })
  ),
  attendanceData: z.array(
    z.object({
      studentId: z.string(),
      attendanceStatus: z.enum(['present', 'absent']),
    })
  ),
  threshold: z.number().describe("The attendance percentage threshold below which students are considered defaulters."),
});
export type DefaulterReportInput = z.infer<typeof DefaulterReportInputSchema>;


const DefaulterReportOutputSchema = z.object({
  summary: z.string().describe("A brief, professional summary of the attendance defaulter report."),
  defaulters: z.array(DefaulterStudentSchema),
});
export type DefaulterReportOutput = z.infer<typeof DefaulterReportOutputSchema>;

export async function generateDefaulterReport(input: DefaulterReportInput): Promise<DefaulterReportOutput> {
  return defaulterReportFlow(input);
}

const reportPrompt = ai.definePrompt({
    name: 'defaulterReportPrompt',
    input: { schema: z.object({ defaulterList: z.string() }) },
    output: { schema: z.object({ summary: z.string() }) },
    prompt: `You are an administrative AI assistant for a college. You have been provided with a list of students who have low attendance. 
    
    Your task is to write a brief, professional summary of this report. The summary should be suitable for a Head of Department or Principal. 
    
    Mention the total number of students on the list and highlight the severity of the issue.

    Here is the list of students:
    {{defaulterList}}
    
    Provide only the summary text.`,
});


const defaulterReportFlow = ai.defineFlow(
  {
    name: 'defaulterReportFlow',
    inputSchema: DefaulterReportInputSchema,
    outputSchema: DefaulterReportOutputSchema,
  },
  async (input) => {
    const { students, attendanceData, threshold } = input;

    const attendanceCounts = new Map<string, { present: number; total: number }>();

    attendanceData.forEach(record => {
      if (!attendanceCounts.has(record.studentId)) {
        attendanceCounts.set(record.studentId, { present: 0, total: 0 });
      }
      const counts = attendanceCounts.get(record.studentId)!;
      counts.total++;
      if (record.attendanceStatus === 'present') {
        counts.present++;
      }
    });

    const defaulters: z.infer<typeof DefaulterStudentSchema>[] = [];
    students.forEach(student => {
      const counts = attendanceCounts.get(student.id);
      if (counts && counts.total > 0) {
        const percentage = Math.round((counts.present / counts.total) * 100);
        if (percentage < threshold) {
          defaulters.push({
            ...student,
            attendancePercentage: percentage,
          });
        }
      }
    });

    if (defaulters.length === 0) {
        return {
            summary: "No students were found below the attendance threshold. Great work by everyone!",
            defaulters: [],
        }
    }

    const defaulterListForPrompt = defaulters
      .map(d => `- ${d.name} (${d.rollNumber}), ${d.department} - ${d.year} (${d.attendancePercentage}% attendance)`)
      .join('\n');

    const { output } = await reportPrompt({ defaulterList: defaulterListForPrompt });
    
    return {
      summary: output!.summary,
      defaulters,
    };
  }
);
