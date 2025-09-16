const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeedbackSessionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    required: true,
    default: 'open'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String
  },
  year: {
    type: String
  },
  semester: {
    type: String
  },
  academicYear: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FeedbackSession', FeedbackSessionSchema);