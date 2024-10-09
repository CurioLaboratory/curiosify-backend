// models/ChatHistory.js

const mongoose = require('mongoose');

// Define a schema for individual chat sessions
const chatSessionSchema = new mongoose.Schema({
  chatId: {
    type: String,
    default: () => new mongoose.Types.ObjectId(), // Automatically generate a unique chatId
  },
  messages: [
    {
      role: {
        type: String,
        enum: ['user', 'bot'], // Use 'role' for user/bot
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Define the main ChatHistory schema
const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the User model
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  chats: [chatSessionSchema], // Array of chat sessions, each with a unique chatId and messages
});

// Create the ChatHistory model
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;
