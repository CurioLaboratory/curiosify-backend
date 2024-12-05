const express = require("express");
const router = express.Router();
//const middleware = require('../../middlewares/index'); // Importing your middleware
const attendanceController = require('../../controllers/student_attendance/index');

// Route to mark attendance
router.route('/markattendance').post(attendanceController.markAttendance);

// Route to get all attendance records for a student
router.route('/getattendance').get(attendanceController.getAttendance);

module.exports = router;
