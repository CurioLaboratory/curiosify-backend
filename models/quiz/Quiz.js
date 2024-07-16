const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    language: String,
    title: String,
    questions: [
        {
            question: String,
            options: [String],
            answer: String,
        },
    ],
    classLevel: String,
    date: String,
    createdBy: { type: String, required: true },
});

module.exports = mongoose.model("Quiz", QuizSchema);
