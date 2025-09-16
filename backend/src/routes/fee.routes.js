const express = require('express');
const { body } = require('express-validator');
const feeController = require('../controllers/fee.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Create or update fee record
router.post(
  '/',
  [
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    body('studentId').isUUID(),
    body('semester').isString().trim().notEmpty(),
    body('academicYear').isString().trim().notEmpty(),
    body('totalFee').isFloat({ min: 0 }),
    body('paid').isFloat({ min: 0 }),
    body('dueDate').isDate()
  ],
  feeController.createOrUpdate
);

// Get fee records by student ID
router.get(
  '/student/:studentId',
  [authMiddleware.verifyToken],
  feeController.findByStudent
);

// Get fee record by student ID, semester, and academic year
router.get(
  '/student/:studentId/semester/:semester/academic-year/:academicYear',
  [authMiddleware.verifyToken],
  feeController.findOne
);

// Record fee payment
router.post(
  '/payment/student/:studentId/semester/:semester/academic-year/:academicYear',
  [
    authMiddleware.verifyToken,
    authMiddleware.isAdmin,
    body('amount').isFloat({ min: 0.01 }),
    body('paymentReference').isString().trim().notEmpty()
  ],
  feeController.recordPayment
);

// Get pending fee records
router.get(
  '/pending',
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  feeController.getPendingFees
);

// Get fee summary by department and year
router.get(
  '/summary',
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  feeController.getFeeSummary
);

// Get total fee by class
router.get(
  '/total-fee-by-class',
  [authMiddleware.devBypass, authMiddleware.isAdmin],
  feeController.getTotalFeeByClass
);

module.exports = router;