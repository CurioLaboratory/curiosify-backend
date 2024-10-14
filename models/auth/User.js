const mongoose = require("mongoose");

const User = new mongoose.Schema({
    role: {
        type: String,
        enum: ["student", "teacher"],
        default: "student",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    hashedPwd: {
        type: String,
        required: true,
    },
    rollNo: {
        type: String,
    },
    classLevel:{
        type:String,
    },
    collegeName:{
        type:String,
    },
    salt: {
        type: String,
        required: true,
    },
    isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", User);
