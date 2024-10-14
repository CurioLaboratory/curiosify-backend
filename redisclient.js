// redis.js
const redis = require('redis');
// const redisClient = redis.createClient({
//   url: 'rediss://rediscurio-hqoywe.serverless.use1.cache.amazonaws.com:6379', 
// });
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
};

connectRedis();

module.exports = redisClient;
