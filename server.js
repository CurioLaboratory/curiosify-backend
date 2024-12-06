require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectToMongo = require("./db.js"); // MongoDB connection
const redisClient = require("./redisclient.js"); // Redis client
const app = express();
// Load secrets before anything else



connectToMongo();
const corsOptions = {
  origin: 'https://usecuriosify.in',  // Your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
  credentials: true,  // If you are using cookies or auth headers
};
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.send("Test API success");
});

app.use("/api", require("./routes/index"));

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
