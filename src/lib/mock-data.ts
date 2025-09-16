
import { subDays } from 'date-fns';

// Mock data for the application

export type Student = {
  id: string; // university_number
  rollNumber: string;
  name: string;
  dob: string;
  university_number: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  fatherContactNumber: string;
  photoUrl?: string;
  gender: 'Male' | 'Female' | 'Other';
  currentSemester: string;
  academicYear: string;
  address: string;
  isActive: boolean;
};

export type AttendanceRecord = {
  studentId: string;
  subject: string;
  date: string;
  status: 'present' | 'absent';
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export type CalendarEvent = {
  date: string; // YYYY-MM-DD
  title: string;
  type: 'holiday' | 'exam' | 'assignment' | 'event';
  description?: string;
};

export type ClassTimeTable = {
  [day: string]: string[];
};

export type DepartmentTimeTable = {
  [year: string]: ClassTimeTable;
};

export type FullTimeTable = {
  [department: string]: DepartmentTimeTable;
};

export type Exam = {
  id: string;
  subjectCode: string;
  subject: string;
  date: string;
  time: string;
};

export type DepartmentExamTimeTable = {
  [year: string]: Exam[];
};

export type FullExamTimeTable = {
  [department: string]: DepartmentExamTimeTable;
};

export type Teacher = {
  id: string;
  password: string;
  name: string;
  isActive: boolean;
};

export type DailyAttendance = {
  hour: string;
  subject: string;
  status: 'present' | 'absent' | 'not-marked';
};

export type LeaveRequest = {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  year: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
};

export type AuditLog = {
    id: string;
    timestamp: Date;
    user: string; // Teacher ID
    action: string;
    type: 'student' | 'teacher' | 'announcement' | 'attendance' | 'leave' | 'academic';
};

export type FeedbackSession = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'open' | 'closed';
};

export type Feedback = {
    id: string;
    sessionId: string;
    studentId: string; // Kept for preventing duplicate submissions, but not shown in analytics
    subject: string;
    rating: number; // 1 to 5
    comment?: string;
};

export type SemesterFee = {
  semester: string;
  totalFee: number;
  paid: number;
  balance: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string; // YYYY-MM-DD
};

export type StudentFeeDetails = {
  [studentId: string]: SemesterFee[];
};

export type SubjectResult = {
  subjectCode: string;
  subjectName: string;
  ciaMarks: number;
  semesterMarks: number;
  totalMarks: number;
  grade: string;
  resultStatus: 'Pass' | 'Fail';
};

export type SemesterResult = {
  semester: string; // e.g., '5th'
  results: SubjectResult[];
  gpa: number;
  overallResult: 'Pass' | 'Fail';
};

export type StudentResults = {
  [studentId: string]: StudentResult[];
};

export const teachers: Teacher[] = [
    { id: 'TEACHER01', password: 'Teacher@Pass1', name: 'Dr. Evelyn Reed', isActive: true },
    { id: 'TEACHER02', password: 'Professor@Pass2', name: 'Prof. Samuel Cruz', isActive: true }
];

