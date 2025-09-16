
import { type Student, type Teacher } from './mock-data';

// In a real app, passwords would be hashed. For this demo, we do a simple string comparison.
export function validateStudent(id: string, pass: string, studentList: Student[]): Student | 'inactive' | null {
  // Student ID check should be case-insensitive
  const user = studentList.find(u => u.university_number.toLowerCase() === id.toLowerCase());
  
  if (!user || typeof user.dob !== 'string' || user.dob.length === 0) {
    return null;
  }
  
  try {
    // The stored DOB (user.dob) is in YYYY-MM-DD format.
    // The password (pass) is provided in DD-MM-YYYY format.
    // We convert the stored DOB to DD-MM-YYYY for comparison.
    const [year, month, day] = user.dob.split('-');
    if (!year || !month || !day) return null; // handle invalid stored DOB format

    const formattedDobForPassword = `${day}-${month}-${year}`;
    
    if (formattedDobForPassword === pass) {
      return user.isActive ? user : 'inactive';
    }
  } catch (error) {
    // In case split fails or other unexpected errors
    console.error("Error during student password validation:", error);
    return null;
  }
  
  return null;
}

export function validateTeacher(id:string, pass: string, teacherList: Teacher[]): Teacher | 'inactive' | null {
  // Teacher ID check should be case-insensitive.
  const user = teacherList.find(u => u.id.toLowerCase() === id.toLowerCase());

  if (user) {
    // Password check is case-sensitive
    if (user.password === pass) {
      return user.isActive ? user : 'inactive';
    }
  }
  
  return null;
}
