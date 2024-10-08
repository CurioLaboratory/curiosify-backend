const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Module schema
const moduleSchema = new Schema({
  Name: { type: String, required: true },
  Explanation: { type: String, required: true }
});

// Define the Chapter schema
const chapterSchema = new Schema({
  Chapter: { type: String, required: true },
  Modules: [moduleSchema] // Array of modules for each chapter
});

// Define the Course schema (parent)
const courseSchema = new Schema({
  Chapters: [chapterSchema], // Array of chapters
  createdBy: { type: String, required: true },
});

// Export the Course model
module.exports = mongoose.model('Chapter', courseSchema);
