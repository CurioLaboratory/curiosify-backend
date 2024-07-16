const express = require("express");
const router = express.Router();
const middleware = require('../../middlewares/index');
const quizControllers = require('../../controllers/quiz/index');

router.route('/createmanualquiz').post(middleware.fetchuser, quizControllers.createManualQuiz);
router.route('/getallquiz').get( quizControllers.getAllQuiz);
router.route('/deletequiz/:id').delete(middleware.fetchuser, quizControllers.deleteQuiz);

module.exports = router;