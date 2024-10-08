const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    language: String,
    title: String,
    questions: [
        {
            question: String,
            options: {
                type: [String],
                default: undefined // This makes the `options` field optional
            },
            answer: String, // Can be used for both correct options and subjective answers
        },
    ],
    classLevel: String,
    subject: String,
    date: String,
    totalQuestions: Number,
    createdBy: { type: String, required: true },
});

module.exports = mongoose.model("Quiz", QuizSchema);
