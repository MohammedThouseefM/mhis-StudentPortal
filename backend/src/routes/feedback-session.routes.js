const express = require('express');
const { body } = require('express-validator');
const feedbackSessionController = require('../controllers/feedback-session.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Create a new feedback session
router.post(
  '/',
  [
    authMiddleware.verifyToken,
    authMiddleware.isTeacher,
    body('name').isString().trim().notEmpty(),
    body('startDate').isDate(),
    body('endDate').isDate(),
    body('targetDepartment').isString().trim().notEmpty(),
    body('targetYear').isString().trim(),
    body('academicYear').isString().trim().notEmpty(),
    body('semester').isString().trim().notEmpty()
  ],
  feedbackSessionController.create
);

// Get all feedback sessions
router.get(
  '/',
  [authMiddleware.verifyToken, authMiddleware.isTeacher],
  feedbackSessionController.findAll
);

// Get feedback session by ID
router.get(
  '/:id',
  [authMiddleware.verifyToken],
  feedbackSessionController.findOne
);

// Update feedback session
router.put(
  '/:id',
  [
    authMiddleware.verifyToken,
    authMiddleware.isTeacher,
    body('name').optional().isString().trim(),
    body('startDate').optional().isDate(),
    body('endDate').optional().isDate(),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'COMPLETED']),
    body('targetDepartment').optional().isString().trim(),
    body('targetYear').optional().isString().trim(),
    body('academicYear').optional().isString().trim(),
    body('semester').optional().isString().trim()
  ],
  feedbackSessionController.update
);

// Delete feedback session
router.delete(
  '/:id',
  [authMiddleware.verifyToken, authMiddleware.isTeacher],
  feedbackSessionController.delete
);

// Get active feedback sessions for a student
router.get(
  '/student/active',
  [authMiddleware.verifyToken, authMiddleware.isStudent],
  feedbackSessionController.getActiveSessionsForStudent
);

module.exports = router;