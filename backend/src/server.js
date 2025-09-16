const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const teacherRoutes = require('./routes/teacher.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const leaveRoutes = require('./routes/leave.routes');
const announcementRoutes = require('./routes/announcement.routes');
const calendarEventRoutes = require('./routes/calendar-event.routes');
const timetableRoutes = require('./routes/timetable.routes');
const examRoutes = require('./routes/exam.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const feedbackSessionRoutes = require('./routes/feedback-session.routes');
const feeRoutes = require('./routes/fee.routes');
const resultRoutes = require('./routes/result.routes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/calendar-events', calendarEventRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/feedback-sessions', feedbackSessionRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/results', resultRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MHIS Student Portal API' });
});

// Direct register route
const { body, validationResult } = require('express-validator');

// Validation middleware for registration
const validateRegistration = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'teacher', 'admin']).withMessage('Role must be student, teacher, or admin')
];

app.post('/register', validateRegistration, (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Forward the request to the auth controller's signup function
  const authController = require('./controllers/auth.controller');
  authController.signup(req, res, next);
});

// Connect to MongoDB
mongoose.connect(config.DB.URI, config.DB.OPTIONS)
  .then(() => {
    console.log('Connected to MongoDB database!');
    // Start server with dynamic port finding
    const findAvailablePort = (startPort) => {
      return new Promise((resolve, reject) => {
        const server = require('net').createServer();
        server.unref();
        server.on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            resolve(findAvailablePort(startPort + 1));
          } else {
            reject(err);
          }
        });
        server.listen(startPort, () => {
          const port = server.address().port;
          server.close(() => {
            resolve(port);
          });
        });
      });
    };

    // Try to find an available port starting from 3000
    findAvailablePort(3000)
      .then(PORT => {
        app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}.`);
        });
      })
      .catch(err => {
        console.error('Failed to find an available port:', err);
      });
  })
  .catch(err => {
    console.error('Cannot connect to the database!', err);
    process.exit(1);
  });