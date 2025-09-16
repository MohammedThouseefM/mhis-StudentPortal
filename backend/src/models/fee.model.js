const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeeSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
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
  totalFee: {
    type: Number,
    required: true
  },
  paid: {
    type: Number,
    required: true,
    default: 0
  },
  balance: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue'],
    required: true,
    default: 'Pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  lastPaymentDate: {
    type: Date,
    required: false
  },
  paymentReference: {
      type: String,
      required: false
    }
});

module.exports = mongoose.model('Fee', FeeSchema);