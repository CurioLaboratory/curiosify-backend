const express = require("express");
const router = express.Router();
const middleware = require('../../middlewares/index');
const scanAIControllers = require('../../controllers/createCourse/index');

router.route('/saveChapterData').post(middleware.fetchuser, scanAIControllers.saveChapterData);


module.exports = router;






