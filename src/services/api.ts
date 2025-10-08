'use client';

/**
 * API Service for MHIS Student Portal
 * This service handles all API calls to the backend
 */

// Base URL for API calls
const API_BASE_URL = 'http://localhost:3456/api';

// Default headers for API calls
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Get auth token from localStorage or use development token
const getAuthToken = () => {
  // Using a simpler approach for development
  return localStorage.getItem('mhis-auth-token') || null;
};

// Interface for API response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Generic fetch function with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...DEFAULT_HEADERS,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
        error: data.error || response.statusText,
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Authentication API
export const authApi = {
  login: async (username: string, password: string, role: 'student' | 'teacher' | 'admin') => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });
  },
  register: async (userData: any) => {
    return fetchApi('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Student API
export const studentApi = {
  getAll: async () => {
    return fetchApi('/students');
  },
  getById: async (id: string) => {
    return fetchApi(`/students/${id}`);
  },
  create: async (studentData: any) => {
    return fetchApi('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },
  update: async (id: string, studentData: any) => {
    return fetchApi(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },
  delete: async (id: string) => {
    return fetchApi(`/students/${id}`, {
      method: 'DELETE',
    });
  },
};

// Teacher API
export const teacherApi = {
  getAll: async () => {
    return fetchApi('/teachers');
  },
  getById: async (id: string) => {
    return fetchApi(`/teachers/${id}`);
  },
  create: async (teacherData: any) => {
    return fetchApi('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    });
  },
  update: async (id: string, teacherData: any) => {
    return fetchApi(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teacherData),
    });
  },
  delete: async (id: string) => {
    return fetchApi(`/teachers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Attendance API
export const attendanceApi = {
  getByClass: async (department: string, year: string, date: string) => {
    return fetchApi(`/attendance/class?department=${department}&year=${year}&date=${date}`);
  },
  getByStudent: async (studentId: string) => {
    return fetchApi(`/attendance/student/${studentId}`);
  },
  save: async (attendanceData: any) => {
    return fetchApi('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  },
};

// Leave API
export const leaveApi = {
  getAll: async () => {
    return fetchApi('/leave');
  },
  getByStudent: async (studentId: string) => {
    return fetchApi(`/leave/student/${studentId}`);
  },
  create: async (leaveData: any) => {
    return fetchApi('/leave', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    });
  },
  approve: async (id: string) => {
    return fetchApi(`/leave/${id}/approve`, {
      method: 'PUT',
    });
  },
  reject: async (id: string, reason: string) => {
    return fetchApi(`/leave/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },
};

// Announcement API
export const announcementApi = {
  getAll: async () => {
    return fetchApi('/announcements');
  },
  create: async (title: string, content: string) => {
    return fetchApi('/announcements', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    });
  },
  delete: async (id: string) => {
    return fetchApi(`/announcements/${id}`, {
      method: 'DELETE',
    });
  },
};

// Calendar Event API
export const calendarEventApi = {
  getAll: async () => {
    return fetchApi('/calendar-events');
  },
  create: async (eventData: any) => {
    return fetchApi('/calendar-events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },
  update: async (id: string, eventData: any) => {
    return fetchApi(`/calendar-events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },
  delete: async (id: string) => {
    return fetchApi(`/calendar-events/${id}`, {
      method: 'DELETE',
    });
  },
};

// Timetable API
export const timetableApi = {
  getByClass: async (department: string, year: string) => {
    return fetchApi(`/timetable?department=${department}&year=${year}`);
  },
  update: async (department: string, year: string, timetableData: any) => {
    return fetchApi('/timetable', {
      method: 'PUT',
      body: JSON.stringify({ department, year, timetable: timetableData }),
    });
  },
};

// Exam API
export const examApi = {
  getByClass: async (department: string, year: string) => {
    return fetchApi(`/exams?department=${department}&year=${year}`);
  },
  update: async (department: string, year: string, examData: any) => {
    return fetchApi('/exams', {
      method: 'PUT',
      body: JSON.stringify({ department, year, exams: examData }),
    });
  },
};

// Feedback API
export const feedbackApi = {
  getSessions: async () => {
    return fetchApi('/feedback-sessions');
  },
  getSessionById: async (id: string) => {
    return fetchApi(`/feedback-sessions/${id}`);
  },
  createSession: async (sessionData: any) => {
    return fetchApi('/feedback-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },
  submitFeedback: async (feedbackData: any) => {
    return fetchApi('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },
  getFeedbackBySession: async (sessionId: string) => {
    return fetchApi(`/feedback/session/${sessionId}`);
  },
};

// Fee API
export const feeApi = {
  getByStudent: async (studentId: string) => {
    return fetchApi(`/fees/student/${studentId}`);
  },
  update: async (studentId: string, semester: string, feeData: any) => {
    return fetchApi('/fees', {
      method: 'PUT',
      body: JSON.stringify({ studentId, semester, ...feeData }),
    });
  },
};

// Result API
export const resultApi = {
  getByStudent: async (studentId: string) => {
    return fetchApi(`/results/student/${studentId}`);
  },
  update: async (studentId: string, semester: string, subjectCode: string, resultData: any) => {
    return fetchApi('/results', {
      method: 'PUT',
      body: JSON.stringify({ studentId, semester, subjectCode, ...resultData }),
    });
  },
};

// Export a default API object with all APIs
const api = {
  auth: authApi,
  students: studentApi,
  teachers: teacherApi,
  attendance: attendanceApi,
  leave: leaveApi,
  announcements: announcementApi,
  calendarEvents: calendarEventApi,
  timetable: timetableApi,
  exams: examApi,
  feedback: feedbackApi,
  fees: feeApi,
  results: resultApi,
};

export default api;