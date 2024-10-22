const express = require("express");
const cors = require("cors");
const loadSecrets = require('./db.js');  // Your AWS Secrets Manager loader module
const connectToMongo = require("./db.js"); // MongoDB connection
const redisClientPromise = require("./redisclient.js"); // Redis client promise

const app = express();

// Load secrets before anything else
(async () => {
    try {
        await loadSecrets();  // Wait for secrets to load
        await connectToMongo(); // Connect to MongoDB after secrets are loaded

        // Wait for the Redis client to be ready
        const redisClient = await redisClientPromise;

        // Now Redis client is available, set up listeners
        redisClient.on('connect', () => {
            console.log('Redis client connected');
        });

        redisClient.on('error', (err) => {
            console.error('Redis error:', err);
        });

    } catch (error) {
        console.error("Failed to load secrets, connect to MongoDB, or Redis:", error);
        process.exit(1); // Exit the process if initialization fails
    }
})();

const corsOptions = {
    origin: 'https://usecuriosify.in',  // Your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
    credentials: true,  // If you are using cookies or auth headers
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.send("Test API success");
});

app.use("/api", require("./routes/index")); // Your routes

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
