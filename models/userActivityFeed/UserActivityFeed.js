// models/UserActivity.js
const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    activities: [
        {
            type: {
                type: String, // quiz, assignment, flashcard
                required: true,
            },
            title: {
                type: String, // title of the quiz/assignment/flashcard
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        }
    ]
});

module.exports = mongoose.model('UserActivity', UserActivitySchema);
