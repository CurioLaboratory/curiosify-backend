const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema({
    deckname: String,
    numberOfQues: Number,
    createdAt: String,
    lastAttempted: String,
    lastAttemptScore: String,
    studyType: String,
    targetClass: String,
    questions: [
        {
            question: String,
            options: {
                type: [String],
                default: undefined // This makes the `options` field optional
            },
            answer: String, // Can be used for both correct options and subjective answers
        },
    ]
});

module.exports = mongoose.model("Flashcard", FlashcardSchema);