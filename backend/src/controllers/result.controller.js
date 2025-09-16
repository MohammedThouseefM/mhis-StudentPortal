const Result = require('../models/result.model');
const Student = require('../models/student.model');

// Create or update result
exports.createOrUpdate = async (req, res) => {
  try {
    const {
      studentId,
      semester,
      academicYear,
      subjectCode,
      subjectName,
      ciaMarks,
      semesterMarks,
      grade,
      resultStatus
    } = req.body;
    
    // Calculate total marks
    const totalMarks = ciaMarks + semesterMarks;
    
    // Check if result already exists
    const existingResult = await Result.findOne({
      student: studentId,
      semester,
      academicYear,
      subjectCode
    });
    
    let result;
    
    if (existingResult) {
      // Update existing result
      existingResult.subjectName = subjectName;
      existingResult.ciaMarks = ciaMarks;
      existingResult.semesterMarks = semesterMarks;
      existingResult.totalMarks = totalMarks;
      existingResult.grade = grade;
      existingResult.resultStatus = resultStatus;
      
      result = await existingResult.save();
    } else {
      // Create new result
      result = new Result({
        student: studentId,
        semester,
        academicYear,
        subjectCode,
        subjectName,
        ciaMarks,
        semesterMarks,
        totalMarks,
        grade,
        resultStatus
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Result created/updated successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating/updating result',
      error: error.message
    });
  }
};

// Get results by student ID
exports.findByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semester, academicYear } = req.query;
    
    let whereClause = { studentId };
    
    if (semester) {
      whereClause.semester = semester;
    }
    
    if (academicYear) {
      whereClause.academicYear = academicYear;
    }
    
    const results = await Result.findAll({
      where: whereClause,
      order: [
        ['academicYear', 'DESC'],
        ['semester', 'DESC'],
        ['subjectCode', 'ASC']
      ]
    });
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving results',
      error: error.message
    });
  }
};

// Get result by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Result.findByPk(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving result',
      error: error.message
    });
  }
};

// Delete result
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Result.findByPk(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }
    
    await result.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Result deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting result',
      error: error.message
    });
  }
};

// Bulk create results
exports.bulkCreate = async (req, res) => {
  try {
    const { results } = req.body;
    
    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Results must be a non-empty array'
      });
    }
    
    // Calculate total marks for each result
    const processedResults = results.map(result => ({
      ...result,
      totalMarks: result.ciaMarks + result.semesterMarks
    }));
    
    const createdResults = await Result.bulkCreate(processedResults);
    
    res.status(201).json({
      success: true,
      message: 'Results created successfully',
      data: createdResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating results',
      error: error.message
    });
  }
};

// Get results by department and year
exports.findByDepartmentAndYear = async (req, res) => {
  try {
    const { department, year } = req.params;
    const { semester, academicYear, subjectCode } = req.query;
    
    if (!department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Department and year are required'
      });
    }
    
    // Get students by department and year
    const students = await Student.findAll({
      where: {
        department,
        year
      },
      attributes: ['id', 'name', 'rollNumber']
    });
    
    const studentIds = students.map(student => student.id);
    
    let whereClause = {
      studentId: { [Op.in]: studentIds }
    };
    
    if (semester) {
      whereClause.semester = semester;
    }
    
    if (academicYear) {
      whereClause.academicYear = academicYear;
    }
    
    if (subjectCode) {
      whereClause.subjectCode = subjectCode;
    }
    
    const results = await Result.findAll({
      where: whereClause,
      include: [{
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'rollNumber']
      }],
      order: [
        ['subjectCode', 'ASC'],
        [{ model: Student, as: 'student' }, 'rollNumber', 'ASC']
      ]
    });
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving results',
      error: error.message
    });
  }
};

// Calculate GPA for a student
exports.calculateGPA = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semester, academicYear } = req.query;
    
    if (!semester || !academicYear) {
      return res.status(400).json({
        success: false,
        message: 'Semester and academicYear are required'
      });
    }
    
    const results = await Result.findAll({
      where: {
        studentId,
        semester,
        academicYear
      }
    });
    
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No results found for this student in the specified semester and academic year'
      });
    }
    
    // Calculate GPA based on grades
    let totalGradePoints = 0;
    let totalSubjects = results.length;
    
    const gradePoints = {
      'A+': 10,
      'A': 9,
      'B+': 8,
      'B': 7,
      'C+': 6,
      'C': 5,
      'D': 4,
      'E': 3,
      'F': 0
    };
    
    results.forEach(result => {
      totalGradePoints += gradePoints[result.grade] || 0;
    });
    
    const gpa = totalGradePoints / totalSubjects;
    
    res.status(200).json({
      success: true,
      data: {
        studentId,
        semester,
        academicYear,
        gpa: parseFloat(gpa.toFixed(2)),
        totalSubjects
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating GPA',
      error: error.message
    });
  }
};