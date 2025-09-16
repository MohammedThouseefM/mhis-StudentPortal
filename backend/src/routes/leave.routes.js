const express = require('express');
const router = express.Router();
const { getLeaveRequests, createLeaveRequest, updateLeaveStatus } = require('../controllers/leave.controller');

// Get leave requests
router.get('/', getLeaveRequests);

// Create leave request
router.post('/', createLeaveRequest);

// Update leave request status
router.put('/:id', updateLeaveStatus);

module.exports = router;