// redis.js
const redis = require('redis');
const AWS = require('aws-sdk');
const { SecretsManager } = require('aws-sdk');

// Set your region
const region = 'us-east-1'; // Change this to your desired region
AWS.config.update({ region });

const secretsManager = new SecretsManager();

const loadSecrets = async () => {
    try {
        const data = await secretsManager.getSecretValue({ SecretId: 'curiosify-backend-secrets' }).promise();
        if ('SecretString' in data) {
            const secret = JSON.parse(data.SecretString);

            // Set environment variables
            process.env.MONGO_STR = secret.MONGO_STR; 
            process.env.JWT_SECRET = secret.JWT_SECRET;
            process.env.JWT_EXPIRES_IN = secret.JWT_EXPIRES_IN;
            process.env.FRONTEND_URL = secret.FRONTEND_URL;
            process.env.REDIS_URL = secret.REDIS_URL;
            process.env.SES_HOST = secret.SES_HOST;
            process.env.SES_PORT = secret.SES_PORT;
            process.env.SES_USER = secret.SES_USER;
            process.env.SES_PASS = secret.SES_PASS;
        }
    } catch (err) {
        console.error('Error retrieving secrets:', err);
    }
};

(async () => {
    try {
          await loadSecrets(); // Load secrets before connecting to MongoDB
    } catch (error) {
        console.error("Failed to load secrets or connect to MongoDB:", error);
        process.exit(1); // Exit the process if secrets loading fails
    }
})();
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
