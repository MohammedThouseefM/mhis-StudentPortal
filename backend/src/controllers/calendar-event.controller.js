const CalendarEvent = require('../models/calendar-event.model');
const Teacher = require('../models/teacher.model');

// Create a new calendar event
exports.create = async (req, res) => {
  try {
    const { date, title, type, description, targetDepartment, targetYear } = req.body;
    
    // Get teacher ID from authenticated user
    const teacherId = req.userId;
    
    const calendarEvent = new CalendarEvent({
      date,
      title,
      type,
      description,
      createdBy: teacherId,
      targetDepartment,
      targetYear
    });
    
    await calendarEvent.save();
    
    res.status(201).json({
      success: true,
      message: 'Calendar event created successfully',
      data: calendarEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating calendar event',
      error: error.message
    });
  }
};

// Get all calendar events
exports.findAll = async (req, res) => {
  try {
    const { department, year, startDate, endDate, type } = req.query;
    
    let query = {};
    
    // Filter by department and year if provided
    if (department) {
      whereClause.targetDepartment = department;
    }
    
    if (year) {
      query.targetYear = year;
    }
    
    // Filter by date range if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.date = {
        $gte: new Date(startDate)
      };
    } else if (endDate) {
      query.date = {
        $lte: new Date(endDate)
      };
    }
    
    // Filter by event type if provided
    if (type) {
      query.type = type;
    }
    
    const calendarEvents = await CalendarEvent.find(query)
      .populate({
        path: 'createdBy',
        model: 'Teacher',
        select: 'name department'
      })
      .sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      data: calendarEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving calendar events',
      error: error.message
    });
  }
};

// Get calendar event by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const calendarEvent = await CalendarEvent.findById(id)
      .populate({
        path: 'createdBy',
        model: 'Teacher',
        select: 'name department'
      });
    
    if (!calendarEvent) {
      return res.status(404).json({
        success: false,
        message: 'Calendar event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: calendarEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving calendar event',
      error: error.message
    });
  }
};

// Update calendar event
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, title, type, description, targetDepartment, targetYear } = req.body;
    
    const calendarEvent = await CalendarEvent.findById(id);
    
    if (!calendarEvent) {
      return res.status(404).json({
        success: false,
        message: 'Calendar event not found'
      });
    }
    
    // Check if the teacher is the one who created the event
    if (calendarEvent.createdBy !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this calendar event'
      });
    }
    
    await calendarEvent.update({
      date,
      title,
      type,
      description,
      targetDepartment,
      targetYear
    });
    
    res.status(200).json({
      success: true,
      message: 'Calendar event updated successfully',
      data: calendarEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating calendar event',
      error: error.message
    });
  }
};

// Delete calendar event
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const calendarEvent = await CalendarEvent.findByPk(id);
    
    if (!calendarEvent) {
      return res.status(404).json({
        success: false,
        message: 'Calendar event not found'
      });
    }
    
    // Check if the teacher is the one who created the event
    if (calendarEvent.createdBy !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this calendar event'
      });
    }
    
    await calendarEvent.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Calendar event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting calendar event',
      error: error.message
    });
  }
};