const redis = require('redis');
const AWS = require('aws-sdk');
const { SecretsManager } = require('aws-sdk');

// Set your region
const region = 'us-east-1'; // Set your region accordingly
AWS.config.update({ region });

const secretsManager = new SecretsManager();

// Load secrets from AWS Secrets Manager
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
            process.env.REDIS_URL = secret.REDIS_URL;  // This needs to be set before creating the Redis client
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
        await loadSecrets(); // Load secrets before connecting to Redis

        const redisURl = process.env.REDIS_URL; // Retrieve the Redis URL after secrets are loaded
        const redisClient = redis.createClient({
            url: redisURl,  // Now this should be defined
        });

        redisClient.on('error', (err) => {
            console.error('Redis error:', err);
        });

        await redisClient.connect();  // Await the connection to Redis
        console.log('Connected to Redis');
        console.log(redisURl);

        module.exports = redisClient;  // Export the redisClient after successful connection

    } catch (err) {
        console.error('Error connecting to Redis:', err);
        process.exit(1); // Exit process if Redis connection fails
    }
})();
