/**
 * Controller for data duplication operations
 */
const { duplicateLeaveRequest, duplicateMultipleLeaveRequests } = require('../utils/duplicate-data');

/**
 * Duplicate a single leave request by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.duplicateSingleLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Leave request ID is required' 
      });
    }
    
    const duplicatedLeave = await duplicateLeaveRequest(id);
    
    return res.status(201).json({
      success: true,
      message: 'Leave request duplicated successfully',
      data: duplicatedLeave
    });
  } catch (error) {
    console.error('Error duplicating leave request:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error duplicating leave request'
    });
  }
};

/**
 * Duplicate multiple leave requests based on filter criteria
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.duplicateMultipleLeaveRequests = async (req, res) => {
  try {
    const filter = req.body.filter || {};
    
    const duplicatedLeaves = await duplicateMultipleLeaveRequests(filter);
    
    return res.status(201).json({
      success: true,
      message: `${duplicatedLeaves.length} leave requests duplicated successfully`,
      data: duplicatedLeaves
    });
  } catch (error) {
    console.error('Error duplicating multiple leave requests:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error duplicating leave requests'
    });
  }
};