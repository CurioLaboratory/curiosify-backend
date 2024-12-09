const redis = require('redis');
require('dotenv').config(); // Load environment variables from .env file

// Create a Redis client using the REDIS_URL from the environment variables
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

// Handle Redis errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Function to connect to Redis
const connectRedis = async () => {
  try {
    console.log('Connecting to Redis...');
    console.log(`Redis URL: ${process.env.REDIS_URL}`);
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
};

// Connect to Redis
connectRedis();

module.exports = redisClient;
