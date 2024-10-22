const mongoose = require("mongoose");

const mongostr = process.env.MONGO_STR; // Load MongoDB URI from environment variables
console.log('MongoDB URI:', mongostr);  // This should now log the correct URI

const connectToMongo = () => {
    mongoose
        .connect(mongostr)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => {
            console.error("NOT CONNECTED TO NETWORK", err); // Improved error logging
        });
};

module.exports = connectToMongo;
