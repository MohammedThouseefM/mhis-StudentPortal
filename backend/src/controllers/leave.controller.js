const { Leave, Student } = require('../models');

// Get leave requests
exports.getLeaveRequests = async (req, res) => {
  try {
    const { studentId, status } = req.query;
    
    // Build query based on provided filters
    const query = {};
    if (studentId) query.student = studentId;
    if (status) query.status = status;
    
    const leaveRequests = await Leave.find(query)
      .populate('student', 'name rollNumber')
      .sort({ createdAt: -1 });
      
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create leave request
exports.createLeaveRequest = async (req, res) => {
  try {
    const { studentId, fromDate, toDate, reason } = req.body;
    
    // Create new leave request
    const newLeaveRequest = new Leave({
      student: studentId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      reason,
      status: 'pending' // Default status
    });
    
    await newLeaveRequest.save();
    res.status(201).json(newLeaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update leave request status
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    
    const leaveRequest = await Leave.findById(id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    leaveRequest.status = status;
    if (comment) leaveRequest.comment = comment;
    leaveRequest.updatedAt = Date.now();
    
    await leaveRequest.save();
    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};