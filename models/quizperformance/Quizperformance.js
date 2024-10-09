const mongoose = require('mongoose');

// Define a sub-schema for subjects and their corresponding scores
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Subject name
  score: { type: Number, required: true }, // Score in the subject
});

// Main schema for storing user performance
const quizPerformanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  email: { type: String, required: true }, // User email
  subjects: [subjectSchema], // Array of subjects and scores
  date: { type: Date, default: Date.now }, // Date of record creation or update
});

module.exports = mongoose.model('QuizPerformance', quizPerformanceSchema);
