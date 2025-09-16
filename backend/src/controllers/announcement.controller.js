const db = require('../models');
const Announcement = db.Announcement;
const Teacher = db.Teacher;

// Create a new announcement
exports.create = async (req, res) => {
  try {
    const { title, content, targetDepartment, targetYear } = req.body;
    
    // Get teacher ID from authenticated user
    const teacherId = req.userId;
    
    const announcement = await Announcement.create({
      title,
      content,
      date: new Date(),
      postedBy: teacherId,
      targetDepartment,
      targetYear,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating announcement',
      error: error.message
    });
  }
};

// Get all announcements
exports.findAll = async (req, res) => {
  try {
    const { department, year } = req.query;
    
    let query = { isActive: true };
    
    // Filter by department and year if provided
    if (department) {
      query.targetDepartment = department;
    }
    
    if (year) {
      query.targetYear = year;
    }
    
    const announcements = await Announcement.find(query)
      .populate('postedBy', 'name department designation')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving announcements',
      error: error.message
    });
  }
};

// Get announcement by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const announcement = await Announcement.findById(id)
      .populate('postedBy', 'name department designation');
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving announcement',
      error: error.message
    });
  }
};

// Update announcement
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, targetDepartment, targetYear, isActive } = req.body;
    
    const announcement = await Announcement.findById(id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    // Check if the teacher is the one who posted the announcement
    if (announcement.postedBy.toString() !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this announcement'
      });
    }
    
    announcement.title = title;
    announcement.content = content;
    announcement.targetDepartment = targetDepartment;
    announcement.targetYear = targetYear;
    announcement.isActive = isActive;
    
    await announcement.save();
    
    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating announcement',
      error: error.message
    });
  }
};

// Delete announcement (soft delete by setting isActive to false)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const announcement = await Announcement.findById(id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    // Check if the teacher is the one who posted the announcement
    if (announcement.postedBy.toString() !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement'
      });
    }
    
    announcement.isActive = false;
    await announcement.save();
    
    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting announcement',
      error: error.message
    });
  }
};