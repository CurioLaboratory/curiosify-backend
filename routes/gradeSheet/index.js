const express = require("express");
const router = express.Router();
//const middleware = require('../../middlewares/index'); // Importing your middleware
const gradeSheetControllers = require('../../controllers/gradeSheet/index');

// Route to  get grade sheet
router.route('/getGradeSheet').get(gradeSheetControllers.getGradeSheet);

module.exports = router;
