const mongoose = require('mongoose');
const config = require('../config/config');

// Import models
const User = require('./user.model');
const Student = require('./student.model');
const Teacher = require('./teacher.model');
const Attendance = require('./attendance.model');
const Leave = require('./leave.model');
const Announcement = require('./announcement.model');
const CalendarEvent = require('./calendar-event.model');
const Timetable = require('./timetable.model');
const Exam = require('./exam.model');
const FeedbackSession = require('./feedback-session.model');
const Feedback = require('./feedback.model');
const Fee = require('./fee.model');
const Result = require('./result.model');

// Create database object
const db = {};

// Add models to db object
db.mongoose = mongoose;
db.User = User;
db.Student = Student;
db.Teacher = Teacher;
db.Attendance = Attendance;
db.Leave = Leave;
db.Announcement = Announcement;
db.CalendarEvent = CalendarEvent;
db.Timetable = Timetable;
db.Exam = Exam;
db.FeedbackSession = FeedbackSession;
db.Feedback = Feedback;
db.Fee = Fee;
db.Result = Result;

// Export db object
module.exports = db;