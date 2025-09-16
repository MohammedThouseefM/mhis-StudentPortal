const mongoose = require('mongoose');
const { Schema } = mongoose;

const CalendarEventSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['holiday', 'exam', 'assignment', 'event'],
    required: true
  },
  description: {
    type: String
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);