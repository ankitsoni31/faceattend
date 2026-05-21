// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   rollNumber: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   role: {
//     type: String,
//     enum: ['student', 'admin'],
//     default: 'student'
//   },
//   faceDescriptor: {
//     type: [Number],  // face-api.js ka 128-point array
//     default: []
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('User', userSchema);



const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
name: {
type: String,
required: true
},

rollNumber: {
type: String,
required: true,
unique: true
},

email: {
type: String,
required: true,
unique: true
},

password: {
type: String,
required: true
},

role: {
type: String,
enum: ['student', 'admin'],
default: 'student'
},

// NEW FIELDS
department: {
type: String,
default: ''
},

year: {
type: String,
default: ''
},

batch: {
type: String,
default: ''
},

faceDescriptor: {
type: [Number],
default: []
},

createdAt: {
type: Date,
default: Date.now
}
});

module.exports = mongoose.model('User', userSchema);
