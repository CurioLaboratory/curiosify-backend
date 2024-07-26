const mongoose = require('mongoose');

const LibrarySchema = new mongoose.Schema({  
    title: String,
    subject: String,
    classLevel: Number,
    date: String,
    createdBy: { type: String, required: true },
});

module.exports = mongoose.model('Library', LibrarySchema);
