const redis = require('redis');
<<<<<<< HEAD
// const redisClient = redis.createClient({
//   url: 'rediss://rediscurio-hqoywe.serverless.use1.cache.amazonaws.com:6379', 
// });
const redisClient = redis.createClient();
=======
require('dotenv').config(); // Load environment variables from .env file
>>>>>>> 968cdb5bf0f769a790daaef454d216c4e25db557

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
