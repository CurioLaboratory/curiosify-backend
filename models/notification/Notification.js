const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    studentId: { type: [String], required: true }, // Array of student emails
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the item (quiz, event, etc.)
    type: { type: String, enum: ['quiz', 'flashcard', 'event'], required: true }, // Type of notification
    message: { type: String, required: true }, // Notification message
    createdAt: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', NotificationSchema);
