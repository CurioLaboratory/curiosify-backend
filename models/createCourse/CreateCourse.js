const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for each module
const moduleSchema = new Schema({
  Name: {
    type: String,
    required: true
  },
  Explainantion: {
    type: String,
    required: true
  }
});

// Define the schema for each chapter
const chapterSchema = new Schema({
  Chapter: {
    type: String,
    required: true
  },
  Modules: [moduleSchema], // Array of modules
  createdBy: { type: String, required: true },
});

// Create a model from the schema
const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
