const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  time: {
    type: String  // "10:00 AM"
  }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);