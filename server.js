const express = require("express");
const cors = require("cors");
//const loadSecrets = require('./loadSecrets.js');  // Your AWS Secrets Manager loader module
const connectToMongo = require("./db.js"); // MongoDB connection
const redisClient = require("./redisclient.js"); // Redis client
const bodyParser = require("body-parser");
const app = express();
const multer = require("multer");
require('dotenv').config();

// Load secrets before anything else
(async () => {
  try {
    await connectToMongo(); // Connect to MongoDB after secrets are loaded
  } catch (error) {
    console.error("Failed to load secrets or connect to MongoDB:", error);
    process.exit(1); // Exit the process if secrets loading fails
  }
})();


connectToMongo();
const corsOptions = {
  origin: "https://usecuriosify.in", // Your frontend domain
  // origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  credentials: true, // If you are using cookies or auth headers
};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.send("Test API success");
});

// Routes
app.use("/api", require("./routes/index")); // Your routes

// Redis connection setup
redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
