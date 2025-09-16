const { Student, User, Attendance, Leave, Result, Fee } = require('../models');
const bcrypt = require('bcryptjs');

// Get all students
exports.findAll = async (req, res) => {
  try {
    const students = await Student.find().populate('user', '-password');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while retrieving students.'
    });
  }
};

// Get student by ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const student = await Student.findById(id).populate('user', '-password');
    
    if (!student) {
      return res.status(404).json({ message: `Student with id ${id} not found` });
    }
    
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error retrieving Student with id=${id}`
    });
  }
};

// Update student
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({
        message: `Cannot update Student with id=${id}. Student not found!`
      });
    }
    
    // Update student fields
    Object.keys(req.body).forEach(key => {
      student[key] = req.body[key];
    });
    
    student.updatedAt = Date.now();
    
    const updatedStudent = await student.save();
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error updating Student with id=${id}`
    });
  }
};

// Get student attendance
exports.getAttendance = async (req, res) => {
  const id = req.params.id;

  try {
    const attendance = await Attendance.find({ student: id })
      .populate('student', 'name rollNumber')
      .populate('markedBy', 'name');
    
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error retrieving attendance for Student with id=${id}`
    });
  }
};

// Get student leave requests
exports.getLeaveRequests = async (req, res) => {
  const id = req.params.id;

  try {
    const leaves = await Leave.findAll({
      where: { studentId: id }
    });
    
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error retrieving leave requests for Student with id=${id}`
    });
  }
};

// Create a leave request
exports.createLeaveRequest = async (req, res) => {
  try {
    const leave = new Leave({
      student: req.body.studentId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reason: req.body.reason,
      status: 'pending'
    });
    
    const savedLeave = await leave.save();
    
    res.status(201).json(savedLeave);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while creating the leave request.'
    });
  }
};

// Get student results
exports.getResults = async (req, res) => {
  const id = req.params.id;

  try {
    const results = await Result.find({ student: id }).populate('student', 'name rollNumber');
    
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error retrieving results for Student with id=${id}`
    });
  }
};

// Get student fees
exports.getFees = async (req, res) => {
  const id = req.params.id;

  try {
    const fees = await Fee.find({ student: id }).populate('student', 'name rollNumber');
    
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({
      message: error.message || `Error retrieving fees for Student with id=${id}`
    });
  }
};

// Get students by department and year
exports.findByDepartmentAndYear = async (req, res) => {
  const { department, year } = req.query;

  try {
    const students = await Student.find({
      department: department,
      year: year
    });
    
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while retrieving students.'
    });
  }
};

// Create a new student
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.rollNumber || 
        !req.body.department || !req.body.year || !req.body.dob || !req.body.phone || 
        !req.body.university_number || !req.body.gender) {
      return res.status(400).json({ message: 'All required fields must be provided!' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use!' });
    }

    // Check if roll number already exists
    const existingStudent = await Student.findOne({ rollNumber: req.body.rollNumber });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already exists!' });
    }

    // Check if university number already exists
    const existingUnivNumber = await Student.findOne({ university_number: req.body.university_number });
    if (existingUnivNumber) {
      return res.status(400).json({ message: 'University number already exists!' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create user
    const user = new User({
      username: req.body.rollNumber, // Using roll number as username
      email: req.body.email,
      password: hashedPassword,
      role: 'student'
    });

    // Save user
    const savedUser = await user.save();

    // Create student
    const student = new Student({
      user: savedUser._id,
      rollNumber: req.body.rollNumber,
      name: req.body.name,
      dob: req.body.dob,
      university_number: req.body.university_number,
      department: req.body.department,
      year: req.body.year,
      email: req.body.email,
      phone: req.body.phone,
      fatherContactNumber: req.body.fatherContactNumber,
      photoUrl: req.body.photoUrl,
      gender: req.body.gender,
      currentSemester: req.body.currentSemester,
      academicYear: req.body.academicYear,
      address: req.body.address,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    // Save student
    const savedStudent = await student.save();

    res.status(201).json({
      message: 'Student created successfully!',
      student: {
        id: savedStudent._id,
        name: savedStudent.name,
        rollNumber: savedStudent.rollNumber,
        email: savedStudent.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while creating the student.'
    });
  }
};