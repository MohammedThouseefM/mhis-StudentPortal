const express = require('express');
const { body } = require('express-validator');
const feedbackController = require('../controllers/feedback.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Submit feedback
router.post(
  '/',
  [
    authMiddleware.verifyToken,
    authMiddleware.isStudent,
    body('sessionId').isUUID(),
    body('subject').isString().trim().notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().isString().trim()
  ],
  feedbackController.submit
);

// Get feedback by session ID
router.get(
  '/session/:sessionId',
  [authMiddleware.verifyToken, authMiddleware.isTeacher],
  feedbackController.findBySession
);

// Get feedback analytics by session ID
router.get(
  '/analytics/session/:sessionId',
  [authMiddleware.verifyToken, authMiddleware.isTeacher],
  feedbackController.getAnalytics
);

// Get student's submitted feedback
router.get(
  '/student/session/:sessionId',
  [authMiddleware.verifyToken, authMiddleware.isStudent],
  feedbackController.getStudentFeedback
);

module.exports = router;