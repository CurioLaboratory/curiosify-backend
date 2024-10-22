const loadSecrets = require('./loadSecrets.js');  // Your AWS Secrets Manager loader module
const mongoose = require("mongoose");
(async () => {
    try {
        await loadSecrets();  // Wait for secrets to load
    } catch (error) {
        console.error("Failed to load secrets or connect to MongoDB:", error);
        process.exit(1); // Exit the process if secrets loading fails
    }
})();

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
