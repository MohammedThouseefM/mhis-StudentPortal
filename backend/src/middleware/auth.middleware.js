const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../models');

// Hardcoded token for testing/development purposes
const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTg3NjU0MzIsImV4cCI6MTY5ODg1MTgzMn0.qwertyuiopasdfghjklzxcvbnm1234567890';

const User = db.User;

verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'No token provided!' });
    }

    const decoded = jwt.verify(token, config.JWT.SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;

    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
};

// Development middleware that bypasses token verification
devBypass = (req, res, next) => {
  // Set default admin user for development
  req.userId = '1234567890';
  req.userRole = 'admin';
  next();
};

isAdmin = (req, res, next) => {
  if (req.userRole === 'admin') {
    next();
    return;
  }

  res.status(403).json({ message: 'Require Admin Role!' });
};

isTeacher = (req, res, next) => {
  if (req.userRole === 'teacher' || req.userRole === 'admin') {
    next();
    return;
  }

  res.status(403).json({ message: 'Require Teacher Role!' });
};

isStudent = (req, res, next) => {
  if (req.userRole === 'student') {
    next();
    return;
  }

  res.status(403).json({ message: 'Require Student Role!' });
};

// Function to use hardcoded token for development/testing
getDevToken = () => {
  return HARDCODED_TOKEN;
};

const authMiddleware = {
  verifyToken,
  isAdmin,
  isTeacher,
  isStudent,
  getDevToken,
  devBypass
};

module.exports = authMiddleware;