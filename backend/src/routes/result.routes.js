const express = require('express');
const { body } = require('express-validator');
const resultController = require('../controllers/result.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Create or update result
router.post(
  '/',
  [
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    body('studentId').isUUID(),
    body('semester').isString().trim().notEmpty(),
    body('academicYear').isString().trim().notEmpty(),
    body('subjectCode').isString().trim().notEmpty(),
    body('subjectName').isString().trim().notEmpty(),
    body('ciaMarks').isFloat({ min: 0 }),
    body('semesterMarks').isFloat({ min: 0 }),
    body('grade').isString().trim().notEmpty(),
    body('resultStatus').isIn(['PASS', 'FAIL', 'ABSENT', 'WITHHELD'])
  ],
  resultController.createOrUpdate
);

// Get results by student ID
router.get(
  '/student/:studentId',
  [authMiddleware.verifyToken],
  resultController.findByStudent
);

// Get result by ID
router.get(
  '/:id',
  [authMiddleware.verifyToken],
  resultController.findOne
);

// Delete result
router.delete(
  '/:id',
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  resultController.delete
);

// Bulk create results
router.post(
  '/bulk',
  [
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    body('results').isArray().notEmpty()
  ],
  resultController.bulkCreate
);

// Get results by department and year
router.get(
  '/department/:department/year/:year',
  [authMiddleware.verifyToken, authMiddleware.isTeacher],
  resultController.findByDepartmentAndYear
);

// Calculate GPA for a student
router.get(
  '/student/:studentId/gpa',
  [authMiddleware.verifyToken],
  resultController.calculateGPA
);

module.exports = router;