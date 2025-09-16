const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResultSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
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
  examType: {
    type: String,
    required: true
  },
  marksObtained: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pass', 'Fail'],
    required: true
  },
  gpa: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Result', ResultSchema);