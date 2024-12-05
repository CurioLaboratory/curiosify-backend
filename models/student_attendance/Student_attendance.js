const mongoose = require('mongoose');

// Define the schema for student attendance
const studentAttendanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique to avoid duplicate student entries
  },
  classLevel: {
    type: String,
    required: true,
  },
  attendance: [
    {
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: String, // Store time in 'HH:MM' format or other preferred format
        required: true,
      },
    },
  ],
});

// Create the model
const StudentAttendance = mongoose.model('StudentAttendance', studentAttendanceSchema);

module.exports = StudentAttendance;
