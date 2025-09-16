const express = require('express');
const { body } = require('express-validator');
const timetableController = require('../controllers/timetable.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Create a new timetable entry
router.post(
  '/',
  [
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    body('department').isString().trim().notEmpty(),
    body('year').isString().trim().notEmpty(),
    body('day').isIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']),
    body('hour').isInt({ min: 1, max: 8 }),
    body('subject').isString().trim().notEmpty(),
    body('teacherId').isUUID(),
    body('room').isString().trim(),
    body('academicYear').isString().trim().notEmpty(),
    body('semester').isString().trim().notEmpty()
  ],
  timetableController.create
);

// Get timetable by department and year
router.get(
  '/department/:department/year/:year',
  [authMiddleware.verifyToken],
  timetableController.findByDepartmentAndYear
);

// Get timetable by teacher ID
router.get(
  '/teacher/:teacherId',
  [authMiddleware.verifyToken],
  timetableController.findByTeacher
);

// Update timetable entry
router.put(
  '/:id',
  [
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    body('subject').optional().isString().trim(),
    body('teacherId').optional().isUUID(),
    body('room').optional().isString().trim()
  ],
  timetableController.update
);

// Delete timetable entry
router.delete(
  '/:id',
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  timetableController.delete
);

// Bulk create timetable entries
router.post(
  '/bulk',
  [
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    body('entries').isArray().notEmpty()
  ],
  timetableController.bulkCreate
);

module.exports = router;