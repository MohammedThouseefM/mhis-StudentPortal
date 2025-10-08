/**
 * Routes for data duplication operations
 */
const express = require('express');
const router = express.Router();
const duplicateController = require('../controllers/duplicate.controller');

// Duplicate a single leave request by ID
router.post('/leave/:id', duplicateController.duplicateSingleLeaveRequest);

// Duplicate multiple leave requests based on filter criteria
router.post('/leave/batch', duplicateController.duplicateMultipleLeaveRequests);

module.exports = router;