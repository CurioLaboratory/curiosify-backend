const express = require("express");
const router = express.Router();
const middleware = require("../../middlewares/index");
const quizControllers = require("../../controllers/quiz/index");

router
  .route("/createmanualquiz")
  .post(middleware.fetchuser, quizControllers.createManualQuiz);
router
  .route("/getallquiz")
  .get(middleware.fetchuser, quizControllers.getAllQuiz);
router
  .route("/deletequiz/:id")
  .delete(middleware.fetchuser, quizControllers.deleteQuiz);
router
  .route("/createAIquiz")
  .post(middleware.fetchuser, quizControllers.createAIquiz);
router.route("/genrateQuizUpload").post(quizControllers.genrateAIquize);
router.route("/genrateQuizText").post(quizControllers.generateQuizBasedOnTopic);
router.route("/downloadfile").post(quizControllers.downloadQuestionsPDF);
router
  .route("/imageQuestionsUsingAI")
  .post(quizControllers.genrateImagesQuestion);
router.route("/genrateFlashCard").post(quizControllers.genrateFlashCard);
module.exports = router;
