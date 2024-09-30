const express = require("express");

const router = express.Router();

// auth routes
router.use("/auth", require("./auth/index"));
router.use("/event", require("./events/index"));
router.use("/quiz", require("./quiz/index"));
router.use("/student_quiz_attendance", require("./Student_quiz_attendance/Student_quiz_attendance"));
router.use("/library", require("./library/index"));
router.use("/studentManagement", require("./studentManagement/index"));
router.use("/flashcard", require("./flashcards/index"));

module.exports = router;
