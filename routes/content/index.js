const express = require("express");
const router = express.Router();
const middleware = require("../../middlewares/index");
const contentController = require("../../controllers/content");

router.route("/createAssignment").post(contentController.createAssignment);
router.route("/createCourse").post(contentController.createCourse);
module.exports = router;
