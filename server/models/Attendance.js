const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: {
    type: String, // Stored as 'YYYY-MM-DD'
    required: true
  },
  subjectId: {
    type: String,
    required: true
  },
  presentStudents: [{
    type: String // We will store the MIS strings here
  }],
  lectureConducted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

attendanceSchema.index({ date: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
