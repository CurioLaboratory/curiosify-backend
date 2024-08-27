const express = require("express");
const router = express.Router();
const middleware = require("../../middlewares/index");
const flashcardControllers = require("../../controllers/flashcards/index");

router.route('/createManual').post(flashcardControllers.createManual);
router.route('/getAllFlashcards').get(flashcardControllers.getAllFlashcards);

module.exports = router;