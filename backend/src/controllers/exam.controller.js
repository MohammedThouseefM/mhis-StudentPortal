const Exam = require('../models/exam.model');

// Create a new exam
exports.create = async (req, res) => {
  try {
    const {
      subjectCode,
      subject,
      date,
      time,
      department,
      year,
      semester,
      academicYear,
      venue,
      duration,
      maxMarks,
      examType
    } = req.body;
    
    const exam = new Exam({
      subjectCode,
      subject,
      date,
      time,
      department,
      year,
      semester,
      academicYear,
      venue,
      duration,
      maxMarks,
      examType
    });
    
    await exam.save();
    
    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating exam',
      error: error.message
    });
  }
};

// Get all exams with optional filters
exports.findAll = async (req, res) => {
  try {
    const { department, year, semester, academicYear, examType, startDate, endDate } = req.query;
    
    let whereClause = {};
    
    if (department) {
      whereClause.department = department;
    }
    
    if (year) {
      whereClause.year = year;
    }
    
    if (semester) {
      whereClause.semester = semester;
    }
    
    if (academicYear) {
      whereClause.academicYear = academicYear;
    }
    
    if (examType) {
      whereClause.examType = examType;
    }
    
    // Filter by date range if provided
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.date = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.date = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    const exams = await Exam.findAll({
      where: whereClause,
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: exams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving exams',
      error: error.message
    });
  }
};

// Get exam by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const exam = await Exam.findByPk(id);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving exam',
      error: error.message
    });
  }
};

// Update exam
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      subjectCode,
      subject,
      date,
      time,
      venue,
      duration,
      maxMarks,
      examType
    } = req.body;
    
    const exam = await Exam.findByPk(id);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    await exam.update({
      subjectCode,
      subject,
      date,
      time,
      venue,
      duration,
      maxMarks,
      examType
    });
    
    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating exam',
      error: error.message
    });
  }
};

// Delete exam
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const exam = await Exam.findByPk(id);
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }
    
    await exam.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting exam',
      error: error.message
    });
  }
};

// Bulk create exams
exports.bulkCreate = async (req, res) => {
  try {
    const { exams } = req.body;
    
    if (!Array.isArray(exams) || exams.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Exams must be a non-empty array'
      });
    }
    
    const createdExams = await Exam.bulkCreate(exams);
    
    res.status(201).json({
      success: true,
      message: 'Exams created successfully',
      data: createdExams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating exams',
      error: error.message
    });
  }
};