const rawStudentData = {
  "BCA": {
    "1st_year": [
      { "full_name": "Mohammed Thouseef M", "email": "mthncidbi@gmail.com", "phone_number": "4567876548", "father_phone_number": "4578965498", "roll_number": 1, "registration_number": "36623u09001", "department": "BCA", "year": "1st", "date_of_birth": "01-01-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "22 Mosque Street, Katpadi, Vellore District" },
      { "full_name": "Priya Sharma", "email": "priya.sharma@example.com", "phone_number": "9876543205", "father_phone_number": "8765432104", "roll_number": 2, "registration_number": "36623u09002", "department": "BCA", "year": "1st", "date_of_birth": "15-05-2003", "gender": "female", "current_semester": "1st", "academic_year": "2023-2024", "address": "45 Gandhi Road, Gudiyatham, Vellore District" },
      { "full_name": "Rahul Kumar", "email": "rahul.kumar@example.com", "phone_number": "7890123456", "father_phone_number": "8901234567", "roll_number": 3, "registration_number": "36623u09003", "department": "BCA", "year": "1st", "date_of_birth": "22-08-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "12 Nehru Nagar, Arakkonam, Vellore District" },
      { "full_name": "Anjali Patel", "email": "anjali.patel@example.com", "phone_number": "6789012345", "father_phone_number": "7890123456", "roll_number": 4, "registration_number": "36623u09004", "department": "BCA", "year": "1st", "date_of_birth": "10-03-2003", "gender": "female", "current_semester": "1st", "academic_year": "2023-2024", "address": "32 Patel Street, Walajapet, Vellore District" },
      { "full_name": "Vikram Singh", "email": "vikram.singh@example.com", "phone_number": "8901234567", "father_phone_number": "9012345678", "roll_number": 5, "registration_number": "36623u09005", "department": "BCA", "year": "1st", "date_of_birth": "05-12-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "7 Fort Road, Vellore Town" }
    ],
    "2nd_year": [
      { "full_name": "Sneha Reddy", "email": "sneha.reddy@example.com", "phone_number": "9012345678", "father_phone_number": "0123456789", "roll_number": 6, "registration_number": "36624u09006", "department": "BCA", "year": "2nd", "date_of_birth": "18-07-2002", "gender": "female", "current_semester": "3rd", "academic_year": "2023-2025", "address": "56 Reddy Colony, Ambur, Vellore District" },
      { "full_name": "Arjun Mehta", "email": "arjun.mehta@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 7, "registration_number": "36624u09007", "department": "BCA", "year": "2nd", "date_of_birth": "14-09-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "23 Mehta Lane, Vaniyambadi, Vellore District" },
      { "full_name": "Divya Nair", "email": "divya.nair@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 8, "registration_number": "36624u09008", "department": "BCA", "year": "2nd", "date_of_birth": "25-04-2002", "gender": "female", "current_semester": "3rd", "academic_year": "2023-2025", "address": "89 Nair Gardens, Jolarpet, Vellore District" },
      { "full_name": "Karthik Iyer", "email": "karthik.iyer@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 9, "registration_number": "36624u09009", "department": "BCA", "year": "2nd", "date_of_birth": "30-11-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "67 Iyer Street, Alangayam, Vellore District" },
      { "full_name": "Meera Joshi", "email": "meera.joshi@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 10, "registration_number": "36624u09010", "department": "BCA", "year": "2nd", "date_of_birth": "08-06-2002", "gender": "female", "current_semester": "3rd", "academic_year": "2023-2025", "address": "34 Joshi Nagar, Melvisharam, Vellore District" }
    ],
    "3rd_year": [
      { "full_name": "Sanjay Gupta", "email": "sanjay.gupta@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 11, "registration_number": "36625u09011", "department": "BCA", "year": "3rd", "date_of_birth": "19-02-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "78 Gupta Complex, Pernambut, Vellore District" },
      { "full_name": "Aanya Khanna", "email": "aanya.khanna@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 12, "registration_number": "36625u09012", "department": "BCA", "year": "3rd", "date_of_birth": "14-09-2001", "gender": "female", "current_semester": "5th", "academic_year": "2023-2026", "address": "23 Khanna Residency, Sathuvachari, Vellore District" },
      { "full_name": "Vedant Malhotra", "email": "vedant.malhotra@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 13, "registration_number": "36625u09013", "department": "BCA", "year": "3rd", "date_of_birth": "25-04-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "45 Malhotra Enclave, Viruthampet, Vellore District" },
      { "full_name": "Myra Chatterjee", "email": "myra.chat@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 14, "registration_number": "36625u09014", "department": "BCA", "year": "3rd", "date_of_birth": "30-11-2001", "gender": "female", "current_semester": "5th", "academic_year": "2023-2026", "address": "67 Chatterjee Lane, Pallikonda, Vellore District" },
      { "full_name": "Kabir Bedi", "email": "kabir.bedi@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 15, "registration_number": "36625u09015", "department": "BCA", "year": "3rd", "date_of_birth": "08-06-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "34 Bedi Nagar, Kaniyambadi, Vellore District" }
    ]
  },
  "BSc": {
    "1st_year": [
      { "full_name": "Mohammed Ayaan Khan", "email": "ayaan.khan@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 1, "registration_number": "36625u08001", "department": "BSc", "year": "1st", "date_of_birth": "09-04-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "45 Khan Villa, Nemili, Vellore District" },
      { "full_name": "Abdul Rahman Siddiqui", "email": "abdul.siddiqui@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 2, "registration_number": "36625u08002", "department": "BSc", "year": "1st", "date_of_birth": "12-11-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "78 Siddiqui Nagar, Natrampalli, Vellore District" },
      { "full_name": "Zain Ahmed Sheikh", "email": "zain.sheikh@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 3, "registration_number": "36625u08003", "department": "BSc", "year": "1st", "date_of_birth": "18-07-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "32 Sheikh Street, K.V. Kuppam, Vellore District" },
      { "full_name": "Ibrahim Hussain Malik", "email": "ibrahim.malik@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 4, "registration_number": "36625u08004", "department": "BSc", "year": "1st", "date_of_birth": "22-09-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "12 Malik Apartments, Gudiyatham, Vellore District" },
      { "full_name": "Yusuf Mohammed Ansari", "email": "yusuf.ansari@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 5, "registration_number": "36625u08005", "department": "BSc", "year": "1st", "date_of_birth": "30-01-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "89 Ansari Colony, Jolarpet, Vellore District" }
    ],
    "2nd_year": [
      { "full_name": "Mohammed Farhan Ali", "email": "farhan.ali@example.com", "phone_number": "2109876543", "father_phone_number": "1098765432", "roll_number": 6, "registration_number": "36624u08006", "department": "BSc", "year": "2nd", "date_of_birth": "14-05-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "56 Ali Mansion, Alangayam, Vellore District" },
      { "full_name": "Abdullah Khan Pathan", "email": "abdullah.pathan@example.com", "phone_number": "1098765432", "father_phone_number": "0987654321", "roll_number": 7, "registration_number": "36624u08007", "department": "BSc", "year": "2nd", "date_of_birth": "22-08-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "78 Pathan Street, Ambur, Vellore District" },
      { "full_name": "Armaan Mohammed Siddique", "email": "armaan.siddique@example.com", "phone_number": "0987654321", "father_phone_number": "9876543205", "roll_number": 8, "registration_number": "36624u08008", "department": "BSc", "year": "2nd", "date_of_birth": "03-12-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "34 Siddique Plaza, Vaniyambadi, Vellore District" },
      { "full_name": "Rehan Ahmed Qureshi", "email": "rehan.qureshi@example.com", "phone_number": "9876543205", "father_phone_number": "8765432104", "roll_number": 9, "registration_number": "36624u08009", "department": "BSc", "year": "2nd", "date_of_birth": "19-04-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "12 Qureshi Nagar, Pernambut, Vellore District" },
      { "full_name": "Saifuddin Ibrahim Khan", "email": "saifuddin.khan@example.com", "phone_number": "8765432104", "father_phone_number": "7654321098", "roll_number": 10, "registration_number": "36624u08010", "department": "BSc", "year": "2nd", "date_of_birth": "27-09-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "90 Khan Residency, Walajapet, Vellore District" }
    ],
    "3rd_year": [
      { "full_name": "Mohammed Asif Hussain", "email": "asif.hussain@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 11, "registration_number": "36623u08011", "department": "BSc", "year": "3rd", "date_of_birth": "08-03-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "25 Hussain Complex, Katpadi, Vellore District" },
      { "full_name": "Abdul Hameed Khan", "email": "hameed.khan@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 12, "registration_number": "36623u08012", "department": "BSc", "year": "3rd", "date_of_birth": "15-07-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "42 Khan Mansion, Gudiyatham, Vellore District" },
      { "full_name": "Zubair Ahmed Siddiqui", "email": "zubair.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 13, "registration_number": "36623u08013", "department": "BSc", "year": "3rd", "date_of_birth": "22-11-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "17 Siddiqui Lane, Arakkonam, Vellore District" },
      { "full_name": "Faisal Mohammed Rahman", "email": "faisal.rahman@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 14, "registration_number": "36623u08014", "department": "BSc", "year": "3rd", "date_of_birth": "30-05-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "39 Rahman Colony, Ambur, Vellore District" },
      { "full_name": "Shahid Akhtar Malik", "email": "shahid.malik@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 15, "registration_number": "36623u08015", "department": "BSc", "year": "3rd", "date_of_birth": "12-09-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "63 Malik Street, Vaniyambadi, Vellore District" }
    ]
  },
  "BCom": {
    "1st_year": [
      { "full_name": "Mohammed Amaan Khan", "email": "amaan.khan@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 1, "registration_number": "36625u10001", "department": "BCom", "year": "1st", "date_of_birth": "12-05-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "34 Khan Plaza, Pallikonda, Vellore District" },
      { "full_name": "Abdul Qadir Sheikh", "email": "qadir.sheikh@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 2, "registration_number": "36625u10002", "department": "BCom", "year": "1st", "date_of_birth": "23-08-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "78 Sheikh Nagar, Kaniyambadi, Vellore District" },
      { "full_name": "Zeeshan Ahmed Siddiqui", "email": "zeeshan.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 3, "registration_number": "36625u10003", "department": "BCom", "year": "1st", "date_of_birth": "07-01-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "15 Siddiqui Street, Sathuvachari, Vellore District" },
      { "full_name": "Irfan Mohammed Malik", "email": "irfan.malik@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 4, "registration_number": "36625u10004", "department": "BCom", "year": "1st", "date_of_birth": "19-04-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "92 Malik Residency, Viruthampet, Vellore District" },
      { "full_name": "Yunus Ibrahim Ansari", "email": "yunus.ansari@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 5, "registration_number": "36625u10005", "department": "BCom", "year": "1st", "date_of_birth": "30-11-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "56 Ansari Colony, Nemili, Vellore District" }
    ],
    "2nd_year": [
      { "full_name": "Mohammed Arhaan Khan", "email": "arhaan.khan@example.com", "phone_number": "2109876543", "father_phone_number": "1098765432", "roll_number": 6, "registration_number": "36624u10006", "department": "BCom", "year": "2nd", "date_of_birth": "15-06-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "67 Khan Mansion, Natrampalli, Vellore District" },
      { "full_name": "Abdul Sami Sheikh", "email": "sami.sheikh@example.com", "phone_number": "1098765432", "father_phone_number": "0987654321", "roll_number": 7, "registration_number": "36624u10007", "department": "BCom", "year": "2nd", "date_of_birth": "28-09-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "43 Sheikh Plaza, K.V. Kuppam, Vellore District" },
      { "full_name": "Zaid Ahmed Qureshi", "email": "zaid.qureshi@example.com", "phone_number": "0987654321", "father_phone_number": "9876543205", "roll_number": 8, "registration_number": "36624u10008", "department": "BCom", "year": "2nd", "date_of_birth": "12-02-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "19 Qureshi Street, Alangayam, Vellore District" },
      { "full_name": "Fahad Mohammed Siddiqui", "email": "fahad.siddiqui@example.com", "phone_number": "9876543205", "father_phone_number": "8765432104", "roll_number": 9, "registration_number": "36624u10009", "department": "BCom", "year": "2nd", "date_of_birth": "05-11-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "81 Siddiqui Nagar, Jolarpet, Vellore District" },
      { "full_name": "Saad Abdullah Malik", "email": "saad.malik@example.com", "phone_number": "8765432104", "father_phone_number": "7654321098", "roll_number": 10, "registration_number": "36624u10010", "department": "BCom", "year": "2nd", "date_of_birth": "24-04-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "52 Malik Colony, Pernambut, Vellore District" }
    ],
    "3rd_year": [
      { "full_name": "Mohammed Faizan Khan", "email": "faizan.khan@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 11, "registration_number": "36623u10011", "department": "BCom", "year": "3rd", "date_of_birth": "08-03-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "25 Khan Towers, Walajapet, Vellore District" },
      { "full_name": "Abdul Basit Sheikh", "email": "basit.sheikh@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 12, "registration_number": "36623u10012", "department": "BCom", "year": "3rd", "date_of_birth": "17-07-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "42 Sheikh Residency, Ambur, Vellore District" },
      { "full_name": "Usman Ahmed Siddiqui", "email": "usman.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 13, "registration_number": "36623u10013", "department": "BCom", "year": "3rd", "date_of_birth": "22-11-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "17 Siddiqui Lane, Vaniyambadi, Vellore District" },
      { "full_name": "Tariq Mohammed Qureshi", "email": "tariq.qureshi@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 14, "registration_number": "36623u10014", "department": "BCom", "year": "3rd", "date_of_birth": "30-05-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "39 Qureshi Colony, Gudiyatham, Vellore District" },
      { "full_name": "Imran Akhtar Malik", "email": "imran.malik@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 15, "registration_number": "36623u10015", "department": "BCom", "year": "3rd", "date_of_birth": "12-09-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "63 Malik Street, Arakkonam, Vellore District" }
    ]
  },
  "BBA": {
    "1st_year": [
      { "full_name": "Mohammed Ayaan Khan", "email": "ayaan.khan@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 1, "registration_number": "36625u11001", "department": "BBA", "year": "1st", "date_of_birth": "12-05-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "34 Khan Plaza, Katpadi, Vellore District" },
      { "full_name": "Abdul Hadi Sheikh", "email": "hadi.sheikh@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 2, "registration_number": "36625u11002", "department": "BBA", "year": "1st", "date_of_birth": "23-08-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "78 Sheikh Nagar, Pernambut, Vellore District" },
      { "full_name": "Zainul Abideen Siddiqui", "email": "zainul.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 3, "registration_number": "36625u11003", "department": "BBA", "year": "1st", "date_of_birth": "07-01-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "15 Siddiqui Street, Melvisharam, Vellore District" },
      { "full_name": "Faris Mohammed Malik", "email": "faris.malik@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 4, "registration_number": "36625u11004", "department": "BBA", "year": "1st", "date_of_birth": "19-04-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "92 Malik Residency, Pallikonda, Vellore District" },
      { "full_name": "Yasin Ibrahim Ansari", "email": "yasin.ansari@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 5, "registration_number": "36625u11005", "department": "BBA", "year": "1st", "date_of_birth": "30-11-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "56 Ansari Colony, Kaniyambadi, Vellore District" }
    ],
    "2nd_year": [
      { "full_name": "Mohammed Arham Khan", "email": "arham.khan@example.com", "phone_number": "2109876543", "father_phone_number": "1098765432", "roll_number": 6, "registration_number": "36624u11006", "department": "BBA", "year": "2nd", "date_of_birth": "14-06-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "67 Khan Mansion, Sathuvachari, Vellore District" },
      { "full_name": "Abdul Samad Sheikh", "email": "samad.sheikh@example.com", "phone_number": "1098765432", "father_phone_number": "0987654321", "roll_number": 7, "registration_number": "36624u11007", "department": "BBA", "year": "2nd", "date_of_birth": "28-09-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "43 Sheikh Plaza, Viruthampet, Vellore District" },
      { "full_name": "Zaid Ahmed Qureshi", "email": "zaid.qureshi@example.com", "phone_number": "0987654321", "father_phone_number": "9876543205", "roll_number": 8, "registration_number": "36624u11008", "department": "BBA", "year": "2nd", "date_of_birth": "12-02-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "19 Qureshi Street, Nemili, Vellore District" },
      { "full_name": "Fahad Mohammed Siddiqui", "email": "fahad.siddiqui@example.com", "phone_number": "9876543205", "father_phone_number": "8765432104", "roll_number": 9, "registration_number": "36624u11009", "department": "BBA", "year": "2nd", "date_of_birth": "05-11-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "81 Siddiqui Nagar, Natrampalli, Vellore District" },
      { "full_name": "Saad Abdullah Malik", "email": "saad.malik@example.com", "phone_number": "8765432104", "father_phone_number": "7654321098", "roll_number": 10, "registration_number": "36624u11010", "department": "BBA", "year": "2nd", "date_of_birth": "24-04-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "52 Malik Colony, K.V. Kuppam, Vellore District" }
    ],
    "3rd_year": [
      { "full_name": "Mohammed Faizan Khan", "email": "faizan.khan@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 11, "registration_number": "36623u11011", "department": "BBA", "year": "3rd", "date_of_birth": "08-03-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "25 Khan Towers, Alangayam, Vellore District" },
      { "full_name": "Abdul Basit Sheikh", "email": "basit.sheikh@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 12, "registration_number": "36623u11012", "department": "BBA", "year": "3rd", "date_of_birth": "17-07-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "42 Sheikh Residency, Jolarpet, Vellore District" },
      { "full_name": "Usman Ahmed Siddiqui", "email": "usman.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 13, "registration_number": "36623u11013", "department": "BBA", "year": "3rd", "date_of_birth": "22-11-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "17 Siddiqui Lane, Pernambut, Vellore District" },
      { "full_name": "Tariq Mohammed Qureshi", "email": "tariq.qureshi@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 14, "registration_number": "36623u11014", "department": "BBA", "year": "3rd", "date_of_birth": "30-05-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "39 Qureshi Colony, Walajapet, Vellore District" },
      { "full_name": "Imran Akhtar Malik", "email": "imran.malik@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 15, "registration_number": "36623u11015", "department": "BBA", "year": "3rd", "date_of_birth": "12-09-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "63 Malik Street, Ambur, Vellore District" }
    ]
  }
}

const yearMap: { [key: string]: string } = {
  "1st_year": "1st Year",
  "2nd_year": "2nd Year",
  "3rd_year": "3rd Year",
}
const genderMap: { [key: string]: 'Male' | 'Female' | 'Other' } = {
  "male": "Male",
  "female": "Female",
}

const usedRegNumbers = new Set<string>();
let duplicateCounter = 1;

const processedStudents: Student[] = Object.values(rawStudentData).flatMap(deptData => {
  return Object.entries(deptData).flatMap(([yearKey, studentsData]) => {
    return studentsData.map(s => {
      let regNum = s.registration_number.toLowerCase();
      
      // Ensure unique registration number
      if (usedRegNumbers.has(regNum)) {
        regNum = `${regNum}-${duplicateCounter++}`;
      }
      usedRegNumbers.add(regNum);
      
      const [day, month, year] = s.date_of_birth.split('-');
      const formattedDob = `${year}-${month}-${day}`;

      return {
        id: regNum,
        name: s.full_name,
        email: s.email,
        phone: s.phone_number,
        fatherContactNumber: s.father_phone_number,
        rollNumber: String(s.roll_number),
        university_number: regNum,
        department: s.department,
        year: yearMap[yearKey] || s.year,
        dob: formattedDob,
        gender: genderMap[s.gender.toLowerCase()] || 'Other',
        currentSemester: s.current_semester,
        academicYear: s.academic_year,
        address: s.address,
        photoUrl: `https://placehold.co/200x200.png`,
        isActive: true,
      };
    })
  })
});

export const students: Student[] = processedStudents;

export const collegeData = {
    departments: ["BCA", "BSc", "BCom", "BBA"],
    years: ["1st Year", "2nd Year", "3rd Year"],
    hours: ["1st Hour", "2nd Hour", "3rd Hour", "4th Hour", "5th Hour", "6th Hour"],
};

export const defaultTimetable: ClassTimeTable = {
    D1: ['Maths', 'Physics', 'Chemistry', 'Lunch', 'English', 'Lab'],
    D2: ['Physics', 'Chemistry', 'Maths', 'Lunch', 'Lab', 'English'],
    D3: ['Chemistry', 'Maths', 'Physics', 'Lunch', 'English', 'Lab'],
    D4: ['Maths', 'Physics', 'Chemistry', 'Lunch', 'Lab', 'English'],
    D5: ['Physics', 'Chemistry', 'Maths', 'Lunch', 'English', 'Lab'],
    D6: ['Chemistry', 'Maths', 'Physics', 'Lunch', 'Lab', 'English'],
};

export const timeTable: FullTimeTable = {
    "BCA": { "1st Year": defaultTimetable, "2nd Year": defaultTimetable, "3rd Year": defaultTimetable },
    "BSc": { "1st Year": defaultTimetable, "2nd Year": defaultTimetable, "3rd Year": defaultTimetable },
    "BCom": { "1st Year": defaultTimetable, "2nd Year": defaultTimetable, "3rd Year": defaultTimetable },
    "BBA": { "1st Year": defaultTimetable, "2nd Year": defaultTimetable, "3rd Year": defaultTimetable },
};

export const examTimeTable: FullExamTimeTable = {
  "BCA": {
    "3rd Year": [
      { id: '1', subjectCode: 'BCA501', subject: 'Software Engineering', date: '2024-11-10', time: '10AM - 1PM' },
      { id: '2', subjectCode: 'BCA502', subject: 'Computer Networks', date: '2024-11-12', time: '10AM - 1PM' },
    ]
  }
};

export const academicCalendarEvents: CalendarEvent[] = [
  { date: '2024-08-15', title: 'Independence Day', type: 'holiday' },
  { date: '2024-09-05', title: 'Teachers\' Day', type: 'event' },
  { date: '2024-09-17', title: 'Internal Exams Start', type: 'exam', description: 'Internal assessment for all departments.' },
  { date: '2024-10-02', title: 'Gandhi Jayanti', type: 'holiday' },
  { date: '2024-10-20', title: 'Project Submissions', type: 'assignment', description: 'Final year project submissions.' },
  { date: '2024-11-01', title: 'Diwali Vacation Starts', type: 'holiday' },
  { date: '2024-11-15', title: 'College Reopens', type: 'event' },
  { date: '2024-12-10', title: 'Final Exams Start', type: 'exam', description: 'Semester-end examinations.' },
  { date: '2024-12-25', title: 'Christmas Day', type: 'holiday' },
];


export const pendingStudents: Student[] = [
  { id: '36623u09029', name: 'Zoya Khan', dob: '2005-05-20', university_number: '36623u09029', department: 'BCA', year: '1st Year', rollNumber: '3BCA-30', email: 'zoya.k@example.com', phone: '9123456780', fatherContactNumber: '9123456781', photoUrl: `https://placehold.co/200x200.png`, gender: 'Female', currentSemester: '1st', academicYear: '2024-2025', address: '123 New Street, Vellore', isActive: true }
];

export const leaveRequests: LeaveRequest[] = [
  { id: 'leave1', studentId: students[0].id, studentName: students[0].name, department: 'BCA', year: '1st Year', startDate: '2024-07-22', endDate: '2024-07-23', reason: 'Family function', status: 'approved' },
  { id: 'leave2', studentId: students[1].id, studentName: students[1].name, department: 'BCA', year: '1st Year', startDate: '2024-07-25', endDate: '2024-07-25', reason: 'Not feeling well', status: 'pending' },
  { id: 'leave3', studentId: students[0].id, studentName: students[0].name, department: 'BCA', year: '1st Year', startDate: '2024-07-10', endDate: '2024-07-11', reason: 'Medical emergency', status: 'rejected', rejectionReason: 'Medical certificate not provided.' },
];

export const announcements: Announcement[] = [
  { id: '1', title: 'Mid-term Exams Schedule', content: 'The mid-term exams for all departments will commence from the first week of September. Detailed schedule is available on the notice board.', date: '2024-08-01' },
  { id: '2', title: 'Sports Day 2024', content: 'The annual sports day will be held on August 25th. All students are encouraged to participate.', date: '2024-07-28' },
];

export const previousAttendanceData: { studentId: string; date: string; attendanceStatus: 'present' | 'absent' }[] = students.flatMap(student => {
  const records = [];
  for (let i = 0; i < 60; i++) {
    const isPresent = Math.random() > 0.2; // 80% chance of being present
    records.push({
      studentId: student.id,
      date: subDays(new Date(), i).toISOString().split('T')[0],
      attendanceStatus: isPresent ? 'present' : 'absent'
    });
  }
  return records;
});

// Helper to generate a random percentage
const randomPercentage = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const studentAttendance = {
  totalPercentage: randomPercentage(70, 95),
  subjects: [
    { name: 'Data Structures', percentage: randomPercentage(75, 90) },
    { name: 'Web Technology', percentage: randomPercentage(80, 95) },
    { name: 'Operating Systems', percentage: randomPercentage(65, 85) },
    { name: 'Database Management', percentage: randomPercentage(85, 98) },
    { name: 'Software Engineering', percentage: randomPercentage(70, 88) },
  ],
  monthly: [
    { month: 'Jan', present: randomPercentage(18, 22), total: 24 },
    { month: 'Feb', present: randomPercentage(20, 23), total: 24 },
    { month: 'Mar', present: randomPercentage(17, 21), total: 24 },
    { month: 'Apr', present: randomPercentage(21, 24), total: 24 },
    { month: 'May', present: randomPercentage(19, 22), total: 24 },
    { month: 'Jun', present: randomPercentage(22, 24), total: 24 },
  ],
};

export const dailyAttendanceData: DailyAttendance[] = [
  { hour: '1st Hour', subject: 'Data Structures', status: 'present' },
  { hour: '2nd Hour', subject: 'Web Technology', status: 'present' },
  { hour: '3rd Hour', subject: 'Operating Systems', status: 'absent' },
  { hour: '4th Hour', subject: 'Lunch', status: 'not-marked' },
  { hour: '5th Hour', subject: 'DBMS Lab', status: 'present' },
  { hour: '6th Hour', subject: 'Software Eng.', status: 'present' },
];

export const studentDailyAttendanceHistory: { date: string; schedule: DailyAttendance[] }[] = [
  {
    date: '2024-07-28',
    schedule: [
      { hour: '1st Hour', subject: 'Data Structures', status: 'present' },
      { hour: '2nd Hour', subject: 'Web Technology', status: 'present' },
      { hour: '3rd Hour', subject: 'Operating Systems', status: 'present' },
    ]
  },
  {
    date: '2024-07-29',
    schedule: [
      { hour: '1st Hour', subject: 'Data Structures', status: 'absent' },
      { hour: '2nd Hour', subject: 'Web Technology', status: 'present' },
      { hour: '3rd Hour', subject: 'Operating Systems', status: 'present' },
    ]
  },
  {
    date: '2024-07-30',
    schedule: [
      { hour: '1st Hour', subject: 'Data Structures', status: 'present' },
      { hour: '2nd Hour', subject: 'Web Technology', status: 'absent' },
      { hour: '3rd Hour', subject: 'Operating Systems', status: 'present' },
    ]
  }
];

export const auditLogs: AuditLog[] = [
  { id: '1', timestamp: subDays(new Date(), 1), user: 'TEACHER01', action: 'Approved leave request for Priya Verma', type: 'leave' },
  { id: '2', timestamp: subDays(new Date(), 2), user: 'TEACHER01', action: 'Posted announcement: "Mid-term Exams Schedule"', type: 'announcement' },
  { id: '3', timestamp: subDays(new Date(), 3), user: 'TEACHER02', action: 'Saved attendance for BCA - 3rd Year (Web Tech) on 2024-07-28', type: 'attendance' },
  { id: '4', timestamp: subDays(new Date(), 4), user: 'TEACHER01', action: 'Added new student: Zoya Khan (ID: 36623U09029)', type: 'student' },
];

export const feedbackSessions: FeedbackSession[] = [
    { id: 'session1', name: 'Semester End Feedback (Even 2024)', startDate: '2024-05-01', endDate: '2024-05-15', status: 'closed' },
    { id: 'session2', name: 'Mid-Term Feedback (Odd 2024)', startDate: '2024-08-20', endDate: '2024-09-05', status: 'open' }
];

export const feedbackData: Feedback[] = [
    // Session 1 feedback
    { id: 'fb1', sessionId: 'session1', studentId: students[0].id, subject: 'Data Structures', rating: 4, comment: 'Good explanations, but more practical examples would be helpful.' },
    { id: 'fb2', sessionId: 'session1', studentId: students[0].id, subject: 'Web Technology', rating: 5, comment: 'Excellent course, very engaging.' },
    { id: 'fb3', sessionId: 'session1', studentId: students[1].id, subject: 'Data Structures', rating: 3, comment: 'Pace is a bit too fast sometimes.' },
    { id: 'fb4', sessionId: 'session1', studentId: students[1].id, subject: 'Web Technology', rating: 4, comment: '' },
];

export const studentFeeDetails: StudentFeeDetails = {
    [students[0].id]: [
        { semester: '1st', totalFee: 15000, paid: 15000, balance: 0, status: 'Paid', dueDate: '2023-08-15' },
        { semester: '2nd', totalFee: 15000, paid: 15000, balance: 0, status: 'Paid', dueDate: '2024-01-15' },
        { semester: '3rd', totalFee: 15000, paid: 10000, balance: 5000, status: 'Pending', dueDate: '2024-08-15' },
    ],
    [students[1].id]: [
        { semester: '1st', totalFee: 15000, paid: 15000, balance: 0, status: 'Paid', dueDate: '2023-08-15' },
        { semester: '2nd', totalFee: 15000, paid: 0, balance: 15000, status: 'Overdue', dueDate: '2024-01-15' },
    ]
};

export const studentResults: StudentResults = {
    [students[0].id]: [
        { 
            semester: '2nd', gpa: 8.5, overallResult: 'Pass',
            results: [
                { subjectCode: 'BCA201', subjectName: 'Programming in C++', ciaMarks: 22, semesterMarks: 65, totalMarks: 87, grade: 'A', resultStatus: 'Pass' },
                { subjectCode: 'BCA202', subjectName: 'Digital Logic', ciaMarks: 20, semesterMarks: 55, totalMarks: 75, grade: 'B', resultStatus: 'Pass' },
                { subjectCode: 'BCA203', subjectName: 'Maths II', ciaMarks: 24, semesterMarks: 70, totalMarks: 94, grade: 'O', resultStatus: 'Pass' },
            ]
        },
        { 
            semester: '1st', gpa: 8.2, overallResult: 'Pass',
            results: [
                { subjectCode: 'BCA101', subjectName: 'Programming in C', ciaMarks: 21, semesterMarks: 60, totalMarks: 81, grade: 'A', resultStatus: 'Pass' },
                { subjectCode: 'BCA102', subjectName: 'Computer Fundamentals', ciaMarks: 23, semesterMarks: 68, totalMarks: 91, grade: 'O', resultStatus: 'Pass' },
            ]
        },
    ]
};
