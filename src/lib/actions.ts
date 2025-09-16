'use server';
import { generateDefaulterReport } from '@/ai/flows/defaulter-report-flow';
import { getMotivationalQuote as getQuoteFlow } from '@/ai/flows/quote-flow';
import { generateSeatingArrangement, type SeatingArrangementInput } from '@/ai/flows/seating-arrangement-flow';
import { students, previousAttendanceData } from '@/lib/mock-data';

export async function getAttendancePrediction(input: AttendancePredictionInput) {
  try {
    const predictions = await predictAttendance(input);
    return { success: true, data: predictions };
  } catch (error) {
    console.error('Error in GenAI prediction:', error);
    return { success: false, error: 'Failed to get attendance prediction.' };
  }
}

export async function getDefaulterReport() {
    try {
        const report = await generateDefaulterReport({
            students: students.map(({id, name, rollNumber, department, year}) => ({id, name, rollNumber, department, year})),
            attendanceData: previousAttendanceData,
            threshold: 75,
        });
        return { success: true, data: report };
    } catch (error) {
        console.error('Error generating defaulter report:', error);
        return { success: false, error: 'Failed to generate defaulter report.' };
    }
}

export async function getQuote() {
  try {
    const result = await getQuoteFlow();
    return { success: true, data: result.quote };
  } catch (error) {
    console.error('Error getting motivational quote:', error);
    // Return a fallback quote on error
    return { success: false, data: "Believe you can and you're halfway there." };
  }
}

export async function getSeatingPlan(input: SeatingArrangementInput) {
    try {
        const plan = await generateSeatingArrangement(input);
        return { success: true, data: plan };
    } catch (error) {
        console.error('Error generating seating plan:', error);
        return { success: false, error: 'Failed to generate seating plan.' };
    }
}
