const express = require('express');
const { body } = require('express-validator');
const registerController = require('../controllers/register.controller');
const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'teacher']).withMessage('Role must be student or teacher'),
  body('name').notEmpty().withMessage('Name is required'),
  
  // Conditional validation based on role
  body('rollNumber').if(body('role').equals('student')).notEmpty().withMessage('Roll number is required for students'),
  body('department').notEmpty().withMessage('Department is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required')
];

// Routes
router.post('/', validateRegistration, registerController.register);
router.get('/check-username/:username', registerController.checkUsername);
router.get('/check-email/:email', registerController.checkEmail);

module.exports = router;