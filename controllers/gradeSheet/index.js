const StudentAttendance = require('../../models/student_attendance/Student_attendance');

exports.getGradeSheet = async (req, res) => {
  const { classLevel, date } = req.query;

  if (!classLevel || !date) {
    return res.status(400).json({ error: "Class level and date are required." });
  }

  try {
    const dateObj = new Date(date);
    const students = await StudentAttendance.find({ classLevel });

    const attendanceReport = students.map((student) => {
      // Use a Set to keep track of unique dates
      const uniqueDates = new Set();

      student.attendance.forEach((record) => {
        const recordDate = new Date(record.date).toDateString();
        // Add the record date to the Set
        uniqueDates.add(recordDate);
      });

      // Check if the given date is in the uniqueDates set
      const isPresentOnDate = uniqueDates.has(dateObj.toDateString());

      return {
        name: student.name,
        email: student.email,
        totalPresentDays: uniqueDates.size, // Count of unique dates
        isPresentOnDate, // True or false for presence on the given date
      };
    });

    res.status(200).json(attendanceReport);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
