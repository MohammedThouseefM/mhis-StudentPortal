import { config } from 'dotenv';
config();

import '@/ai/flows/attendance-prediction.ts';
import '@/ai/flows/defaulter-report-flow.ts';
import '@/ai/flows/quote-flow.ts';
import '@/ai/flows/seating-arrangement-flow.ts';
