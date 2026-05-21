// const mongoose = require('mongoose');

// const attendanceSchema = new mongoose.Schema({
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   subject: {
//     type: String,
//     required: true
//   },
//   date: {
//     type: String,  // "2026-05-14"
//     required: true
//   },
//   time: {
//     type: String,  // "10:30 AM"
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['present', 'absent'],
//     default: 'present'
//   },
//   confidence: {
//     type: Number,  // face match % 
//     default: 0
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Attendance', attendanceSchema);




const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({

// Student reference
student: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},

// Subject Name
subject: {
type: String,
required: true
},

// Department
department: {
type: String,
required: true
},

// Year
year: {
type: String,
required: true
},

// Batch
batch: {
type: String,
required: true
},

// Attendance Date
date: {
type: String,   // Example: "2026-05-21"
required: true
},

// Attendance Time
time: {
type: String,   // Example: "10:30 AM"
required: true
},

// Lecture Start Time
startTime: {
type: String,   // Example: "10:00 AM"
required: true
},

// Lecture End Time
endTime: {
type: String,   // Example: "11:00 AM"
required: true
},

// Attendance Status
status: {
type: String,
enum: ['present', 'absent'],
default: 'present'
},

// Face Match Confidence
confidence: {
type: Number,
default: 0
}

}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
