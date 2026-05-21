// const mongoose = require('mongoose');

// const subjectSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   code: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   time: {
//     type: String 
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Subject', subjectSchema);





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
type: String
},

// NEW
startTime: {
type: String,
default: ''
},

endTime: {
type: String,
default: ''
}

}, { timestamps: true });

module.exports = mongoose.model(
'Subject',
subjectSchema
);

