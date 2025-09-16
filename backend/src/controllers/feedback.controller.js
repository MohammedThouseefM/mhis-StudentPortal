const Feedback = require('../models/feedback.model');
const FeedbackSession = require('../models/feedback-session.model');
const Student = require('../models/student.model');

// Submit feedback
exports.submit = async (req, res) => {
  try {
    const { sessionId, subject, rating, comment } = req.body;
    
    // Get student ID from authenticated user
    const studentId = req.userId;
    
    // Check if the feedback session exists and is active
    const session = await FeedbackSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Feedback session not found'
      });
    }
    
    if (session.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Feedback session is not active'
      });
    }
    
    // Check if student has already submitted feedback for this session and subject
    const existingFeedback = await Feedback.findOne({
      session: sessionId,
      student: studentId,
      subject
    });
    
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted feedback for this subject in this session'
      });
    }
    
    const feedback = new Feedback({
      session: sessionId,
      student: studentId,
      subject,
      rating,
      comment,
      submittedAt: new Date()
    });
    
    await feedback.save();
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
};

// Get feedback by session ID
exports.findBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Check if the user is an admin or teacher
    if (req.userRole !== 'ADMIN' && req.userRole !== 'TEACHER') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access feedback data'
      });
    }
    
    const feedback = await Feedback.find({ session: sessionId })
      .populate('student', 'name department year');
    
    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving feedback',
      error: error.message
    });
  }
};

// Get feedback analytics by session ID
exports.getAnalytics = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Check if the user is an admin or teacher
    if (req.userRole !== 'ADMIN' && req.userRole !== 'TEACHER') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access feedback analytics'
      });
    }
    
    const feedback = await Feedback.find({ session: sessionId }).select('subject rating');
    
    if (feedback.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No feedback found for this session'
      });
    }
    
    // Group feedback by subject and calculate average rating
    const subjectMap = {};
    
    feedback.forEach(item => {
      if (!subjectMap[item.subject]) {
        subjectMap[item.subject] = {
          totalRating: 0,
          count: 0
        };
      }
      
      subjectMap[item.subject].totalRating += item.rating;
      subjectMap[item.subject].count += 1;
    });
    
    const analytics = Object.keys(subjectMap).map(subject => ({
      subject,
      averageRating: subjectMap[subject].totalRating / subjectMap[subject].count,
      responseCount: subjectMap[subject].count
    }));
    
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving feedback analytics',
      error: error.message
    });
  }
};

// Get student's submitted feedback
exports.getStudentFeedback = async (req, res) => {
  try {
    const studentId = req.userId;
    const { sessionId } = req.params;
    
    const feedback = await Feedback.findAll({
      where: {
        studentId,
        sessionId
      },
      attributes: ['id', 'subject', 'rating', 'comment', 'submittedAt']
    });
    
    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving student feedback',
      error: error.message
    });
  }
};