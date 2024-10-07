const express = require("express");
const router = express.Router();
const middleware = require('../../middlewares/index'); // Importing your middleware
const quizControllers = require('../../controllers/Student_quiz_attendance/Student_quiz_attendance');

// Routes for getting quizzes
router.route('/getactivequizzes').get(middleware.fetchuser, quizControllers.getActiveQuizzes);
router.route('/getcompletedquizzes').get(middleware.fetchuser, quizControllers.getCompletedQuizzes);
router.route('/getincompletequizzes').get(middleware.fetchuser, quizControllers.getIncompleteQuizzes);

// Route for submitting a quiz attempt
router.route('/submitquiz').post(middleware.fetchuser, quizControllers.submitQuiz);

module.exports = router;
