const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema({
    deckname: String,
    numberOfQues: Number,
    tags: [{
            tag: String
    }],
    createdAt: String,
    lastAttempted: String,
    lastAttemptScore: String,
    studyType: String,
    targetClass: String,
    question: String,
    answer: String,
});

module.exports = mongoose.model("Flashcard", FlashcardSchema);