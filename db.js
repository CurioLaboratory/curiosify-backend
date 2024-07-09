const mongoose = require("mongoose");
require('dotenv').config()
const mongostr = process.env.MONGO_STR;

const connectToMongo = () => {
    mongoose
        .connect(mongostr, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(console.log("Connected to MongoDB"))
        .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))
}

module.exports = connectToMongo;