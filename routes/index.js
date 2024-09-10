const express = require("express");

const router = express.Router();

// auth routes
router.use("/auth", require("./auth/index"));
router.use("/event", require("./events/index"));
router.use("/quiz", require("./quiz/index"));
router.use("/library", require("./library/index"));
router.use("/studentManagement", require("./studentManagement/index"));
router.use("/flashcard", require("./flashcards/index"));
router.use("/createCourse",require('./createCourse/index'));

module.exports = router;
