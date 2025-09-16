const express = require('express');
const { body } = require('express-validator');
const calendarEventController = require('../controllers/calendar-event.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Create a new calendar event
router.post(
  '/',
  [
    authMiddleware.verifyToken,
    authMiddleware.isTeacher,
    body('date').isDate(),
    body('title').isString().trim().notEmpty(),
    body('type').isIn(['EXAM', 'HOLIDAY', 'EVENT', 'MEETING', 'OTHER']),
    body('description').isString().trim(),
    body('targetDepartment').isString().trim(),
    body('targetYear').optional().isString().trim()
  ],
  calendarEventController.create
);

// Get all calendar events
router.get(
  '/',
  [authMiddleware.verifyToken],
  calendarEventController.findAll
);

// Get calendar event by ID
router.get(
  '/:id',
  [authMiddleware.verifyToken],
  calendarEventController.findOne
);

// Update calendar event
router.put(
  '/:id',
  [
    authMiddleware.verifyToken,
    authMiddleware.isTeacher,
    body('date').optional().isDate(),
    body('title').optional().isString().trim(),
    body('type').optional().isIn(['EXAM', 'HOLIDAY', 'EVENT', 'MEETING', 'OTHER']),
    body('description').optional().isString().trim(),
    body('targetDepartment').optional().isString().trim(),
    body('targetYear').optional().isString().trim()
  ],
  calendarEventController.update
);

// Delete calendar event
router.delete(
  '/:id',
  [authMiddleware.verifyToken, authMiddleware.isTeacher],
  calendarEventController.delete
);

module.exports = router;