// redis.js
const redis = require('redis');
const redisURl=process.env.REDISS_URL;
const redisClient = redis.createClient({

  url: redisURl, 
});


redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
    console.log(redisURl);
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
};

connectRedis();

module.exports = redisClient;
