const express = require('express');
const { body } = require('express-validator');
const examController = require('../controllers/exam.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Create a new exam
router.post(
  '/',
  [
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    body('subjectCode').isString().trim().notEmpty(),
    body('subject').isString().trim().notEmpty(),
    body('date').isDate(),
    body('time').isString().trim().notEmpty(),
    body('department').isString().trim().notEmpty(),
    body('year').isString().trim().notEmpty(),
    body('semester').isString().trim().notEmpty(),
    body('academicYear').isString().trim().notEmpty(),
    body('venue').isString().trim().notEmpty(),
    body('duration').isInt({ min: 1 }),
    body('maxMarks').isInt({ min: 1 }),
    body('examType').isIn(['INTERNAL', 'EXTERNAL', 'PRACTICAL', 'OTHER'])
  ],
  examController.create
);

// Get all exams
router.get(
  '/',
  [authMiddleware.verifyToken],
  examController.findAll
);

// Get exam by ID
router.get(
  '/:id',
  [authMiddleware.verifyToken],
  examController.findOne
);

// Update exam
router.put(
  '/:id',
  [
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    body('subjectCode').optional().isString().trim(),
    body('subject').optional().isString().trim(),
    body('date').optional().isDate(),
    body('time').optional().isString().trim(),
    body('venue').optional().isString().trim(),
    body('duration').optional().isInt({ min: 1 }),
    body('maxMarks').optional().isInt({ min: 1 }),
    body('examType').optional().isIn(['INTERNAL', 'EXTERNAL', 'PRACTICAL', 'OTHER'])
  ],
  examController.update
);

// Delete exam
router.delete(
  '/:id',
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  examController.delete
);

// Bulk create exams
router.post(
  '/bulk',
  [
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    body('exams').isArray().notEmpty()
  ],
  examController.bulkCreate
);

module.exports = router;