const Timetable = require('../models/timetable.model');
const Teacher = require('../models/teacher.model');

// Create a new timetable entry
exports.create = async (req, res) => {
  try {
    const {
      department,
      year,
      day,
      hour,
      subject,
      teacherId,
      room,
      academicYear,
      semester
    } = req.body;
    
    // Check if a timetable entry already exists for this slot
    const existingEntry = await Timetable.findOne({
      department,
      year,
      day,
      hour,
      academicYear,
      semester
    });
    
    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: 'A timetable entry already exists for this slot'
      });
    }
    
    const timetable = new Timetable({
      department,
      year,
      day,
      hour,
      subject,
      teacher: teacherId,
      room,
      academicYear,
      semester
    });
    
    await timetable.save();
    
    res.status(201).json({
      success: true,
      message: 'Timetable entry created successfully',
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating timetable entry',
      error: error.message
    });
  }
};

// Get timetable entries by department, year, and optional filters
exports.findByDepartmentAndYear = async (req, res) => {
  try {
    const { department, year } = req.params;
    const { academicYear, semester, day } = req.query;
    
    let query = {
      department,
      year
    };
    
    if (academicYear) {
      query.academicYear = academicYear;
    }
    
    if (semester) {
      query.semester = semester;
    }
    
    if (day) {
      query.day = day;
    }
    
    const timetable = await Timetable.find(query)
      .populate('teacher', 'name department')
      .sort({ day: 1, hour: 1 });
    
    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving timetable',
      error: error.message
    });
  }
};

// Get timetable entries by teacher ID
exports.findByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { academicYear, semester, day } = req.query;
    
    let query = {
      teacher: teacherId
    };
    
    if (academicYear) {
      query.academicYear = academicYear;
    }
    
    if (semester) {
      query.semester = semester;
    }
    
    if (day) {
      query.day = day;
    }
    
    const timetable = await Timetable.find(query)
      .populate('teacher', 'name department')
      .sort({ day: 1, hour: 1 });
    
    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving timetable',
      error: error.message
    });
  }
};

// Update timetable entry
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      subject,
      teacherId,
      room
    } = req.body;
    
    const timetable = await Timetable.findByPk(id);
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }
    
    await timetable.update({
      subject,
      teacherId,
      room
    });
    
    res.status(200).json({
      success: true,
      message: 'Timetable entry updated successfully',
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating timetable entry',
      error: error.message
    });
  }
};

// Delete timetable entry
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const timetable = await Timetable.findByPk(id);
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }
    
    await timetable.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Timetable entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting timetable entry',
      error: error.message
    });
  }
};

// Bulk create timetable entries
exports.bulkCreate = async (req, res) => {
  try {
    const { entries } = req.body;
    
    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Entries must be a non-empty array'
      });
    }
    
    const timetable = await Timetable.bulkCreate(entries);
    
    res.status(201).json({
      success: true,
      message: 'Timetable entries created successfully',
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating timetable entries',
      error: error.message
    });
  }
};