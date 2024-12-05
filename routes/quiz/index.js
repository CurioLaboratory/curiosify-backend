const express = require("express");
const router = express.Router();
const middleware = require("../../middlewares/index");
const quizControllers = require("../../controllers/quiz/index");
const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   },
// });
const upload = multer({ storage: multer.memoryStorage() });
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
router
  .route("/genrateQuizText")
  .post(upload.single("file"), quizControllers.generateQuizBasedOnTopic);

module.exports = router;
