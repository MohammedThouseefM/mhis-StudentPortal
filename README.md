# AttendEase: AI-Powered Attendance Management System

AttendEase is a modern, full-stack web application designed to streamline and digitize the process of attendance management for educational institutions. It leverages the power of AI to provide intelligent insights and features for both students and teachers, making the entire process more efficient and transparent.

Built with Next.js, React, and Genkit, this application offers a clean, responsive user interface and a robust backend.

## Key Features

### For Students:
- **Secure Login:** Students can log in using their university number and date of birth.
- **Attendance Dashboard:** A comprehensive view of their attendance, including:
    - Overall percentage with a progress bar.
    - Subject-wise attendance breakdown.
    - A monthly trend chart to visualize attendance over time.
- **Low Attendance Alerts:** Automatically get notified with a warning and fine details if the overall attendance drops below 75%.
- **Profile Page:** View personal and academic details.
- **Announcements:** Stay updated with the latest announcements from teachers.

### For Teachers:
- **Secure Login:** Teachers have their own credentials to access their dashboard.
- **AI-Powered Attendance Marking:**
    - Select a class, year, hour, and date to take attendance.
    - Use the **"Predict Attendance"** feature, which leverages a Genkit AI flow to suggest attendance markings based on students' historical data.
- **Advanced Student Search:**
    - Find students quickly by name, roll number, or university ID.
    - Filter students by department, year, and specific attendance percentage ranges (e.g., 0%, 1-20%, etc.).
    - View student cards with key details and their overall attendance percentage.
- **Comprehensive Management Panel:**
    - **Student Management:** Add, view, edit, and delete student records.
    - **Academic Structure:** Add new departments and academic years.
    - **Announcements:** Create and delete announcements that are visible to all users.
- **AI-Generated Defaulter Reports:**
    - Instantly generate a report of all students with attendance below the 75% threshold.
    - The report includes a professional, AI-generated summary suitable for administrative review.

## Technology Stack
- **Framework:** Next.js (with App Router)
- **UI:** React, TypeScript, ShadCN UI
- **Styling:** Tailwind CSS
- **Generative AI:** Google's Genkit
- **Forms:** React Hook Form with Zod for validation

## Getting Started
To explore the application, navigate to the main page and log in using either a student or teacher account.

- **Student Login:** Use a `university_number` as the ID and their **Date of Birth** in `YYYY-MM-DD` format as the password (e.g., ID: `36623U09028`, Pass: `2005-12-12`).
- **Teacher Login:** Use a pre-defined teacher ID and password (e.g., ID: `TEACHER01`, Pass: `password`).
