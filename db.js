const mongoose = require("mongoose");
require('dotenv').config();

const mongostr = process.env.MONGO_STR; // Load MongoDB URI from environment variables

const connectToMongo = () => {
    mongoose
        .connect(mongostr, { useNewUrlParser: true, useUnifiedTopology: true }) // Use the correct MongoDB connection string
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.log("NOT CONNECTED TO NETWORK", err));
};

module.exports = connectToMongo;
