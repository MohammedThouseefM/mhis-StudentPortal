const { Attendance, Student } = require('../models');

// Get attendance records
exports.getAttendance = async (req, res) => {
  try {
    const { studentId, date, subject } = req.query;
    
    // Build query based on provided filters
    const query = {};
    if (studentId) query.student = studentId;
    if (date) query.date = new Date(date);
    if (subject) query.subject = subject;
    
    const attendance = await Attendance.find(query)
      .populate('student', 'name rollNumber')
      .populate('markedBy', 'name');
      
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, subject, date, hour, status } = req.body;
    const teacherId = req.userId; // Assuming teacher ID is stored in request after authentication
    
    // Check if attendance already exists for this student, date, hour and subject
    const existingAttendance = await Attendance.findOne({
      student: studentId,
      subject,
      date: new Date(date),
      hour
    });
    
    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.updatedAt = Date.now();
      await existingAttendance.save();
      
      return res.status(200).json(existingAttendance);
    }
    
    // Create new attendance record
    const newAttendance = new Attendance({
      student: studentId,
      subject,
      date: new Date(date),
      hour,
      status,
      markedBy: teacherId
    });
    
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};