const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true, unique:true },
    poster: { type: String},
    summary: { type: String, required: true },
    date: { type: Date, required: true },
    createdBy: { type: String,  required: true },
});

module.exports = mongoose.model('Event', EventSchema);
