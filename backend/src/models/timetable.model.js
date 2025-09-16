const mongoose = require('mongoose');
const { Schema } = mongoose;

const TimetableSchema = new Schema({
  department: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  period: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  room: {
    type: String
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Timetable', TimetableSchema);