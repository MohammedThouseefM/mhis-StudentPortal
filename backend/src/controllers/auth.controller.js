const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config/config');

const User = db.User;
const Student = db.Student;
const Teacher = db.Teacher;

exports.signup = async (req, res) => {
  try {
    // Create user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role
    });

    // Create profile based on role
    if (req.body.role === 'student') {
      await Student.create({
        userId: user.id,
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
        userId: user.id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        department: req.body.department,
        designation: req.body.designation
      });
    }

    res.status(201).json({
      message: 'User registered successfully!',
      userId: user.id
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred while creating the user.'
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const passwordIsValid = await bcrypt.compare(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: 'Invalid password!'
      });
    }

    // Update last login
    await User.update(
      { lastLogin: new Date() },
      { where: { id: user.id } }
    );

    // Get profile data based on role
    let profileData = null;
    if (user.role === 'student') {
      profileData = await Student.findOne({
        where: { userId: user.id }
      });
    } else if (user.role === 'teacher') {
      profileData = await Teacher.findOne({
        where: { userId: user.id }
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.JWT.SECRET,
      { expiresIn: config.JWT.EXPIRES_IN }
    );

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: profileData,
      accessToken: token
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Some error occurred during authentication.'
    });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ message: 'No token provided!' });
    }

    const decoded = jwt.verify(token, config.JWT.SECRET);
    
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get profile data based on role
    let profileData = null;
    if (user.role === 'student') {
      profileData = await Student.findOne({
        where: { userId: user.id }
      });
    } else if (user.role === 'teacher') {
      profileData = await Teacher.findOne({
        where: { userId: user.id }
      });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: profileData
    });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
};