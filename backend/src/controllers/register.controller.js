const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../models');

const User = db.User;
const Student = db.Student;
const Teacher = db.Teacher;

/**
 * Handle user registration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    // Generate username from name if not provided
    if (!req.body.username && req.body.name) {
      req.body.username = req.body.name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
    }
    
    // Set default role to student if not provided
    if (!req.body.role) {
      req.body.role = 'student';
    }
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username: req.body.username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Create user
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role
    });

    // Create profile based on role
    if (req.body.role === 'student') {
      await Student.create({
        user: user.id,  // Changed from userId to user to match Student model schema
        name: req.body.name,
        rollNumber: req.body.rollNumber,
        dob: req.body.dob,
        university_number: req.body.university_number,
        department: req.body.department,
        year: req.body.year,
        email: req.body.email,
        phone: req.body.phone,
        fatherContactNumber: req.body.fatherContactNumber,
        gender: req.body.gender,
        currentSemester: req.body.currentSemester,
        academicYear: req.body.academicYear,
        address: req.body.address
      });
    } else if (req.body.role === 'teacher') {
      await Teacher.create({
        userId: user.id, // Teacher model uses userId field
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        department: req.body.department,
        designation: req.body.designation
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      userId: user.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred during registration.'
    });
  }
};

/**
 * Check if username is available
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    
    res.json({
      available: !user,
      message: user ? 'Username is already taken' : 'Username is available'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error checking username availability'
    });
  }
};

/**
 * Check if email is available
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    
    res.json({
      available: !user,
      message: user ? 'Email is already registered' : 'Email is available'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error checking email availability'
    });
  }
};