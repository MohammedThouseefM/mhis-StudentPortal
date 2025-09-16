'use server';
/**
 * @fileOverview A Genkit flow to generate exam seating arrangements.
 *
 * - generateSeatingArrangement - Creates a seating plan based on students and rooms.
 * - SeatingArrangementInput - The input type for the flow.
 * - SeatingArrangementOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  rollNumber: z.string(),
});

const RoomSchema = z.object({
  name: z.string(),
  capacity: z.number().int().positive(),
});

const SeatingArrangementInputSchema = z.object({
  students: z.array(StudentSchema).describe("An array of students to be seated."),
  rooms: z.array(RoomSchema).describe("An array of available rooms with their capacities."),
});
export type SeatingArrangementInput = z.infer<typeof SeatingArrangementInputSchema>;

const SeatingArrangementOutputSchema = z.object({
  arrangement: z.record(
    z.string(),
    z.array(
      z.object({
        studentId: z.string(),
        studentName: z.string(),
        rollNumber: z.string(),
        seatNumber: z.number(),
      })
    )
  ).describe("An object where keys are room names and values are arrays of students seated in that room."),
  unassignedStudents: z.array(StudentSchema).describe("A list of students who could not be seated due to lack of space."),
  summary: z.string().describe("A brief summary of the seating arrangement process, e.g., 'Seated X students in Y rooms with Z students unassigned.'"),
});
export type SeatingArrangementOutput = z.infer<typeof SeatingArrangementOutputSchema>;


export async function generateSeatingArrangement(input: SeatingArrangementInput): Promise<SeatingArrangementOutput> {
  return seatingArrangementFlow(input);
}


const arrangementPrompt = ai.definePrompt({
    name: 'seatingArrangementPrompt',
    input: { schema: SeatingArrangementInputSchema },
    output: { schema: SeatingArrangementOutputSchema },
    prompt: `You are an expert exam coordinator responsible for creating seating arrangements.
    
    Your task is to assign students to seats in the available rooms based on their roll numbers.
    
    Follow these rules strictly:
    1.  Sort the students by their \`rollNumber\` in ascending order.
    2.  Fill the rooms one by one, in the order they are provided in the \`rooms\` array.
    3.  Assign students to seat numbers sequentially, starting from 1 in each room.
    4.  Do not exceed the capacity of any room.
    5.  If you run out of seats, place the remaining students in the \`unassignedStudents\` list.
    6.  The output must be a valid JSON object matching the provided schema. The \`arrangement\` object keys must be the exact room names provided.
    7.  Provide a concise summary of the result in the \`summary\` field.

    Students to be seated:
    {{#each students}}
    - ID: {{id}}, Name: {{name}}, Roll No: {{rollNumber}}
    {{/each}}
    
    Available Rooms:
    {{#each rooms}}
    - Name: {{name}}, Capacity: {{capacity}}
    {{/each}}`,
});


const seatingArrangementFlow = ai.defineFlow(
  {
    name: 'seatingArrangementFlow',
    inputSchema: SeatingArrangementInputSchema,
    outputSchema: SeatingArrangementOutputSchema,
  },
  async (input) => {
    // Sort students by roll number before sending to the prompt
    const sortedStudents = [...input.students].sort((a, b) => 
        a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true, sensitivity: 'base' })
    );

    const totalCapacity = input.rooms.reduce((acc, room) => acc + room.capacity, 0);

    if (totalCapacity < sortedStudents.length) {
      // It's better to handle this logic here than relying on the LLM for complex failure cases.
      // The LLM can handle the standard assignment.
      console.warn("Total room capacity is less than the number of students.");
    }

    const { output } = await arrangementPrompt({ ...input, students: sortedStudents });
    return output!;
  }
);
