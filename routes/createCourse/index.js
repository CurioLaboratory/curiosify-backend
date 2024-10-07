const express = require("express");
const router = express.Router();
const middleware = require('../../middlewares/index');
const createCourseControllers = require('../../controllers/createCourse/index');

router.route('/saveChapterData').post(middleware.fetchuser, createCourseControllers.saveChapterData);
router.route('/saveAssignmentData').post(middleware.fetchuser, createCourseControllers.saveAssignmentData);

module.exports = router;






