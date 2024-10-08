const mongoose = require("mongoose");

const StudentQuizAttendanceSchema = new mongoose.Schema({
    studentId: { type: String, required: true }, // Email of the student
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, default: 0 },
    userAnswers: [String], // Array to store answers selected by the student
    questions: { type: Array, required: true },
    status: { type: String, enum: ['completed', 'incomplete'], required: true }
}, { timestamps: true });

module.exports = mongoose.model("StudentQuizAttendance", StudentQuizAttendanceSchema);
