const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  date: {
    type: String,  // "2026-05-14"
    required: true
  },
  time: {
    type: String,  // "10:30 AM"
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    default: 'present'
  },
  confidence: {
    type: Number,  // face match % 
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);