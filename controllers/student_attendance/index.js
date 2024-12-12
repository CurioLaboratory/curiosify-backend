const StudentAttendance = require('../../models/student_attendance/Student_attendance');

exports.markAttendance = async (req, res) => {
    try {
      const { name, email, classLevel } = req.body;
  
      if (!name || !email || !classLevel) {
        return res.status(400).json({ error: "Name, email, and classLevel are required." });
      }
  
      const currentDate = new Date();
      const date = currentDate.toLocaleDateString('en-CA'); // 'en-CA' outputs date in ISO format (YYYY-MM-DD)
      const time = currentDate.toLocaleTimeString('en-GB', { hour12: false }); // 'en-GB' ensures 24-hour format
  
      // Check if the student already exists
      let student = await StudentAttendance.findOne({ email });
  
      if (student) {
        // Check if today's date is already in the attendance array
        const isAlreadyPresent = student.attendance.some((record) => {
          const recordDate = new Date(record.date).toLocaleDateString('en-CA'); // Format record date to YYYY-MM-DD
          return recordDate === date; // Compare only the date
        });
  
        if (isAlreadyPresent) {
          return res.status(200).json({ message: "Already marked present for today." });
        }
  
        // Add today's attendance to the array
        student.attendance.push({ date, time });
        await student.save();
      } else {
        // Create a new student attendance record
        student = new StudentAttendance({
          name,
          email,
          classLevel,
          attendance: [{ date, time }],
        });
        await student.save();
      }
  
      res.status(200).json({ message: "Attendance marked successfully.", student });
    } catch (err) {
      console.error("Error marking attendance:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  

// Controller to get attendance for a student
exports.getAttendance = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const student = await StudentAttendance.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json({ attendance: student.attendance });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
