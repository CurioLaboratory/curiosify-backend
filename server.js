const express = require("express");
const cors = require("cors");
const loadSecrets = require('./loadSecrets.js'); // Your AWS Secrets Manager loader module
const connectToMongo = require("./db.js"); // MongoDB connection
const redisClient = require("./redisclient.js"); // Redis client

const app = express();

// Load secrets before anything else
(async () => {
    try {
        await connectToMongo(); // Connect to MongoDB after secrets are loaded
    } catch (error) {
        console.error("Failed to load secrets or connect to MongoDB:", error);
        process.exit(1); // Exit the process if secrets loading fails
    }
})();

// Allow all origins (CORS setup for debugging)
app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/test', (req, res) => {
    res.send("Test API success");
});

// Routes
app.use("/api", require("./routes/index")); // Your routes

// Redis connection setup
redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});