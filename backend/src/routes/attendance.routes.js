const express = require('express');
const router = express.Router();
const { getAttendance, markAttendance } = require('../controllers/attendance.controller');

// Get attendance records
router.get('/', getAttendance);

// Mark attendance
router.post('/', markAttendance);

module.exports = router;