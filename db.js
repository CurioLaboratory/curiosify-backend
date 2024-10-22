const mongoose = require("mongoose");

const connectToMongo = (mongoStr) => {
    console.log('MongoDB URI:', mongoStr); // Log the URI being used

    return mongoose.connect(mongoStr)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => {
            console.error("NOT CONNECTED TO NETWORK", err); // Improved error logging
        });
};

module.exports = connectToMongo;
