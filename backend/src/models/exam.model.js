const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  examType: {
    type: String,
    enum: ['internal', 'semester', 'practical'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', ExamSchema);