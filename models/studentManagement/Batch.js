const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
    name: String,
    dateCreated: String,
    subject: String,
    students: [{
        email: String
    }]
})

module.exports = mongoose.model("Batch", BatchSchema);