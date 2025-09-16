const FeedbackSession = require('../models/feedback-session.model');

// Create a new feedback session
exports.create = async (req, res) => {
  try {
    const {
      name,
      startDate,
      endDate,
      targetDepartment,
      targetYear,
      academicYear,
      semester
    } = req.body;
    
    // Get teacher ID from authenticated user
    const teacherId = req.userId;
    
    const feedbackSession = new FeedbackSession({
      name,
      startDate,
      endDate,
      status: 'ACTIVE',
      createdBy: teacherId,
      targetDepartment,
      targetYear,
      academicYear,
      semester
    });
    
    await feedbackSession.save();
    
    res.status(201).json({
      success: true,
      message: 'Feedback session created successfully',
      data: feedbackSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating feedback session',
      error: error.message
    });
  }
};

// Get all feedback sessions
exports.findAll = async (req, res) => {
  try {
    const { department, year, status, academicYear, semester } = req.query;
    
    let whereClause = {};
    
    if (department) {
      whereClause.targetDepartment = department;
    }
    
    if (year) {
      whereClause.targetYear = year;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (academicYear) {
      whereClause.academicYear = academicYear;
    }
    
    if (semester) {
      whereClause.semester = semester;
    }
    
    const feedbackSessions = await FeedbackSession.findAll({
      where: whereClause,
      order: [['startDate', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: feedbackSessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving feedback sessions',
      error: error.message
    });
  }
};

// Get feedback session by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedbackSession = await FeedbackSession.findByPk(id);
    
    if (!feedbackSession) {
      return res.status(404).json({
        success: false,
        message: 'Feedback session not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: feedbackSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving feedback session',
      error: error.message
    });
  }
};

// Update feedback session
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      startDate,
      endDate,
      status,
      targetDepartment,
      targetYear,
      academicYear,
      semester
    } = req.body;
    
    const feedbackSession = await FeedbackSession.findByPk(id);
    
    if (!feedbackSession) {
      return res.status(404).json({
        success: false,
        message: 'Feedback session not found'
      });
    }
    
    // Check if the teacher is the one who created the session
    if (feedbackSession.createdBy !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this feedback session'
      });
    }
    
    await feedbackSession.update({
      name,
      startDate,
      endDate,
      status,
      targetDepartment,
      targetYear,
      academicYear,
      semester
    });
    
    res.status(200).json({
      success: true,
      message: 'Feedback session updated successfully',
      data: feedbackSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating feedback session',
      error: error.message
    });
  }
};

// Delete feedback session
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedbackSession = await FeedbackSession.findByPk(id);
    
    if (!feedbackSession) {
      return res.status(404).json({
        success: false,
        message: 'Feedback session not found'
      });
    }
    
    // Check if the teacher is the one who created the session
    if (feedbackSession.createdBy !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this feedback session'
      });
    }
    
    await feedbackSession.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Feedback session deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting feedback session',
      error: error.message
    });
  }
};

// Get active feedback sessions for a student
exports.getActiveSessionsForStudent = async (req, res) => {
  try {
    const { department, year } = req.query;
    
    if (!department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Department and year are required'
      });
    }
    
    const currentDate = new Date();
    
    const activeSessions = await FeedbackSession.findAll({
      where: {
        targetDepartment: department,
        targetYear: year,
        status: 'ACTIVE',
        startDate: { [Op.lte]: currentDate },
        endDate: { [Op.gte]: currentDate }
      },
      order: [['endDate', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: activeSessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active feedback sessions',
      error: error.message
    });
  }
};