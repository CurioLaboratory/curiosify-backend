const express = require("express");
const router = express.Router();
const middleware = require('../../middlewares/index');
const quizperformanceController = require('../../controllers/quizperformance/index');
router.route('/updateOrAddSubjectScore').post(middleware.fetchuser,quizperformanceController.updateOrAddSubjectScore)
router.route('/getStudentperformancedetails').get(middleware.fetchuser,quizperformanceController.getStudentperformancedetails)

module.exports = router;
