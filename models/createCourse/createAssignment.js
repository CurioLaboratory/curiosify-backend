const mongoose = require('mongoose');

// Schema for Instructions
const instructionSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  title: { type: String, required: true }
});

// Schema for Assignment
const assignmentSchema = new mongoose.Schema({
  assignmentTitle: { type: String, required: true },
  assignmentObjective: { type: String, required: true },
  assignmentGrading: { type: String, required: true },
  Instructions: [instructionSchema],
  createdBy: { type: String, required: true },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
