/**
 * Utility functions for duplicating data in MongoDB collections
 */
const Leave = require('../models/leave.model');

/**
 * Duplicate a single leave request by ID
 * @param {string} leaveId - The ID of the leave request to duplicate
 * @returns {Promise<Object>} - The duplicated leave request document
 */
const duplicateLeaveRequest = async (leaveId) => {
  try {
    // Find the original leave request
    const originalLeave = await Leave.findById(leaveId);
    
    if (!originalLeave) {
      throw new Error('Leave request not found');
    }
    
    // Create a new leave request with the same data
    // Convert to plain object and remove _id to create a new document
    const leaveData = originalLeave.toObject();
    delete leaveData._id;
    
    // Set status to pending for the duplicate
    leaveData.status = 'pending';
    leaveData.reviewedBy = null;
    leaveData.reviewedAt = null;
    leaveData.rejectionReason = null;
    
    // Update timestamps
    leaveData.createdAt = new Date();
    leaveData.updatedAt = new Date();
    
    // Create and save the duplicate
    const duplicateLeave = new Leave(leaveData);
    const savedDuplicate = await duplicateLeave.save();
    
    return savedDuplicate;
  } catch (error) {
    throw error;
  }
};

/**
 * Duplicate multiple leave requests based on filter criteria
 * @param {Object} filter - MongoDB filter criteria
 * @returns {Promise<Array>} - Array of duplicated leave request documents
 */
const duplicateMultipleLeaveRequests = async (filter) => {
  try {
    // Find all leave requests matching the filter
    const leaveRequests = await Leave.find(filter);
    
    if (!leaveRequests.length) {
      throw new Error('No leave requests found matching the criteria');
    }
    
    // Duplicate each leave request
    const duplicatedLeaves = [];
    
    for (const leave of leaveRequests) {
      const leaveData = leave.toObject();
      delete leaveData._id;
      
      // Set status to pending for the duplicate
      leaveData.status = 'pending';
      leaveData.reviewedBy = null;
      leaveData.reviewedAt = null;
      leaveData.rejectionReason = null;
      
      // Update timestamps
      leaveData.createdAt = new Date();
      leaveData.updatedAt = new Date();
      
      // Create and save the duplicate
      const duplicateLeave = new Leave(leaveData);
      const savedDuplicate = await duplicateLeave.save();
      
      duplicatedLeaves.push(savedDuplicate);
    }
    
    return duplicatedLeaves;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  duplicateLeaveRequest,
  duplicateMultipleLeaveRequests
};