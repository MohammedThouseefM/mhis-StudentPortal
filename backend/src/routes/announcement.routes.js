const express = require('express');
const { body } = require('express-validator');
const announcementController = require('../controllers/announcement.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Create a new announcement
router.post(
  '/',
  [
    authMiddleware.verifyToken,
    authMiddleware.isTeacher,
    body('title').isString().trim().notEmpty(),
    body('content').isString().trim().notEmpty(),
    body('targetDepartment').isString().trim(),
    body('targetYear').optional().isString().trim()
  ],
  announcementController.create
);

// Get all announcements
router.get(
  '/',
  [authMiddleware.verifyToken],
  announcementController.findAll
);

// Get announcement by ID
router.get(
  '/:id',
  [authMiddleware.verifyToken],
  announcementController.findOne
);

// Update announcement
router.put(
  '/:id',
  [
    authMiddleware.verifyToken,
    authMiddleware.isTeacher,
    body('title').optional().isString().trim(),
    body('content').optional().isString().trim(),
    body('targetDepartment').optional().isString().trim(),
    body('targetYear').optional().isString().trim(),
    body('isActive').optional().isBoolean()
  ],
  announcementController.update
);

// Delete announcement (soft delete)
router.delete(
  '/:id',
  [authMiddleware.verifyToken, authMiddleware.isTeacher],
  announcementController.delete
);

module.exports = router;