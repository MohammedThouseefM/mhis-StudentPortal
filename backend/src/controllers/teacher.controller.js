const db = require('../models');
const Teacher = db.Teacher;
const User = db.User;
const Student = db.Student;
const Attendance = db.Attendance;
const Leave = db.Leave;

// Get all teachers
exports.findAll = async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while retrieving teachers.'
    });
  }
};

// Get teacher by ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const teacher = await Teacher.findByPk(id);
    
    if (!teacher) {
      return res.status(404).json({ message: `Teacher with id ${id} not found` });
    }
    
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error retrieving Teacher with id=${id}`
    });
  }
};

// Update teacher
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [updated] = await Teacher.update(req.body, {
      where: { id: id }
    });

    if (updated === 0) {
      return res.status(404).json({
        message: `Cannot update Teacher with id=${id}. Teacher not found!`
      });
    }

    res.status(200).json({ message: 'Teacher was updated successfully.' });
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error updating Teacher with id=${id}`
    });
  }
};

// Mark attendance for students
exports.markAttendance = async (req, res) => {
  try {
    const { attendanceRecords } = req.body;
    
    // Validate attendance records
    if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
      return res.status(400).json({ message: 'Invalid attendance data format' });
    }

    // Create attendance records in bulk
    const createdRecords = await Attendance.bulkCreate(attendanceRecords);
    
    res.status(201).json({
      message: 'Attendance marked successfully',
      records: createdRecords
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while marking attendance.'
    });
  }
};

// Get pending leave requests
exports.getPendingLeaveRequests = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      where: { status: 'pending' },
      include: [{
        model: Student,
        attributes: ['name', 'rollNumber', 'department', 'year']
      }]
    });
    
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while retrieving leave requests.'
    });
  }
};

// Approve or reject leave request
exports.updateLeaveStatus = async (req, res) => {
  const id = req.params.id;
  const { status, rejectionReason } = req.body;

  try {
    const leave = await Leave.findByPk(id);
    
    if (!leave) {
      return res.status(404).json({ message: `Leave request with id ${id} not found` });
    }

    leave.status = status;
    leave.rejectionReason = rejectionReason || null;
    leave.reviewedBy = req.userId;
    leave.reviewedAt = new Date();
    
    await leave.save();
    
    res.status(200).json({
      message: `Leave request ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
      leave
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error updating leave request with id=${id}`
    });
  }
};

// Get teachers by department
exports.findByDepartment = async (req, res) => {
  const { department } = req.query;

  try {
    const teachers = await Teacher.findAll({
      where: { department }
    });
    
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while retrieving teachers.'
    });
  }
};