const express = require("express");

const router = express.Router();

// auth routes
router.use("/auth", require("./auth/index"));
router.use("/event", require("./events/index"));
router.use("/quiz", require("./quiz/index"));
router.use("/student_quiz_attendance", require("./Student_quiz_attendance/Student_quiz_attendance"));
router.use("/notification", require("./notification/index"));
router.use("/library", require("./library/index"));
router.use("/studentManagement", require("./studentManagement/index"));
router.use("/flashcard", require("./flashcards/index"));
router.use("/useractivityFeed", require("./userActivityFeed/index"));
router.use("/quizperformance", require("./quizperformance/index"));
router.use("/userChatHistory", require("./userChatHistory/index"));
router.use("/createCourse",require('./createCourse/index'));

module.exports = router;
