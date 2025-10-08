const Fee = require('../models/fee.model');
const Student = require('../models/student.model');

// Create or update fee record
exports.createOrUpdate = async (req, res) => {
  try {
    const {
      studentId,
      semester,
      academicYear,
      totalFee,
      paid,
      dueDate
    } = req.body;
    
    // Calculate balance
    const balance = totalFee - paid;
    
    // Check if fee record already exists
    const existingFee = await Fee.findOne({
      student: studentId,
      semester,
      academicYear
    });
    
    let fee;
    
    if (existingFee) {
      // Update existing fee record
      existingFee.totalFee = totalFee;
      existingFee.paid = paid;
      existingFee.balance = balance;
      existingFee.status = balance <= 0 ? 'Paid' : 'Pending';
      existingFee.dueDate = dueDate;
      existingFee.lastPaymentDate = new Date();
      fee = await existingFee.save();
    } else {
      // Create new fee record
      fee = await Fee.create({
        student: studentId,
        semester,
        academicYear,
        totalFee,
        paid,
        balance,
        status: balance <= 0 ? 'Paid' : 'Pending',
        dueDate,
        lastPaymentDate: new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Fee record created/updated successfully',
      data: fee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating/updating fee record',
      error: error.message
    });
  }
};

// Get total fee by class
exports.getTotalFeeByClass = async (req, res) => {
  try {
    // Get all students grouped by class (department and year)
    const studentsByClass = await Student.aggregate([
      {
        // Add a field to extract the numeric part of the year
        $addFields: {
          yearNumber: {
            $toInt: {
              $arrayElemAt: [
                { $split: [{ $regexFind: { input: "$year", regex: /^\d+/ } }, ""] },
                0
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: { department: "$department", year: "$yearNumber" },
          students: { $push: "$_id" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.department": 1, "_id.year": 1 } }
    ]);

    // Get fee data for each class
    const feeByClass = await Promise.all(
      studentsByClass.map(async (classGroup) => {
        const studentIds = classGroup.students;
        
        // Get fee summary for this class
        const feeSummary = await Fee.aggregate([
          { $match: { student: { $in: studentIds } } },
          { 
            $group: {
              _id: null,
              totalFee: { $sum: "$totalFee" },
              totalPaid: { $sum: "$paid" },
              totalBalance: { $sum: "$balance" },
              paidCount: { $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] } },
              pendingCount: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
              overdueCount: { $sum: { $cond: [{ $eq: ["$status", "Overdue"] }, 1, 0] } }
            }
          }
        ]);
        
        return {
          department: classGroup._id.department,
          year: classGroup._id.year,
          studentCount: classGroup.count,
          feeData: feeSummary.length > 0 ? feeSummary[0] : {
            totalFee: 0,
            totalPaid: 0,
            totalBalance: 0,
            paidCount: 0,
            pendingCount: 0,
            overdueCount: 0
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      data: feeByClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving fee data by class',
      error: error.message
    });
  }
};

// Get fee records by student ID
exports.findByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const fees = await Fee.find({ student: studentId })
      .sort({ academicYear: -1, semester: -1 });
    
    res.status(200).json({
      success: true,
      data: fees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving fee records',
      error: error.message
    });
  }
};

// Get fee record by student ID, semester, and academic year
exports.findOne = async (req, res) => {
  try {
    const { studentId, semester, academicYear } = req.params;
    
    const fee = await Fee.findOne({
        student: studentId,
        semester,
        academicYear
      });
    
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving fee record',
      error: error.message
    });
  }
};

// Record fee payment
exports.recordPayment = async (req, res) => {
  try {
    const { studentId, semester, academicYear } = req.params;
    const { amount, paymentReference } = req.body;
    
    const fee = await Fee.findOne({
      where: {
        studentId,
        semester,
        academicYear
      }
    });
    
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }
    
    // Update payment details
    const newPaidAmount = fee.paid + amount;
    const newBalance = fee.totalFee - newPaidAmount;
    
    fee.paid = newPaidAmount;
    fee.balance = newBalance;
    fee.status = newBalance <= 0 ? 'Paid' : 'Pending';
    fee.lastPaymentDate = new Date();
    fee.paymentReference = paymentReference;
    
    await fee.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      data: fee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording payment',
      error: error.message
    });
  }
};

// Get pending fee records
exports.getPendingFees = async (req, res) => {
  try {
    const { department, year } = req.query;
    
    // Find students matching department and year criteria
    let studentQuery = {};
    
    if (department) {
      studentQuery.department = department;
    }
    
    if (year) {
      studentQuery.year = year;
    }
    
    // First get matching students
    let studentIds = [];
    if (department || year) {
      const students = await Student.find(studentQuery).select('_id');
      studentIds = students.map(student => student._id);
    }
    
    // Build fee query
    let feeQuery = { status: 'Pending' };
    
    if (studentIds.length > 0) {
      feeQuery.student = { $in: studentIds };
    }
    
    // Find pending fees and populate student information
    const pendingFees = await Fee.find(feeQuery)
      .populate('student', 'name department year rollNumber')
      .sort({ dueDate: 1 });
    
    res.status(200).json({
      success: true,
      data: pendingFees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving pending fee records',
      error: error.message
    });
  }
};

// Get fee summary by department and year
exports.getFeeSummary = async (req, res) => {
  try {
    const { department, year, academicYear, semester } = req.query;
    
    if (!department || !year || !academicYear) {
      return res.status(400).json({
        success: false,
        message: 'Department, year, and academicYear are required'
      });
    }
    
    // Get students by department and year
    const students = await Student.find({
      department,
      year
    }).select('_id');
    
    const studentIds = students.map(student => student._id);
    
    let matchQuery = {
      student: { $in: studentIds },
      academicYear
    };
    
    if (semester) {
      matchQuery.semester = semester;
    }
    
    // Get fee records for these students using MongoDB aggregation
    const feeSummary = await Fee.aggregate([
      { $match: matchQuery },
      { $group: {
        _id: null,
        totalFeeSum: { $sum: "$totalFee" },
         paidSum: { $sum: "$paid" },
         balanceSum: { $sum: "$balance" },
         studentCount: { $sum: 1 },
         paidCount: { $sum: { $cond: [{ $eq: ["$status", "PAID"] }, 1, 0] } },
         pendingCount: { $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] } }
      }}
    ]);
    
    res.status(200).json({
      success: true,
      data: feeSummary.length > 0 ? feeSummary[0] : {
        totalFeeSum: 0,
        paidSum: 0,
        balanceSum: 0,
        studentCount: 0,
        paidCount: 0,
        pendingCount: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving fee summary',
      error: error.message
    });
  }
};