const express = require('express');
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware.verifyToken);

// Routes accessible by teachers and admins
router.get('/', authMiddleware.isTeacher, studentController.findAll);
router.get('/filter', authMiddleware.isTeacher, studentController.findByDepartmentAndYear);
router.post('/', authMiddleware.isTeacher, studentController.create);

// Routes accessible by both students and teachers
router.get('/:id', studentController.findOne);
router.get('/:id/attendance', studentController.getAttendance);
router.get('/:id/leave', studentController.getLeaveRequests);
router.get('/:id/results', studentController.getResults);
router.get('/:id/fees', studentController.getFees);

// Routes for student actions
router.post('/leave', authMiddleware.isStudent, studentController.createLeaveRequest);

// Routes for teacher/admin actions
router.put('/:id', authMiddleware.isTeacher, studentController.update);

module.exports = router;