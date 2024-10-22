const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db.js"); // MongoDB connection
const connectRedis = require("./redis.js"); // Redis connection

const app = express();

(async () => {
    try {
        await connectToMongo(); // Connect to MongoDB
        const redisClient = await connectRedis(); // Connect to Redis and get client

        // Redis connection setup after client is retrieved
        redisClient.on('connect', () => {
            console.log('Redis client connected');
        });

        redisClient.on('error', (err) => {
            console.error('Redis error:', err);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB or Redis:", error);
        process.exit(1); // Exit the process if connections fail
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
