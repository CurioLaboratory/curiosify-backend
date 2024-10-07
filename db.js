const mongoose = require("mongoose");
require('dotenv').config();

const mongostr = process.env.MONGO_STR;

const connectToMongo = () => {
    mongoose
        .connect("mongodb://127.0.0.1:27017/curio")
        .then(console.log("Connected to MongoDB"))
        .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))
}
        .connect(mongostr, { useNewUrlParser: true, useUnifiedTopology: true }) // Options for better connection handling
        .then(() => console.log("Connected to MongoDB")) // Properly passing the function
        .catch((err) => console.log("NOT CONNECTED TO NETWORK", err));
};

module.exports = connectToMongo;
