const express = require('express');
const { body } = require('express-validator');
const teacherController = require('../controllers/teacher.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Get all teachers
router.get(
  '/',
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  teacherController.findAll
);

// Get teacher by ID
router.get(
  '/:id',
  [authMiddleware.verifyToken, authMiddleware.isTeacher],
  teacherController.findOne
);

// Update teacher profile
router.put(
  '/:id',
  [
    authMiddleware.verifyToken,
    authMiddleware.isTeacher,
    body('name').optional().isString().trim(),
    body('email').optional().isEmail(),
    body('phone').optional().isMobilePhone(),
    body('department').optional().isString(),
    body('designation').optional().isString(),
    body('photoUrl').optional().isURL()
  ],
  teacherController.update
);

// Get teachers by department
router.get(
  '/department/:department',
  [authMiddleware.verifyToken],
  teacherController.findByDepartment
);

// Mark attendance for students
router.post(
  '/mark-attendance',
  [
    authMiddleware.verifyToken,
    authMiddleware.isTeacher,
    body('studentIds').isArray(),
    body('subject').isString(),
    body('date').isDate(),
    body('hour').isInt({ min: 1, max: 8 }),
    body('status').isIn(['PRESENT', 'ABSENT', 'LATE'])
  ],
  teacherController.markAttendance
);

// Get pending leave requests
router.get(
  '/leave-requests/pending',
  [authMiddleware.verifyToken, authMiddleware.isTeacher],
  teacherController.getPendingLeaveRequests
);

// Update leave request status
router.put(
  '/leave-requests/:id',
  [
    authMiddleware.verifyToken,
    authMiddleware.isTeacher,
    body('status').isIn(['APPROVED', 'REJECTED']),
    body('rejectionReason').optional().isString()
  ],
  teacherController.updateLeaveStatus
);

module.exports = router;